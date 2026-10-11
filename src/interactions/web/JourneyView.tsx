import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Guide } from '../../components/Guide.tsx';
import { Rich } from '../../components/Rich.tsx';
import type { JourneyText } from '../../content/missions/text-types.ts';
import type { JourneyStep } from '../../content/types.ts';
import { format } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import { useHeadingFocus } from '../useHeadingFocus.ts';
import { completeWebStep } from './flow.ts';
import { isCut, onPath, route } from './network.ts';
import type { WebViewProps } from './types.ts';

type Phase = 'start' | 'looked-up' | 'sending' | 'arrived' | 'resending' | 'rerouted';

/** How long a packet takes per hop in the picture. */
const HOP_MS = 450;

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** "Pakken på reise": look up the name, send, break a cable, send again. */
export function JourneyView({
  step,
  text,
  guide,
  guideName,
  run,
  advance,
}: WebViewProps & { step: JourneyStep; text: JourneyText }) {
  const { m } = useI18n();
  const [phase, setPhase] = useState<Phase>('start');
  const [hop, setHop] = useState(0);
  const timer = useRef<number>(undefined);
  const settled = phase !== 'sending' && phase !== 'resending';
  const heading = useHeadingFocus(settled ? phase : 'moving');

  const broken = phase === 'arrived' || phase === 'resending' || phase === 'rerouted';
  const path = useMemo(() => route(step, broken ? [step.cut] : []), [step, broken]);
  const showPath =
    phase === 'sending' || phase === 'arrived' || phase === 'resending' || phase === 'rerouted';

  // Move the packet one hop at a time, then settle.
  useEffect(() => {
    if (settled || !path) return;
    if (reducedMotion() || hop >= path.length - 1) {
      setHop(path.length - 1);
      setPhase(phase === 'sending' ? 'arrived' : 'rerouted');
      return;
    }
    timer.current = window.setTimeout(() => setHop((h) => h + 1), HOP_MS);
    return () => window.clearTimeout(timer.current);
  }, [phase, hop, settled, path]);

  const send = (next: Phase) => {
    setHop(0);
    setPhase(next);
  };

  const node = (id: string) => step.nodes.find((n) => n.id === id);
  const packetAt = path && showPath ? node(path[Math.min(hop, path.length - 1)] ?? '') : undefined;
  const litUpTo = path ? path.slice(0, hop + 1) : null;

  return (
    <section class="web">
      <h2 ref={heading} tabIndex={-1}>
        {m.web.headings.journey}
      </h2>
      {phase === 'start' && (
        <Guide portrait={guide} name={guideName}>
          <p>{text.brief}</p>
        </Guide>
      )}
      <svg class="network" viewBox="0 0 280 360" role="img" aria-label={m.web.networkLabel}>
        {step.cables.map((cable) => {
          const cut = isCut(step, cable, broken);
          const lit = showPath && onPath(litUpTo, cable);
          const a = node(cable[0]);
          const b = node(cable[1]);
          if (!a || !b) return null;
          return (
            <g key={cable.join('-')}>
              <line
                class={
                  cut
                    ? 'network__cable network__cable--cut'
                    : lit
                      ? 'network__cable network__cable--lit'
                      : 'network__cable'
                }
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
              />
              {cut && (
                <text
                  class="network__cut"
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 + 6}
                  text-anchor="middle"
                >
                  ✕
                </text>
              )}
            </g>
          );
        })}
        {step.nodes.map((n) => {
          const left = n.side === 'left';
          const x = left ? n.x - 16 : n.x + 16;
          const anchor = left ? 'end' : 'start';
          return (
            <g key={n.id}>
              <circle class="network__node" cx={n.x} cy={n.y} r="10" />
              <text class="network__label" x={x} y={n.y + 5} text-anchor={anchor}>
                {text.nodes[n.id]}
              </text>
              {n.id === step.to && phase !== 'start' && (
                <text class="network__ip" x={x} y={n.y + 22} text-anchor={anchor}>
                  {step.ip}
                </text>
              )}
            </g>
          );
        })}
        {packetAt && <circle class="network__packet" cx={packetAt.x} cy={packetAt.y} r="6" />}
      </svg>

      {phase === 'start' && (
        <div class="actions">
          <button type="button" class="button" onClick={() => setPhase('looked-up')}>
            {m.web.lookUp}
          </button>
        </div>
      )}
      {phase === 'looked-up' && (
        <>
          <Guide portrait={guide} name={guideName}>
            <p>
              <Rich text={format(text.lookedUp, { ip: step.ip })} />
            </p>
          </Guide>
          <div class="actions">
            <button type="button" class="button" onClick={() => send('sending')}>
              {m.web.send}
            </button>
          </div>
        </>
      )}
      {phase === 'arrived' && (
        <>
          <Guide portrait={guide} name={guideName}>
            <p>{text.arrived}</p>
            <p>{text.cutIntro}</p>
          </Guide>
          <div class="actions">
            <button type="button" class="button" onClick={() => send('resending')}>
              {m.web.sendAgain}
            </button>
          </div>
        </>
      )}
      {phase === 'rerouted' && (
        <>
          <Guide portrait={guide} name={guideName}>
            <p>{text.rerouted}</p>
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
    </section>
  );
}
