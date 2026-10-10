import { describe, expect, it } from 'vitest';
import { tenFingers } from '../../content/missions/ten-fingers/structure.ts';
import { completeTypingStep, emptyTypingRun, typingCurrentStep, usePositional } from './flow.ts';

describe('typing flow', () => {
  it('walks through the steps in order', () => {
    let run = emptyTypingRun();
    expect(typingCurrentStep(tenFingers, run)).toBe('step-1');
    run = completeTypingStep(run, 'step-1');
    expect(typingCurrentStep(tenFingers, run)).toBe('step-2');
    expect(completeTypingStep(run, 'step-1')).toBe(run);
  });

  it('records the final accuracy and errors', () => {
    const run = completeTypingStep(emptyTypingRun(), 'step-5', { accuracy: 97, errors: 1 });
    expect(run).toMatchObject({ done: ['step-5'], finalAccuracy: 97, finalErrors: 1 });
  });

  it('switches to positional matching once', () => {
    const run = usePositional(emptyTypingRun());
    expect(run.positional).toBe(true);
    expect(usePositional(run)).toBe(run);
  });
});
