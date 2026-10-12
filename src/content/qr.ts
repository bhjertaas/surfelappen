import transfer1 from '../assets/qr/transfer-1.svg';
import transfer1Backup from '../assets/qr/transfer-1-backup.svg';
import transfer2 from '../assets/qr/transfer-2.svg';
import transfer2Backup from '../assets/qr/transfer-2-backup.svg';
import type { StepId } from './types.ts';

/**
 * Real QR codes for the QR cases, by step ID, made by `scripts/make-qr.ts` from each
 * case's url. A content test checks they are current.
 */
const qr: Readonly<Record<StepId, string>> = {
  'transfer-1': transfer1,
  'transfer-2': transfer2,
  'transfer-1-backup': transfer1Backup,
  'transfer-2-backup': transfer2Backup,
};

export function qrFor(stepId: StepId): string | undefined {
  return qr[stepId];
}
