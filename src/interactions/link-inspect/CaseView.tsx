import { useId, useRef, useState } from 'preact/hooks';
import { Rich } from '../../components/Rich.tsx';
import type { CaseText } from '../../content/missions/text-types.ts';
import type { LinkCase, OptionId } from '../../content/types.ts';
import { useI18n } from '../../i18n/i18n.ts';
import type { LinkInspectRun } from '../../progress/schema.ts';
import { AddressBreakdown } from './AddressBreakdown.tsx';
import { FeedbackPanel } from './FeedbackPanel.tsx';
import { missTransfer, solveStep } from './flow.ts';
import { Hints } from './Hints.tsx';
import { OptionButtons } from './OptionButtons.tsx';

interface Props {
  step: LinkCase;
  text: CaseText;
  run: LinkInspectRun;
  save: (run: LinkInspectRun) => void;
  advance: (run: LinkInspectRun) => void;
}

interface Answer {
  readonly option: OptionId;
  readonly attempt: number;
}

/** One link case: the message, the lupen, three answers, hints and feedback (FR-04). */
export function CaseView({ step, text, run, save, advance }: Props) {
  const { m } = useI18n();
  const questionId = useId();
  const lupenId = useId();
  const question = useRef<HTMLHeadingElement>(null);
  const [lupenOpen, setLupenOpen] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [missed, setMissed] = useState(false);

  const chosen = answer ? step.options.find((o) => o.id === answer.option) : undefined;
  const correct = chosen?.correct === true;

  const choose = (option: OptionId) => {
    const isCorrect = step.options.find((o) => o.id === option)?.correct === true;
    if (!isCorrect) {
      setMissed(true);
      // A missed transfer case is saved at once: its backup is due even after a reload.
      if (step.role === 'transfer') save(missTransfer(run, step.id));
    }
    setAnswer({ option, attempt: (answer?.attempt ?? 0) + 1 });
  };

  const next = () => {
    const firstTry = step.role !== 'transfer-backup' && !missed && hintsShown === 0;
    advance(solveStep(run, step.id, { firstTry }));
  };

  const tryAgain = () => {
    setAnswer(null);
    question.current?.focus();
  };

  return (
    <>
      <p class="situation">{text.situation}</p>
      <article class="message" aria-label={m.linkInspect.messageLabel}>
        <p class="message__meta">
          <span class="message__context">{m.linkInspect.contexts[step.context]}</span>{' '}
          <span>
            {m.linkInspect.from} {text.sender}
          </span>
        </p>
        <p class="message__body">
          <Rich text={text.message} /> <span class="message__link">{step.linkText}</span>
        </p>
      </article>

      <div class="lupen">
        <button
          type="button"
          class="button button--secondary"
          aria-expanded={lupenOpen}
          aria-controls={lupenId}
          onClick={() => setLupenOpen(!lupenOpen)}
        >
          <span class="lupen__icon" aria-hidden="true" />
          {m.linkInspect.useLupen}
        </button>
        <div id={lupenId} class="lupen__result" hidden={!lupenOpen}>
          <p>{m.linkInspect.lupenResult}</p>
          <p class="address__url">{step.url}</p>
        </div>
      </div>

      <h2 id={questionId} ref={question} tabIndex={-1}>
        {m.linkInspect.question}
      </h2>
      <OptionButtons
        options={step.options}
        labels={text.options}
        labelledBy={questionId}
        disabled={correct}
        onChoose={choose}
      />

      {!correct && (
        <Hints
          hints={[text.hint1, text.hint2]}
          shown={hintsShown}
          onShowMore={() => setHintsShown(hintsShown + 1)}
        />
      )}

      {answer && (
        <FeedbackPanel
          correct={correct}
          text={text.feedback[answer.option]}
          attempt={answer.attempt}
          onNext={next}
          onTryAgain={tryAgain}
        >
          {correct && (
            <>
              <AddressBreakdown url={step.url} host={step.expectedHost} site={step.expectedSite} />
              {text.lesMer && (
                <details class="les-mer">
                  <summary>{m.linkInspect.lesMer}</summary>
                  <p>
                    <Rich text={text.lesMer} />
                  </p>
                </details>
              )}
            </>
          )}
        </FeedbackPanel>
      )}
    </>
  );
}
