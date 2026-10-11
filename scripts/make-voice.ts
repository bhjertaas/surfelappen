/**
 * Narration with the OpenAI speech API (ADR 0016, 0017): reads the Tidsreisen cards
 * aloud in Norwegian, so the history plays like a short film with subtitles.
 *
 *   node scripts/make-voice.ts [event…] [--draft] [--voice ash]
 *
 * - Text: year, title and body of each event in how-the-net-works/text.nb.ts, so the
 *   card on screen is the subtitle. A few words get spoken spellings (SPOKEN below).
 * - Result: src/assets/audio/voice-<event>.mp3 (re-encoded to 40 kbps mono, plenty for
 *   speech), or .cache/voice/ with --draft.
 * Reads OPENAI_API_KEY from the environment or .env. Dev only: the game never calls an API.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { howTheNetWorks } from '../src/content/missions/how-the-net-works/structure.ts';
import { howTheNetWorksNb } from '../src/content/missions/how-the-net-works/text.nb.ts';

const MODEL = 'gpt-4o-mini-tts';
const INSTRUCTIONS =
  'Snakk norsk bokmål med naturlig østlandsk uttale, ikke engelsk aksent. Du er Ivar, en varm og litt humoristisk kafévert som forteller historien om internett til en gjest. Rolig tempo, tydelig, med en liten pause etter årstallet og etter tittelen.';

/** Spoken spellings for words the voice gets wrong. Text on screen is unchanged. */
const SPOKEN: [RegExp, string][] = [
  [/LOGIN/g, 'L, O, G, I, N'],
  [/«LO»/g, '«L, O»'],
  [/TCP\/IP/g, 'TCP-IP'],
  [/ @ /g, ' krøllalfa '],
];

const root = new URL('..', import.meta.url).pathname;

function apiKey(): string {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const env = join(root, '.env');
  if (existsSync(env)) {
    for (const line of readFileSync(env, 'utf8').split('\n')) {
      const [k, ...v] = line.split('=');
      if (k?.trim() === 'OPENAI_API_KEY')
        return v
          .join('=')
          .trim()
          .replace(/^["']|["']$/g, '');
    }
  }
  throw new Error('OPENAI_API_KEY missing: add it to .env');
}

function narration(year: number, title: string, body: string): string {
  let text = `${year}. ${title}. ${body}`.replace(/\*/g, '');
  for (const [pattern, spoken] of SPOKEN) text = text.replace(pattern, spoken);
  return text;
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { draft: { type: 'boolean' }, voice: { type: 'string', default: 'ash' } },
});

const step = howTheNetWorks.steps.find((s) => s.kind === 'timeline');
const text = howTheNetWorksNb.steps['time-travel'];
if (step?.kind !== 'timeline') throw new Error('no timeline step');
const events = step.events.filter((e) => positionals.length === 0 || positionals.includes(e.id));
const outDir = join(root, values.draft ? '.cache/voice' : 'src/assets/audio');
mkdirSync(outDir, { recursive: true });

await Promise.all(
  events.map(async (event) => {
    const t = text.events[event.id];
    if (!t) throw new Error(`no text for ${event.id}`);
    const input = narration(event.year, t.title, t.body);
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        voice: values.voice,
        input,
        instructions: INSTRUCTIONS,
        response_format: 'mp3',
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const file = join(outDir, `voice-${event.id}${values.draft ? `.${values.voice}` : ''}.mp3`);
    const raw = join(root, '.cache/voice', `voice-${event.id}.raw.mp3`);
    mkdirSync(join(root, '.cache/voice'), { recursive: true });
    writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
    execFileSync(ffmpeg.path, [
      '-loglevel',
      'error',
      '-y',
      '-i',
      raw,
      '-ac',
      '1',
      '-b:a',
      '40k',
      file,
    ]);
    const bytes = readFileSync(file);
    console.log(`${event.id}: ${file} (${Math.round(bytes.length / 1024)} KB)`);
  }),
);
