import { useEffect, useId, useMemo, useReducer, useRef } from 'preact/hooks';
import type { TypingStepText } from '../../content/missions/text-types.ts';
import type { TypingStep as TypingStepDef } from '../../content/types.ts';
import { format, percent } from '../../i18n/format.ts';
import { useI18n } from '../../i18n/i18n.ts';
import type { StepViewProps } from '../types.ts';
import { completeTypingStep, usePositional } from './flow.ts';
import { keyForChar } from './keymap-nb.ts';
import { expectedChar } from './matcher.ts';
import { OnScreenKeyboard } from './OnScreenKeyboard.tsx';
import { initialStepState, typingStepReducer } from './stepState.ts';

/**
 * One typing step (FR-05, ADR 0014). Keystrokes are read from a native, labelled
 * text field that stays empty: nothing typed is stored, only the result.
 */
export function TypingStep({ mission, text, stepId, run, save, advance }: StepViewProps) {
  const { m } = useI18n();
  const step =
    mission.interaction === 'typing' ? mission.steps.find((s) => s.id === stepId) : undefined;
  const stepText = text.steps?.[stepId] as TypingStepText | undefined;
  if (!step || !stepText || run.interaction !== 'typing' || mission.interaction !== 'typing') {
    return null;
  }
  return (
    <>
      <p class="step-progress">
        {format(m.mission.progress, {
          current: mission.steps.indexOf(step) + 1,
          total: mission.steps.length,
        })}
      </p>
      <Drill
        key={stepId}
        step={step}
        instruction={stepText.instruction}
        positional={run.positional}
        onUsePositional={() => save(usePositional(run))}
        onDone={(final) => advance(completeTypingStep(run, stepId, final))}
      />
    </>
  );
}

interface DrillProps {
  step: TypingStepDef;
  instruction: string;
  positional: boolean;
  onUsePositional: () => void;
  onDone: (final?: { accuracy: number; errors: number }) => void;
}

function Drill({ step, instruction, positional, onUsePositional, onDone }: DrillProps) {
  const { m, locale } = useI18n();
  const reducer = useMemo(() => typingStepReducer(step), [step]);
  const [state, dispatch] = useReducer(reducer, step, (s) => initialStepState(s, positional));
  const input = useRef<HTMLInputElement>(null);
  const resultPanel = useRef<HTMLElement>(null);
  const helpId = useId();
  const isFinal = step.minAccuracy !== undefined;

  const expected = expectedChar(state.drill);
  const keyName = (ch: string) => (ch === ' ' ? m.typing.space : ch.toUpperCase());
  const fingerFor = (ch: string) => {
    const finger = keyForChar(ch)?.finger;
    return finger ? m.typing.fingers[finger] : '';
  };

  // Focus the text field once the screen has settled (the page focuses its heading first).
  useEffect(() => {
    const timer = window.setTimeout(() => input.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state.result) resultPanel.current?.focus();
  }, [state.result]);

  const onKeyDown = (event: KeyboardEvent) => {
    dispatch({
      type: 'key',
      input: {
        key: event.key,
        code: event.code,
        repeat: event.repeat,
        isComposing: event.isComposing,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
      },
      capsLock: event.getModifierState?.('CapsLock') ?? false,
    });
    // Keep typed characters out of the field; leave Tab, Enter and shortcuts alone.
    if ([...event.key].length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
    }
  };

  const status = state.lastWrong
    ? format(m.typing.wrongKey, {
        typed: keyName(state.lastWrong.typed),
        expected: keyName(state.lastWrong.expected),
        finger: fingerFor(state.lastWrong.expected),
      })
    : expected !== undefined
      ? format(m.typing.nextKey, { key: keyName(expected), finger: fingerFor(expected) })
      : '';

  const position = state.drill.position;
  const line = state.drill.text;

  return (
    <>
      <p class="instruction">{instruction}</p>
      {step.drills.length > 1 && (
        <p class="step-progress">
          {format(m.typing.lineProgress, {
            current: state.lineIndex + 1,
            total: step.drills.length,
          })}
        </p>
      )}

      <div class="drill" aria-hidden="true">
        <p class="drill__line">
          <span class="drill__done">{line.slice(0, position)}</span>
          {expected !== undefined && (
            <span class="drill__current">{expected === ' ' ? '␣' : expected}</span>
          )}
          <span class="drill__rest">{line.slice(position + 1)}</span>
        </p>
        {expected !== undefined && <p class="drill__next">{keyName(expected)}</p>}
      </div>

      <p
        class={state.lastWrong ? 'typing-status typing-status--wrong' : 'typing-status'}
        aria-live="polite"
      >
        {state.lastWrong && (
          <span class="typing-status__symbol" aria-hidden="true">
            ✗{' '}
          </span>
        )}
        {status}
      </p>

      {!state.result && (
        <div class="capture">
          <label class="capture__label">
            {m.typing.inputLabel}
            <input
              ref={input}
              class="capture__input"
              type="text"
              inputMode="none"
              autoComplete="off"
              autoCapitalize="off"
              spellcheck={false}
              aria-describedby={helpId}
              onKeyDown={onKeyDown}
              onInput={(event) => {
                event.currentTarget.value = '';
              }}
            />
          </label>
          <p id={helpId} class="muted">
            {m.typing.inputHelp}
          </p>
        </div>
      )}

      {state.capsLock && <p class="notice notice--small">{m.typing.capsLock}</p>}

      {state.layoutHint && (
        <div class="notice" role="status">
          <p>{m.typing.layoutHint}</p>
          <button
            type="button"
            class="button button--secondary"
            onClick={() => {
              onUsePositional();
              dispatch({ type: 'use-positional' });
              input.current?.focus();
            }}
          >
            {m.typing.continueAnyway}
          </button>
        </div>
      )}

      {state.result && (
        <section
          ref={resultPanel}
          tabIndex={-1}
          class={state.result.passed ? 'feedback feedback--correct' : 'feedback feedback--wrong'}
        >
          <p>
            {state.result.passed
              ? format(m.typing.stepDone, { accuracy: percent(locale, state.result.ratio) })
              : format(m.typing.finalTooLow, {
                  accuracy: percent(locale, state.result.ratio),
                  min: percent(locale, (step.minAccuracy ?? 0) / 100),
                })}
          </p>
          <div class="actions">
            {state.result.passed ? (
              <button
                type="button"
                class="button"
                onClick={() =>
                  onDone(
                    isFinal
                      ? { accuracy: state.result?.percent ?? 0, errors: state.result?.errors ?? 0 }
                      : undefined,
                  )
                }
              >
                {m.typing.next}
              </button>
            ) : (
              <button
                type="button"
                class="button"
                onClick={() => {
                  dispatch({ type: 'retry' });
                  window.setTimeout(() => input.current?.focus(), 0);
                }}
              >
                {m.typing.tryAgain}
              </button>
            )}
          </div>
        </section>
      )}

      <OnScreenKeyboard next={expected} spaceLabel={m.typing.space} />
    </>
  );
}
