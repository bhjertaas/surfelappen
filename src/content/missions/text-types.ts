/**
 * Per-locale text for a mission. Phase 2 has the intro and summary only; the
 * step texts (typed from each mission's structure) arrive with phases 3 and 4.
 */
export interface MissionText {
  readonly title: string;
  /** The townsperson who brings the problem, e.g. "Postmester Solveig". */
  readonly character: string;
  /** 1–3 short paragraphs; may use *em* and **strong**. */
  readonly intro: readonly string[];
  /** "Du lærer å …" */
  readonly learn: string;
  readonly summary: {
    readonly takeaway: string;
  };
}
