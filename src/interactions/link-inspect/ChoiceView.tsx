import { useId, useRef, useState } from 'preact/hooks';
import { Rich } from '../../components/Rich.tsx';
import type { ChoiceText } from '../../content/missions/text-types.ts';
import type { ChoiceStep, OptionId } from '../../content/types.ts';
import type { LinkInspectRun } from '../../progress/schema.ts';
import { FeedbackPanel } from './FeedbackPanel.tsx';
import { solveStep } from './flow.ts';
import { OptionButtons } from './OptionButtons.tsx';

interface Props {
  step: ChoiceStep;
  text: ChoiceText;
  run: LinkInspectRun;
  advance: (run: LinkInspectRun) => void;
}

/** A question with three answers and feedback for each, e.g. the habit scene. */
export function ChoiceView({ step, text, run, advance }: Props) {
  const questionId = useId();
  const question = useRef<HTMLHeadingElement>(null);
  const [answer, setAnswer] = useState<{ option: OptionId; attempt: number } | null>(null);
  const correct = answer
    ? step.options.find((o) => o.id === answer.option)?.correct === true
    : false;

  return (
    <>
      <h2 id={questionId} ref={question} tabIndex={-1}>
        <Rich text={text.prompt} />
      </h2>
      <OptionButtons
        options={step.options}
        labels={text.options}
        labelledBy={questionId}
        disabled={correct}
        onChoose={(option) => setAnswer({ option, attempt: (answer?.attempt ?? 0) + 1 })}
      />
      {answer && (
        <FeedbackPanel
          correct={correct}
          text={text.feedback[answer.option]}
          attempt={answer.attempt}
          onNext={() => advance(solveStep(run, step.id))}
          onTryAgain={() => {
            setAnswer(null);
            question.current?.focus();
          }}
        />
      )}
    </>
  );
}
