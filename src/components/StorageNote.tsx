import { useState } from 'preact/hooks';
import { useI18n } from '../i18n/i18n.ts';
import { useProgress } from '../progress/hooks.ts';

/** A small, dismissible note when progress can't be saved (PRD "Storage unavailable"). */
export function StorageNote() {
  const { m } = useI18n();
  const { status } = useProgress();
  const [dismissed, setDismissed] = useState(false);
  const text =
    status === 'unavailable'
      ? m.storage.unavailable
      : status === 'newer-version'
        ? m.storage.newerVersion
        : null;

  return (
    <div class="bar-region" role="status">
      {text !== null && !dismissed && (
        <div class="bar bar--note">
          <p>{text}</p>
          <button type="button" class="button button--quiet" onClick={() => setDismissed(true)}>
            {m.storage.dismiss}
          </button>
        </div>
      )}
    </div>
  );
}
