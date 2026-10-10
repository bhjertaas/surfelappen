import type { MissionText } from '../text-types.ts';

export const findTheImpostorNb: MissionText = {
  title: 'Finn bedrageren',
  character: 'Postmester Solveig',
  intro: [
    'Hei, og velkommen til Postkontoret! Folk i Lenkevik får stadig rare meldinger med lenker i. Noen er ekte, noen er lureri. Ta med deg lupen og hjelp meg å finne ut hvor lenkene egentlig fører.',
  ],
  learn: 'Du lærer å se hvilket nettsted en lenke egentlig går til.',
  summary: {
    takeaway:
      'Nettstedet står rett før første skråstrek. Men det tryggeste er å ikke logge inn fra lenker i det hele tatt: åpne appen eller skriv adressen selv.',
  },
};
