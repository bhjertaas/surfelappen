# 0014 — Typing capture, key/code matching, layout fallback, Caps Lock

**Status:** Accepted · 2026-10-10 · PRD updated to v0.4

## Context
*Ti fingre* must work with the Norwegian layout (Ø, Æ), handle players on other layouts without "endless errors", use `KeyboardEvent.code` for physical position and `KeyboardEvent.key` for the character, ignore modifiers and IME composition, and work with screen readers. On a 30-keystroke final line, "98% accuracy" works out to zero mistakes.

## Decision
- **Capture:** a visible, labelled native `<input>` (`inputmode="none"`, `autocomplete`, `autocorrect`, `autocapitalize` and `spellcheck` off) handles `keydown`, calls `preventDefault()` for keys it consumes, and stays empty. A form field puts screen readers into focus mode so keystrokes reach us, and `inputmode="none"` keeps the touch keyboard closed.
- **Ignored:** modifier-only keys, `isComposing` / keyCode 229, `Dead`, auto-repeat, and Tab/Escape (left to the browser).
- **Matching:** by `key` (case-insensitive until a lesson teaches capitals). A keystroke whose `code` is the expected key's position but whose `key` differs, e.g. `;` on `Semicolon` where `ø` is expected, is **layout-suspect**: not counted. After 3, the layout hint appears; "Fortsett" switches the drill to **positional matching** by `code`.
- **Caps Lock:** detected via `getModifierState('CapsLock')`; a small note, no errors.
- **Accuracy** = correct ÷ (correct + wrong), shown as a whole percent with `Intl.NumberFormat`. Every step shows it; only the final step has a threshold. The threshold compares the exact ratio (30/33 = 90.9 % passes, 30/34 = 88.2 % doesn't), so rounding can't let 89.6 % through. *Stø hånd* = zero wrong keystrokes on the passing attempt of the final line.
- `typing/matcher.ts` (one keystroke) and `typing/stepState.ts` (a whole step as a reducer: lines, totals, layout hint, result, retry) are pure and unit-tested; `keymap-nb.ts` maps `code` → label, hand, finger for the on-screen keyboard and the "Prøv K med høyre langfinger" message.

## Alternatives
- `role="application"` div as capture: no text-field semantics, but less predictable across screen readers.
- Always positional matching: simpler, but a player on a Norwegian layout who presses the wrong key would sometimes be judged by position rather than character.
- Strict "Norwegian layout required": blocks players who can't change layout settings.

## Consequences
- The capture approach must be verified with NVDA, VoiceOver and TalkBack (+ hardware keyboard) in phase 6. Fallback if it fails: `role="application"` region.
- Speed is not shown in the MVP (the PRD allows but doesn't require it).
