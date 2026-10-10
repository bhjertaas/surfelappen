import type { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { focusScreenHeading } from '../app/focus.ts';
import { href } from '../app/routes.ts';
import type { MissionTheme } from '../content/types.ts';
import { useI18n } from '../i18n/i18n.ts';

interface PageProps {
  /** The screen's <h1>, also used in the document title. */
  title: string;
  /** Hide the site header (the start screen has its own). */
  bare?: boolean;
  /** Use the full layout width (the town). */
  wide?: boolean;
  /** A mission's theme (colours and fonts for the whole screen). */
  theme?: MissionTheme;
  children: ComponentChildren;
}

/** Layout for every screen: header with a way back to town, <main>, focus and title. */
export function Page({ title, bare = false, wide = false, theme, children }: PageProps) {
  const { m } = useI18n();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = title === m.app.name ? m.app.name : `${title} – ${m.app.name}`;
    focusScreenHeading(heading.current);
  }, [title, m.app.name]);

  return (
    <div class={theme ? `screen theme--${theme}` : 'screen'}>
      {!bare && (
        <header class="site-header">
          <a class="site-header__home" href={href({ name: 'start' })}>
            {m.nav.home}
          </a>
          <nav aria-label={m.nav.label}>
            <ul class="site-header__nav">
              <li>
                <a href={href({ name: 'town' })}>{m.nav.town}</a>
              </li>
              <li>
                <a href={href({ name: 'passport' })}>{m.nav.passport}</a>
              </li>
            </ul>
          </nav>
        </header>
      )}
      <main class={wide ? 'page page--wide' : 'page'}>
        <h1 ref={heading} tabIndex={-1}>
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
}
