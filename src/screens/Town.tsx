import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { isTouchOnly } from '../app/device.ts';
import { navigate } from '../app/router.ts';
import { href, type Route } from '../app/routes.ts';
import { Page } from '../components/Page.tsx';
import { art, characterFor } from '../content/art.ts';
import { findMission } from '../content/missions/index.ts';
import { buildings as allBuildings, buildingsFor, TOWN_SIZE, TOWN_START } from '../content/town.ts';
import type { Building, Point } from '../content/types.ts';
import { format, plural } from '../i18n/format.ts';
import { useI18n } from '../i18n/i18n.ts';
import { useProgress } from '../progress/hooks.ts';
import { isLocked, visitBuilding } from '../progress/selectors.ts';

type Variant = 'map' | 'list';

/** How long the character takes to walk to a place (matches the CSS transition). */
const WALK_MS = 700;

function pct(value: number, of: number): string {
  return `${(value / of) * 100}%`;
}

function targetOf(building: Building): Route {
  const firstMission = building.missions[0];
  return building.status === 'passport' || firstMission === undefined
    ? { name: 'passport' }
    : { name: 'mission-intro', missionId: firstMission };
}

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

interface ControlProps {
  building: Building;
  variant: Variant;
  touchOnly: boolean;
  onClosed: (message: string) => void;
  /** Map only: walk the character to the place, then run `then`. */
  onWalk?: (building: Building, then: () => void) => void;
}

/** One destination, rendered the same way in the picture and in the list (FR-02). */
function BuildingControl({ building, variant, touchOnly, onClosed, onWalk }: ControlProps) {
  const { m } = useI18n();
  const { store, progress } = useProgress();
  const text = m.buildings[building.id];
  if (!text) return null;
  const locked = isLocked(progress, building);
  const opener = allBuildings.find((b) => b.missions.some((id) => id === building.after));

  const needsKeyboard =
    touchOnly &&
    building.missions.some((id) => findMission(id)?.requires.includes('physical-keyboard'));
  const badge = locked
    ? format(m.town.locked, { place: (opener && m.buildings[opener.id]?.name) ?? '' })
    : building.status === 'coming-soon'
      ? m.town.comingSoon
      : needsKeyboard
        ? m.town.needsKeyboard
        : null;
  const className = `building building--${variant} building--${locked ? 'locked' : building.status}`;
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
  const visit = () => store.update((p) => visitBuilding(p, building.id));

  if (building.status === 'coming-soon' || locked) {
    return (
      <button
        type="button"
        class={className}
        style={style}
        onClick={() => {
          visit();
          const show = () => onClosed(text.closed ?? '');
          onWalk ? onWalk(building, show) : show();
        }}
      >
        {content}
      </button>
    );
  }

  const target = targetOf(building);
  return (
    <a
      class={className}
      style={style}
      href={href(target)}
      onClick={(event) => {
        // Selecting a building is the visit (Nysgjerrig); the screen also records it for deep links.
        visit();
        // On the map, walk there first. Modified clicks (new tab etc.) keep the browser's behaviour.
        if (!onWalk || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
          return;
        event.preventDefault();
        onWalk(building, () => navigate(target));
      }}
    >
      {content}
    </a>
  );
}

/** The player's character on the map. Decoration: the controls say where you go. */
function Walker({ at, facing }: { at: Point; facing: 'front' | 'back' }) {
  const { audience } = useI18n();
  const character = characterFor(audience);
  const image = facing === 'front' ? character.front : character.back;
  return (
    <img
      class="town__walker"
      src={image.src}
      alt=""
      style={{ left: pct(at.x, TOWN_SIZE.width), top: pct(at.y, TOWN_SIZE.height) }}
    />
  );
}

export function Town() {
  const { m, locale, audience } = useI18n();
  const { progress } = useProgress();
  const buildings = buildingsFor(audience);
  const [closedMessage, setClosedMessage] = useState('');
  const touchOnly = useMemo(isTouchOnly, []);
  const [walker, setWalker] = useState<{ at: Point; facing: 'front' | 'back' }>({
    at: TOWN_START,
    facing: 'front',
  });
  const walkTimer = useRef<number>(undefined);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(walkTimer.current), []);

  // On narrow screens the map scrolls sideways; start with the square in view.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  const walkTo = (building: Building, then: () => void) => {
    window.clearTimeout(walkTimer.current);
    if (reducedMotion()) return then();
    setWalker((w) => ({
      at: building.door,
      facing: building.door.y < w.at.y ? 'back' : 'front',
    }));
    walkTimer.current = window.setTimeout(then, WALK_MS);
  };

  return (
    <Page title={m.town.title} wide>
      <p>{m.town.intro}</p>
      <p class="sticker-count">
        {plural(locale, progress.stickers.length, m.town.stickerCount)}{' '}
        <a href={href({ name: 'passport' })}>{m.town.toPassport}</a>
      </p>
      <div class="town__scroll" ref={scroller}>
        <figure class="town__map" aria-label={m.town.mapLabel}>
          <img
            class="town__picture"
            src={art.town.src}
            width={art.town.width}
            height={art.town.height}
            alt=""
          />
          <Walker at={walker.at} facing={walker.facing} />
          <ul class="town__hotspots">
            {buildings.map((b) => (
              <li key={b.id}>
                <BuildingControl
                  building={b}
                  variant="map"
                  touchOnly={touchOnly}
                  onClosed={setClosedMessage}
                  onWalk={walkTo}
                />
              </li>
            ))}
          </ul>
        </figure>
      </div>
      <p class="town__message" role="status">
        {closedMessage}
      </p>
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
    </Page>
  );
}
