import { describe, expect, it } from 'vitest';
import { missions } from '../../src/content/missions/index.ts';
import type { MissionStructure, TypingMission } from '../../src/content/types.ts';

const typingMissions = (missions as readonly MissionStructure[]).filter(
  (m): m is TypingMission => m.interaction === 'typing',
);

for (const mission of typingMissions) {
  describe(`${mission.id} typing steps`, () => {
    it('only allows keys taught in this or an earlier step', () => {
      const taught = new Set<string>();
      for (const step of mission.steps) {
        for (const key of step.keysTaught) taught.add(key);
        for (const key of step.keysAllowed) {
          expect(
            taught.has(key),
            `${mission.id}/${step.id}: "${key}" allowed before it is taught`,
          ).toBe(true);
        }
      }
    });

    it('uses only allowed keys in every drill', () => {
      for (const step of mission.steps) {
        const allowed = new Set(step.keysAllowed);
        for (const drill of step.drills) {
          for (const ch of drill) {
            expect(
              allowed.has(ch),
              `${mission.id}/${step.id}: "${ch}" in "${drill}" is not allowed`,
            ).toBe(true);
          }
        }
      }
    });

    it('has drills without leading, trailing or double spaces', () => {
      for (const step of mission.steps) {
        for (const drill of step.drills) {
          expect(drill, `${mission.id}/${step.id}`).toBe(drill.trim().replace(/ {2,}/g, ' '));
          expect(drill.length, `${mission.id}/${step.id}: empty drill`).toBeGreaterThan(0);
        }
      }
    });

    it('sets minAccuracy (1–100) on the final step only', () => {
      mission.steps.forEach((step, i) => {
        const last = i === mission.steps.length - 1;
        expect(step.minAccuracy !== undefined, `${mission.id}/${step.id}: minAccuracy`).toBe(last);
        if (step.minAccuracy !== undefined) {
          expect(step.minAccuracy).toBeGreaterThan(0);
          expect(step.minAccuracy).toBeLessThanOrEqual(100);
        }
      });
    });
  });
}
