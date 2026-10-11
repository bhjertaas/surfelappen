import { useEffect, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { Rich } from '../../components/Rich.tsx';
import type { BrowserText } from '../../content/missions/text-types.ts';
import type { BrowserStep } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import { useHeadingFocus } from '../useHeadingFocus.ts';
import { readAddressBar, resultsAddress, searchFinds } from './browser.ts';
import { completeWebStep } from './flow.ts';
import type { WebViewProps } from './types.ts';

type Screen =
  | { readonly kind: 'start' }
  | { readonly kind: 'results'; readonly query: string; readonly fromAddressBar: boolean }
  | { readonly kind: 'ad' }
  | { readonly kind: 'elsewhere'; readonly host: string }
  | { readonly kind: 'target'; readonly via: 'search' | 'address' };

/**
 * "Snarveien": a toy browser. Reach the target by searching, then by typing its
 * address. Nothing is loaded: every "page" is drawn here.
 */
export function BrowserView({
  step,
  text,
  guide,
  guideName,
  run,
  advance,
}: WebViewProps & { step: BrowserStep; text: BrowserText }) {
  const { m } = useI18n();
  const [engineId, setEngineId] = useState(step.engines[0]?.id ?? '');
  const [history, setHistory] = useState<Screen[]>([{ kind: 'start' }]);
  const [clicks, setClicks] = useState(0);
  const [bar, setBar] = useState(step.engines[0]?.host ?? '');
  const [query, setQuery] = useState('');
  const screen = history[history.length - 1] ?? { kind: 'start' };
  const engine = step.engines.find((e) => e.id === engineId) ?? step.engines[0];
  const engineName = (engine && text.engines[engine.id]) ?? '';
  // Focus stays in the toy browser while you use it; the page area is a live region.
  const heading = useHeadingFocus(0);
  const message = useRef<HTMLDivElement>(null);

  const addressOf = (s: Screen): string => {
    switch (s.kind) {
      case 'start':
        return engine?.host ?? '';
      case 'results':
        return resultsAddress(engine?.host ?? '', s.query);
      case 'ad':
        return step.adHost;
      case 'elsewhere':
        return s.host;
      case 'target':
        return step.target;
    }
  };

  const reached = screen.kind === 'target';
  useEffect(() => {
    if (reached) message.current?.focus();
  }, [reached]);

  // The address bar shows where you are, as in a real browser. It's set on every move
  // (not in an effect), so nothing typed right after a move is overwritten.
  const show = (s: Screen, engineHost = engine?.host ?? '') =>
    setBar(s.kind === 'start' ? engineHost : addressOf(s));
  const go = (s: Screen) => {
    setClicks((c) => c + 1);
    setHistory((h) => [...h, s]);
    show(s);
  };
  const back = () => {
    const previous = history[history.length - 2];
    if (!previous) return;
    setHistory((h) => h.slice(0, -1));
    show(previous);
  };
  const restart = () => {
    setHistory([{ kind: 'start' }]);
    setClicks(0);
    setQuery('');
    show({ kind: 'start' });
  };

  const submitBar = (e: Event) => {
    e.preventDefault();
    const typed = readAddressBar(bar);
    if (typed.kind === 'empty') return;
    if (typed.kind === 'search') go({ kind: 'results', query: typed.query, fromAddressBar: true });
    else if (typed.host === step.target) go({ kind: 'target', via: 'address' });
    else go({ kind: 'elsewhere', host: typed.host });
  };
  const submitSearch = (e: Event) => {
    e.preventDefault();
    if (query.trim() !== '') go({ kind: 'results', query: query.trim(), fromAddressBar: false });
  };

  const page = (() => {
    switch (screen.kind) {
      case 'start':
        return (
          <div class="toy-page toy-page--start">
            <p class="toy-engine">{engineName}</p>
            <form class="toy-search" onSubmit={submitSearch}>
              <input
                type="search"
                aria-label={format(m.web.searchLabel, { engine: engineName })}
                value={query}
                onInput={(e) => setQuery(e.currentTarget.value)}
                autocomplete="off"
              />
              <button type="submit" class="button">
                {m.web.search}
              </button>
            </form>
            <fieldset class="toy-engines">
              <legend>{m.web.searchWith}</legend>
              {step.engines.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  class="button button--secondary"
                  aria-pressed={e.id === engineId}
                  onClick={() => {
                    setEngineId(e.id);
                    show({ kind: 'start' }, e.host);
                  }}
                >
                  {text.engines[e.id]}
                </button>
              ))}
            </fieldset>
            {engine?.trees && (
              <p class="toy-note">
                <span aria-hidden="true">🌳 </span>
                {text.trees}
              </p>
            )}
          </div>
        );
      case 'results': {
        const found = searchFinds(step, screen.query);
        const single = !/[\s.]/.test(screen.query);
        return (
          <div class="toy-page">
            <p class="toy-engine toy-engine--small">{engineName}</p>
            {screen.fromAddressBar && single && (
              <p class="toy-note">{format(text.becameSearch, { query: screen.query })}</p>
            )}
            {found ? (
              <ol class="toy-results">
                <li>
                  <span class="toy-ad">{m.web.adLabel}</span>{' '}
                  <span class="toy-host">{step.adHost}</span>
                  <button type="button" class="toy-link" onClick={() => go({ kind: 'ad' })}>
                    {text.adTitle}
                  </button>
                  <span>{text.adSnippet}</span>
                </li>
                <li>
                  <span class="toy-host">{step.target}</span>
                  <button
                    type="button"
                    class="toy-link"
                    onClick={() => go({ kind: 'target', via: 'search' })}
                  >
                    {text.targetTitle}
                  </button>
                  <span>{text.targetSnippet}</span>
                </li>
              </ol>
            ) : (
              <p>{format(text.noResults, { query: screen.query })}</p>
            )}
          </div>
        );
      }
      case 'ad':
        return (
          <div class="toy-page">
            <p class="toy-note toy-note--warn">{text.clickedAd}</p>
          </div>
        );
      case 'elsewhere':
        return (
          <div class="toy-page">
            <p>{format(text.elsewhere, { host: screen.host })}</p>
          </div>
        );
      case 'target':
        return (
          <div class="toy-page toy-page--target">
            <p class="toy-target-logo">{text.targetName}</p>
            <p>{text.targetPage}</p>
          </div>
        );
    }
  })();

  return (
    <section class="web">
      <h2 ref={heading} tabIndex={-1}>
        {m.web.headings.browser}
      </h2>
      {history.length === 1 && !reached && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.brief}</p>
        </Guide>
      )}
      <fieldset class="toy-browser">
        <legend class="visually-hidden">{m.web.browserLabel}</legend>
        <form class="toy-bar" onSubmit={submitBar}>
          <button
            type="button"
            class="toy-bar__button"
            aria-label={m.web.back}
            disabled={history.length < 2}
            onClick={back}
          >
            ←
          </button>
          <button
            type="button"
            class="toy-bar__button"
            aria-label={m.web.home}
            onClick={() => go({ kind: 'start' })}
          >
            ⌂
          </button>
          <input
            type="text"
            inputMode="url"
            aria-label={m.web.addressBar}
            value={bar}
            onFocus={(e) => e.currentTarget.select()}
            onInput={(e) => setBar(e.currentTarget.value)}
            autocomplete="off"
            autocapitalize="off"
            spellcheck={false}
          />
          <button type="submit" class="toy-bar__button toy-bar__go">
            {m.web.go}
          </button>
        </form>
        <div class="toy-viewport" aria-live="polite">
          {page}
        </div>
      </fieldset>
      <p class="muted">{format(m.web.clicks, { count: clicks })}</p>

      {reached && (
        <div ref={message} tabIndex={-1} class="feedback feedback--correct">
          {screen.via === 'search' ? (
            <>
              <Guide portrait={guide} name={guideName}>
                <p>
                  <Rich text={format(text.afterSearch, { clicks })} />
                </p>
              </Guide>
              <div class="actions">
                <button type="button" class="button" onClick={restart}>
                  {m.web.tryAgain}
                </button>
              </div>
            </>
          ) : (
            <>
              <Guide portrait={guide} name={guideName}>
                <p>{text.afterAddress}</p>
                <p>{text.done}</p>
              </Guide>
              <div class="actions">
                <button
                  type="button"
                  class="button"
                  onClick={() => advance(completeWebStep(run, step.id))}
                >
                  {m.web.next}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
