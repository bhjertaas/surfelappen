/**
 * Draws a real QR code for every QR case in the missions: src/assets/qr/<step-id>.svg,
 * encoding the case's url. Scanning one with a phone camera shows the address, which
 * is the lesson; the domains are made up (src/content/domains.ts), so opening it leads
 * nowhere. Run after changing a QR case: `node scripts/make-qr.ts`. A content test checks
 * the files are up to date.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { missions } from '../src/content/missions/index.ts';
import type { MissionStructure } from '../src/content/types.ts';
import { qrSvg } from './qr-svg.ts';

const root = new URL('..', import.meta.url).pathname;
let count = 0;
for (const mission of missions as readonly MissionStructure[]) {
  if (mission.interaction !== 'link-inspect') continue;
  for (const step of mission.steps) {
    if (step.kind !== 'case' || step.context !== 'qr') continue;
    writeFileSync(join(root, `src/assets/qr/${step.id}.svg`), await qrSvg(step.url));
    count++;
  }
}
console.log(`${count} QR codes written`);
