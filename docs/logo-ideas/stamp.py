# Draws 6-stamp-sunset.svg and 6b-stamp-sunset-red.svg: python3 stamp.py <out-dir>
import math, random, sys
random.seed(7)
C=200; H=214  # centre, horizon
R_OUT=188; R_TEXT=157; R_IN=126
def bits(n): return ''.join(random.choice('01') for _ in range(n))

def svg(ring, ring_text, bg, title):
    o=[]
    o.append(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 400">')
    o.append(f'  <title>{title}</title>')
    o.append('''  <defs>
    <clipPath id="inner"><circle cx="200" cy="200" r="%d"/></clipPath>
    <clipPath id="sun"><circle cx="200" cy="%d" r="70"/></clipPath>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#160a33"/><stop offset="0.55" stop-color="#5a1a5e"/><stop offset="1" stop-color="#e2544a"/>
    </linearGradient>
    <linearGradient id="sunfill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe66b"/><stop offset="0.6" stop-color="#ff9a3c"/><stop offset="1" stop-color="#ff3fa4"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="1" r="1">
      <stop offset="0" stop-color="#ffb347" stop-opacity="0.55"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="wave" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#16a3c0"/><stop offset="1" stop-color="#0a3b5c"/>
    </linearGradient>
    <path id="top" d="M%d 200 A%d %d 0 0 1 %d 200"/>
    <path id="bottom" d="M%d 200 A%d %d 0 0 0 %d 200"/>
  </defs>''' % (R_IN, H, C-146, 146, 146, C+146, C-164, 164, 164, C+164))
    o.append(f'  <rect width="400" height="400" rx="28" fill="{bg}"/>')
    o.append('  <g clip-path="url(#inner)">')
    o.append(f'    <rect x="0" y="0" width="400" height="{H}" fill="url(#sky)"/>')
    o.append(f'    <ellipse cx="200" cy="{H}" rx="120" ry="100" fill="url(#glow)"/>')
    # rays of binary, like sun rays
    for k in range(11):
        a=math.radians(180+ k*18)  # 180..360 degrees: upper half
        if k in (0,10): continue
        x=C+90*math.cos(a); y=H+90*math.sin(a)
        deg=math.degrees(a)
        o.append(f'    <text x="{x:.1f}" y="{y:.1f}" transform="rotate({deg:.1f} {x:.1f} {y:.1f})" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="8" font-weight="700" fill="#ffb36b" fill-opacity="0.8" dominant-baseline="middle">{bits(7)}</text>')
    # the sun: rows of digits, clipped to a half disc
    o.append('    <g clip-path="url(#sun)" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="8.5" font-weight="800" fill="url(#sunfill)">')
    y=H-62
    gap=8.5
    while y < H:
        o.append(f'      <text x="126" y="{y:.1f}" textLength="148" lengthAdjust="spacing">{bits(22)}</text>')
        y+=gap; gap+=0.9
    o.append('    </g>')
    # ground and Tron grid
    o.append(f'    <rect x="0" y="{H}" width="400" height="{400-H}" fill="#070a18"/>')
    o.append('    <g stroke="#ff3fd0" stroke-width="1.6" stroke-opacity="0.9">')
    for i in range(-9,10):
        o.append(f'      <line x1="200" y1="{H}" x2="{200+i*46}" y2="340"/>')
    yy=H; step=4
    while yy<340:
        yy+=step; step*=1.45
        o.append(f'      <line x1="60" y1="{yy:.1f}" x2="340" y2="{yy:.1f}"/>')
    o.append('    </g>')
    o.append(f'    <line x1="60" y1="{H}" x2="340" y2="{H}" stroke="#5ff2ff" stroke-width="2.5"/>')
    # the wave, breaking to the right over the grid
    o.append('''    <path d="M64 336 L64 288 C 104 280, 136 244, 176 226 C 218 208, 262 216, 268 244 C 272 264, 248 272, 239 259 C 232 248, 242 240, 251 245 C 241 231, 214 233, 203 252 C 190 276, 210 298, 252 302 C 292 306, 326 296, 340 292 L340 336 Z" fill="url(#wave)" stroke="#5ff2ff" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M176 226 C 218 208, 262 216, 268 244 C 272 264, 248 272, 239 259" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>''')
    o.append('  </g>')
    # rings and text
    o.append(f'  <circle cx="200" cy="200" r="{R_OUT}" fill="none" stroke="{ring}" stroke-width="9"/>')
    o.append(f'  <circle cx="200" cy="200" r="{R_IN}" fill="none" stroke="{ring}" stroke-width="6"/>')
    font='font-family="Atkinson Hyperlegible Next, Atkinson Hyperlegible, Verdana, sans-serif" font-weight="800" font-size="27" letter-spacing="5"'
    o.append(f'  <text {font} fill="{ring_text}" text-anchor="middle"><textPath xlink:href="#top" href="#top" startOffset="50%">SURFELAPPEN</textPath></text>')
    small='font-family="Atkinson Hyperlegible Next, Atkinson Hyperlegible, Verdana, sans-serif" font-weight="800" font-size="23" letter-spacing="3"'
    o.append(f'  <text {small} fill="{ring_text}" text-anchor="middle"><textPath xlink:href="#bottom" href="#bottom" startOffset="50%">INTERNETT\u2003·\u2003GODKJENT</textPath></text>')
    for x in (C-157, C+157):
        o.append(f'  <path d="M{x} 190 L{x+3} 197 L{x+10} 200 L{x+3} 203 L{x} 210 L{x-3} 203 L{x-10} 200 L{x-3} 197 Z" fill="{ring_text}"/>')
    o.append('</svg>')
    return '\n'.join(o)+'\n'

out=sys.argv[1]
open(out+'/6-stamp-sunset.svg','w').write(svg('#14182b','#14182b','#fdf8ec','Surfelappen logo idea: stamp with a binary sunset'))
open(out+'/6b-stamp-sunset-red.svg','w').write(svg('#b03a27','#b03a27','#fdf8ec','Surfelappen logo idea: red stamp with a binary sunset'))
