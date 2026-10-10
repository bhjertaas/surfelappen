import { useEffect, useState } from 'preact/hooks';
import { useI18n } from '../i18n/i18n.ts';
import { isUpdateAvailable, onUpdateAvailable, reloadWithUpdate } from '../pwa/register.ts';

/** "Ny versjon – last inn på nytt". Lives in a status region, so it's announced when it appears. */
export function UpdateBar() {
  const { m } = useI18n();
  const [visible, setVisible] = useState(isUpdateAvailable);
  useEffect(() => onUpdateAvailable(() => setVisible(true)), []);

  return (
    <div class="bar-region" role="status">
      {visible && (
        <div class="bar bar--update">
          <p>{m.update.message}</p>
          <button type="button" class="button" onClick={reloadWithUpdate}>
            {m.update.reload}
          </button>
        </div>
      )}
    </div>
  );
}
