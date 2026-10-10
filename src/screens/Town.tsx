import { useMemo, useState } from 'preact/hooks';
import { isTouchOnly } from '../app/device.ts';
import { href, type Route } from '../app/routes.ts';
import { Page } from '../components/Page.tsx';
import { art } from '../content/art.ts';
import { findMission } from '../content/missions/index.ts';
import { buildingsFor, TOWN_SIZE } from '../content/town.ts';
import type { Building } from '../content/types.ts';
import { plural } from '../i18n/format.ts';
import { useI18n } from '../i18n/i18n.ts';
import { useProgress } from '../progress/hooks.ts';
import { visitBuilding } from '../progress/selectors.ts';

type Variant = 'map' | 'list';

function pct(value: number, of: number): string {
  return `${(value / of) * 100}%`;
}

interface ControlProps {
  building: Building;
  variant: Variant;
  touchOnly: boolean;
  onClosed: (message: string) => void;
}

/** One destination, rendered the same way in the picture and in the list (FR-02). */
function BuildingControl({ building, variant, touchOnly, onClosed }: ControlProps) {
  const { m } = useI18n();
  const { store } = useProgress();
  const text = m.buildings[building.id];
  if (!text) return null;

  const needsKeyboard =
    touchOnly &&
    building.missions.some((id) => findMission(id)?.requires.includes('physical-keyboard'));
  const badge =
    building.status === 'coming-soon'
      ? m.town.comingSoon
      : needsKeyboard
        ? m.town.needsKeyboard
        : null;
  const className = `building building--${variant} building--${building.status}`;
  const style =
    variant === 'map'
      ? {
          left: pct(building.hotspot.x, TOWN_SIZE.width),
          top: pct(building.hotspot.y, TOWN_SIZE.height),
          width: pct(building.hotspot.w, TOWN_SIZE.width),
          height: pct(building.hotspot.h, TOWN_SIZE.height),
        }
      : undefined;
  const content = (
    <>
      <span class="building__name">{text.name}</span>
      {badge && <span class="building__badge">{badge}</span>}
      {variant === 'list' && <span class="building__about">{text.about}</span>}
    </>
  );

  if (building.status === 'coming-soon') {
    return (
      <button
        type="button"
        class={className}
        style={style}
        onClick={() => {
          store.update((p) => visitBuilding(p, building.id));
          onClosed(text.closed ?? '');
        }}
      >
        {content}
      </button>
    );
  }

  const firstMission = building.missions[0];
  const target: Route =
    building.status === 'passport' || firstMission === undefined
      ? { name: 'passport' }
      : { name: 'mission-intro', missionId: firstMission };
  return (
    <a class={className} style={style} href={href(target)}>
      {content}
    </a>
  );
}

export function Town() {
  const { m, locale, audience } = useI18n();
  const { progress } = useProgress();
  const buildings = buildingsFor(audience);
  const [closedMessage, setClosedMessage] = useState('');
  const touchOnly = useMemo(isTouchOnly, []);

  return (
    <Page title={m.town.title} wide>
      <p>{m.town.intro}</p>
      <p class="sticker-count">
        {plural(locale, progress.stickers.length, m.town.stickerCount)}{' '}
        <a href={href({ name: 'passport' })}>{m.town.toPassport}</a>
      </p>
      <div class="town">
        <nav class="town__list" aria-label={m.town.listLabel}>
          <ul>
            {buildings.map((b) => (
              <li key={b.id}>
                <BuildingControl
                  building={b}
                  variant="list"
                  touchOnly={touchOnly}
                  onClosed={setClosedMessage}
                />
              </li>
            ))}
          </ul>
        </nav>
        <figure class="town__map" aria-label={m.town.mapLabel}>
          <img
            class="pixel-art"
            src={art.town.src}
            width={art.town.width}
            height={art.town.height}
            alt=""
          />
          <ul class="town__hotspots">
            {buildings.map((b) => (
              <li key={b.id}>
                <BuildingControl
                  building={b}
                  variant="map"
                  touchOnly={touchOnly}
                  onClosed={setClosedMessage}
                />
              </li>
            ))}
          </ul>
        </figure>
      </div>
      <p class="town__message" role="status">
        {closedMessage}
      </p>
    </Page>
  );
}
