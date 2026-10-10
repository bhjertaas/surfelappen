/**
 * The Surfelappen wordmark: a neon wave of light ("the surf") over a receding
 * perspective grid, in the spirit of 80s computer films without copying any of
 * them. Inline SVG so the wordmark is real text in the page font.
 */

const HORIZON = 120;
const VANISH_X = 320;

/** Grid lines fanning out from the vanishing point, and rows getting closer to the horizon. */
function Grid() {
  const fan = Array.from({ length: 17 }, (_, i) => -880 + i * 110);
  const rows = [6, 14, 26, 44, 70, 108];
  return (
    <g stroke="#ff5a36" stroke-width="1.6" opacity="0.85">
      {fan.map((x) => (
        <line key={x} x1={VANISH_X} y1={HORIZON} x2={VANISH_X + x} y2={260} />
      ))}
      {rows.map((dy) => (
        <line key={dy} x1="0" y1={HORIZON + dy} x2="640" y2={HORIZON + dy} />
      ))}
    </g>
  );
}

/** A wave of light: a long swell that rises and curls over at the crest. */
const WAVE =
  'M 30 112 C 120 112 160 100 210 80 C 270 56 330 34 392 40 C 440 45 462 76 440 92 C 424 104 400 92 410 78';
/** The wave's translucent body, down to the horizon. */
const WAVE_BODY =
  'M 30 112 C 120 112 160 100 210 80 C 270 56 330 34 392 40 C 440 45 462 76 440 92 L 452 120 L 30 120 Z';

export function Logo({ label }: { label: string }) {
  const word = label.toLocaleUpperCase('nb');
  return (
    <svg class="logo" viewBox="0 0 640 260" role="img" aria-label={label}>
      <defs>
        <linearGradient id="logo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#05060d" stop-opacity="0" />
          <stop offset="1" stop-color="#3a0d2e" stop-opacity="0.9" />
        </linearGradient>
        <linearGradient id="logo-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#05060d" stop-opacity="0" />
          <stop offset="1" stop-color="#05060d" stop-opacity="1" />
        </linearGradient>
        <linearGradient id="logo-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff6e0" />
          <stop offset="0.48" stop-color="#ffb08a" />
          <stop offset="0.52" stop-color="#ff5a36" />
          <stop offset="1" stop-color="#b3264f" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="logo-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2fd8ff" stop-opacity="0.45" />
          <stop offset="1" stop-color="#2fd8ff" stop-opacity="0.04" />
        </linearGradient>
        <linearGradient id="logo-edges" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset="0.18" stop-color="#fff" stop-opacity="1" />
          <stop offset="0.82" stop-color="#fff" stop-opacity="1" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <mask id="logo-fade">
          <rect x="0" y="0" width="640" height="260" fill="url(#logo-edges)" />
        </mask>
        <clipPath id="logo-below-horizon">
          <rect x="0" y={HORIZON} width="640" height={260 - HORIZON} />
        </clipPath>
      </defs>

      <g mask="url(#logo-fade)">
        <rect x="0" y="0" width="640" height={HORIZON} fill="url(#logo-sky)" />
        <g clip-path="url(#logo-below-horizon)">
          <Grid />
          <rect
            x="0"
            y={HORIZON}
            width="640"
            height={260 - HORIZON}
            fill="url(#logo-floor)"
            opacity="0.55"
          />
        </g>
        <line
          x1="0"
          y1={HORIZON}
          x2="640"
          y2={HORIZON}
          stroke="#ff8a5c"
          stroke-width="2.5"
          filter="url(#logo-glow)"
        />
      </g>

      <path d={WAVE_BODY} fill="url(#logo-water)" />
      <g fill="none" stroke-linecap="round" filter="url(#logo-glow)">
        <path d={WAVE} stroke="#2fd8ff" stroke-width="9" />
        <path d={WAVE} stroke="#e8fdff" stroke-width="2.5" />
        <path
          d={WAVE}
          stroke="#2fd8ff"
          stroke-width="1.5"
          opacity="0.55"
          transform="translate(-14 14)"
        />
        <path
          d={WAVE}
          stroke="#2fd8ff"
          stroke-width="1.2"
          opacity="0.35"
          transform="translate(-28 26)"
        />
        <path
          d="M 60 126 C 160 126 230 116 300 100"
          stroke="#2fd8ff"
          stroke-width="3"
          opacity="0.6"
        />
      </g>

      <text
        class="logo__word"
        x="320"
        y="205"
        text-anchor="middle"
        transform="skewX(-10) translate(36 0)"
        fill="none"
        stroke="#05060d"
        stroke-width="12"
        stroke-linejoin="round"
      >
        {word}
      </text>
      <text
        class="logo__word"
        x="320"
        y="205"
        text-anchor="middle"
        transform="skewX(-10) translate(36 0)"
        fill="url(#logo-chrome)"
        stroke="#ff3d2e"
        stroke-width="1.5"
        paint-order="stroke"
      >
        {word}
      </text>
    </svg>
  );
}
