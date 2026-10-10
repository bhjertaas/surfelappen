import { href } from '../app/routes.ts';
import { Logo } from '../components/Logo.tsx';
import { Page } from '../components/Page.tsx';
import { missions } from '../content/missions/index.ts';
import { useI18n } from '../i18n/i18n.ts';
import { useProgress } from '../progress/hooks.ts';
import { hasStarted, resumeRoute } from '../progress/selectors.ts';

export function Start() {
  const { m } = useI18n();
  const { progress } = useProgress();
  const returning = hasStarted(progress);

  return (
    <Page title={m.app.name} bare theme="neon" heading={<Logo label={m.app.name} />}>
      <p class="tagline">{m.app.tagline}</p>
      <p class="lead">{m.app.pitch}</p>
      <div class="actions">
        {returning && (
          <a class="button" href={href(resumeRoute(progress, missions))}>
            {m.start.continue}
          </a>
        )}
        <a class={returning ? 'button button--secondary' : 'button'} href={href({ name: 'town' })}>
          {m.start.start}
        </a>
      </div>
      <p>{m.start.free}</p>
      <p>
        <a href={href({ name: 'about' })}>{m.start.about}</a>
      </p>
    </Page>
  );
}
