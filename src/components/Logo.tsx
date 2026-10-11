/**
 * The Surfelappen logo: a round rubber stamp. The ring says SURFELAPPEN and
 * INTERNETT · GODKJENT; inside, a sunset of ones and zeros over a neon grid, and a
 * breaking wave. Drawn after docs/logo-ideas/6b-stamp-sunset-red.svg (made by
 * docs/logo-ideas/stamp.py). Inline SVG so the ring text is in the page font.
 * public/favicon.svg is the inner picture alone.
 */

const C = 200;
const HORIZON = 214;
const R_OUT = 188;
const R_IN = 126;
const INK = '#b03a27';
const MONO = 'ui-monospace, Menlo, Consolas, monospace';

/** The sun's rays: short binary strings fanning out from the horizon. */
const RAYS = [
  { x: 114.4, y: 186.2, angle: 198, bits: '1011110' },
  { x: 127.2, y: 161.1, angle: 216, bits: '0001010' },
  { x: 147.1, y: 141.2, angle: 234, bits: '1011001' },
  { x: 172.2, y: 128.4, angle: 252, bits: '0101101' },
  { x: 200.0, y: 124.0, angle: 270, bits: '1100000' },
  { x: 227.8, y: 128.4, angle: 288, bits: '0101100' },
  { x: 252.9, y: 141.2, angle: 306, bits: '0000100' },
  { x: 272.8, y: 161.1, angle: 324, bits: '0101011' },
  { x: 285.6, y: 186.2, angle: 342, bits: '1001110' },
] as const;

/** The sun: rows of binary, clipped to a half disc, further apart towards the horizon. */
const SUN_ROWS = [
  { y: 152.0, bits: '0010000010011000010010' },
  { y: 160.5, bits: '0110111010101011100100' },
  { y: 169.9, bits: '1001010100110001111011' },
  { y: 180.2, bits: '0101110111000001100101' },
  { y: 191.4, bits: '1101101001010010001010' },
  { y: 203.5, bits: '1110000010001101101101' },
] as const;

/** The neon grid: lines from the vanishing point, and rows getting further apart. */
const FAN = Array.from({ length: 19 }, (_, i) => C + (i - 9) * 46);
const GRID_ROWS = (() => {
  const rows: number[] = [];
  let y = HORIZON;
  let step = 4;
  while (y < 340) {
    y += step;
    step *= 1.45;
    rows.push(Math.round(y * 10) / 10);
  }
  return rows;
})();

const WAVE =
  'M64 336 L64 288 C 104 280, 136 244, 176 226 C 218 208, 262 216, 268 244 C 272 264, 248 272, 239 259 C 232 248, 242 240, 251 245 C 241 231, 214 233, 203 252 C 190 276, 210 298, 252 302 C 292 306, 326 296, 340 292 L340 336 Z';
const CREST = 'M176 226 C 218 208, 262 216, 268 244 C 272 264, 248 272, 239 259';

/** A four-pointed star on each side of the ring. */
const star = (x: number) =>
  `M${x} 190 L${x + 3} 197 L${x + 10} 200 L${x + 3} 203 L${x} 210 L${x - 3} 203 L${x - 10} 200 L${x - 3} 197 Z`;

export function Logo({ label, motto }: { label: string; motto: string }) {
  const word = label.toLocaleUpperCase('nb');
  return (
    <svg class="logo" viewBox="0 0 400 400" role="img" aria-label={label}>
      <defs>
        <clipPath id="logo-inner">
          <circle cx={C} cy={C} r={R_IN} />
        </clipPath>
        <clipPath id="logo-sun">
          <circle cx={C} cy={HORIZON} r="70" />
        </clipPath>
        <linearGradient id="logo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#160a33" />
          <stop offset="0.55" stop-color="#5a1a5e" />
          <stop offset="1" stop-color="#e2544a" />
        </linearGradient>
        <radialGradient id="logo-glow" cx="0.5" cy="1" r="1">
          <stop offset="0" stop-color="#ffb347" stop-opacity="0.55" />
          <stop offset="1" stop-color="#ffb347" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="logo-sunfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffe66b" />
          <stop offset="0.6" stop-color="#ff9a3c" />
          <stop offset="1" stop-color="#ff3fa4" />
        </linearGradient>
        <linearGradient id="logo-wave" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#16a3c0" />
          <stop offset="1" stop-color="#0a3b5c" />
        </linearGradient>
        <path id="logo-top" d={`M${C - 146} ${C} A146 146 0 0 1 ${C + 146} ${C}`} />
        <path id="logo-bottom" d={`M${C - 164} ${C} A164 164 0 0 0 ${C + 164} ${C}`} />
      </defs>

      <circle cx={C} cy={C} r={R_OUT + 4} fill="#fdf8ec" />

      <g clip-path="url(#logo-inner)">
        <rect width="400" height={HORIZON} fill="url(#logo-sky)" />
        <ellipse cx={C} cy={HORIZON} rx="120" ry="100" fill="url(#logo-glow)" />
        <g font-family={MONO} font-size="8" font-weight="700" fill="#ffb36b" fill-opacity="0.8">
          {RAYS.map((r) => (
            <text
              key={r.angle}
              x={r.x}
              y={r.y}
              transform={`rotate(${r.angle} ${r.x} ${r.y})`}
              dominant-baseline="middle"
            >
              {r.bits}
            </text>
          ))}
        </g>
        <g
          clip-path="url(#logo-sun)"
          font-family={MONO}
          font-size="8.5"
          font-weight="800"
          fill="url(#logo-sunfill)"
        >
          {SUN_ROWS.map((row) => (
            <text key={row.y} x="126" y={row.y} textLength="148" lengthAdjust="spacing">
              {row.bits}
            </text>
          ))}
        </g>
        <rect y={HORIZON} width="400" height={400 - HORIZON} fill="#070a18" />
        <g stroke="#ff3fd0" stroke-width="1.6" stroke-opacity="0.9">
          {FAN.map((x) => (
            <line key={x} x1={C} y1={HORIZON} x2={x} y2="340" />
          ))}
          {GRID_ROWS.map((y) => (
            <line key={y} x1="60" y1={y} x2="340" y2={y} />
          ))}
        </g>
        <line x1="60" y1={HORIZON} x2="340" y2={HORIZON} stroke="#5ff2ff" stroke-width="2.5" />
        <path
          d={WAVE}
          fill="url(#logo-wave)"
          stroke="#5ff2ff"
          stroke-width="2.5"
          stroke-linejoin="round"
        />
        <path d={CREST} fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" />
      </g>

      <circle cx={C} cy={C} r={R_OUT} fill="none" stroke={INK} stroke-width="9" />
      <circle cx={C} cy={C} r={R_IN} fill="none" stroke={INK} stroke-width="6" />
      <g class="logo__ring" fill={INK} font-weight="800" text-anchor="middle">
        <text font-size="27" letter-spacing="5">
          <textPath href="#logo-top" startOffset="50%">
            {word}
          </textPath>
        </text>
        <text font-size="23" letter-spacing="3">
          <textPath href="#logo-bottom" startOffset="50%">
            {motto.toLocaleUpperCase('nb')}
          </textPath>
        </text>
        <path d={star(C - 157)} />
        <path d={star(C + 157)} />
      </g>
    </svg>
  );
}
