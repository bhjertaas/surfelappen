import type { ComposeStep, Rect } from '../../content/types.ts';

/**
 * Pure logic for "Lag glansbildet" (crop, polish, caption). The frame is a square
 * in the picture's pixel space.
 */

export interface Frame {
  readonly x: number;
  readonly y: number;
  readonly size: number;
}

/** A mess item counts as visible when this share of it is inside the frame. */
const VISIBLE_SHARE = 0.15;

function overlap(a: Rect, b: Rect): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

const asRect = (f: Frame): Rect => ({ x: f.x, y: f.y, w: f.size, h: f.size });

/** Keeps the frame inside the picture. */
export function clampFrame(step: ComposeStep, frame: Frame): Frame {
  const size = Math.min(frame.size, step.width, step.height);
  return {
    size,
    x: Math.round(Math.min(Math.max(frame.x, 0), step.width - size)),
    y: Math.round(Math.min(Math.max(frame.y, 0), step.height - size)),
  };
}

/** The first frame: the largest size, centred on the subject, so most of the mess shows. */
export function initialFrame(step: ComposeStep): Frame {
  const size = step.frameSizes[0] ?? Math.min(step.width, step.height);
  const cx = step.subject.x + step.subject.w / 2;
  const cy = step.subject.y + step.subject.h / 2;
  return clampFrame(step, { size, x: cx - size / 2, y: cy - size / 2 });
}

/** Moves the frame by (dx, dy) picture pixels. */
export function moveFrame(step: ComposeStep, frame: Frame, dx: number, dy: number): Frame {
  return clampFrame(step, { ...frame, x: frame.x + dx, y: frame.y + dy });
}

/** Switches to the next smaller (or larger) size, keeping the frame's centre. */
export function resizeFrame(step: ComposeStep, frame: Frame, direction: 1 | -1): Frame {
  const sizes = step.frameSizes;
  const i = sizes.indexOf(frame.size);
  const next = sizes[Math.min(Math.max(i + direction, 0), sizes.length - 1)] ?? frame.size;
  const half = (frame.size - next) / 2;
  return clampFrame(step, { size: next, x: frame.x + half, y: frame.y + half });
}

export function canShrink(step: ComposeStep, frame: Frame): boolean {
  return step.frameSizes.indexOf(frame.size) < step.frameSizes.length - 1;
}

export function canGrow(step: ComposeStep, frame: Frame): boolean {
  return step.frameSizes.indexOf(frame.size) > 0;
}

/** IDs of the mess still in the picture. */
export function visibleMess(step: ComposeStep, frame: Frame): string[] {
  const f = asRect(frame);
  return step.mess
    .filter((m) => overlap(f, m.rect) >= VISIBLE_SHARE * m.rect.w * m.rect.h)
    .map((m) => m.id);
}

export function subjectInFrame(step: ComposeStep, frame: Frame): boolean {
  const s = step.subject;
  return (
    s.x >= frame.x &&
    s.y >= frame.y &&
    s.x + s.w <= frame.x + frame.size &&
    s.y + s.h <= frame.y + frame.size
  );
}

/** The crop is done: the subject is in, the mess is out. */
export function cropReady(step: ComposeStep, frame: Frame): boolean {
  return subjectInFrame(step, frame) && visibleMess(step, frame).length === 0;
}

/** Polish sliders, each 0–4. */
export interface Polish {
  readonly light: number;
  readonly glow: number;
  readonly warmth: number;
}

export const POLISH_MAX = 4;

export const NO_POLISH: Polish = { light: 0, glow: 0, warmth: 0 };

/** The CSS filter that shows the polish on the picture. */
export function polishFilter(p: Polish): string {
  const t = (v: number) => v / POLISH_MAX;
  return [
    `brightness(${(1 + 0.3 * t(p.light)).toFixed(2)})`,
    `contrast(${(1 - 0.15 * t(p.glow)).toFixed(2)})`,
    `saturate(${(1 + 0.4 * t(p.glow) + 0.2 * t(p.warmth)).toFixed(2)})`,
    `sepia(${(0.3 * t(p.warmth)).toFixed(2)})`,
    `blur(${(0.6 * t(p.glow)).toFixed(2)}px)`,
  ].join(' ');
}

/** The likes forecast: polish adds up to 60 % to the caption's likes. */
export function likesFor(step: ComposeStep, captionId: string | null, p: Polish): number {
  const base = step.captions.find((c) => c.id === captionId)?.likes ?? step.captions[0]?.likes ?? 0;
  const boost = 1 + (0.6 * (p.light + p.glow + p.warmth)) / (3 * POLISH_MAX);
  return Math.round((base * boost) / 10) * 10;
}

/** Polish level as a share of the maximum, for the forecast meter. */
export function polishShare(p: Polish): number {
  return (p.light + p.glow + p.warmth) / (3 * POLISH_MAX);
}
