import { useEffect, useRef, useState } from 'preact/hooks';
import type { TrapText } from '../../content/missions/text-types.ts';
import { useI18n } from '../../i18n/i18n.ts';

/**
 * "Se hva som skjer": the fake page an impostor link opens, drawn in the page.
 * It looks like the brand; only the address bar tells the truth. The fields are
 * pictures of fields, so nothing can be typed. The button shows the consequence.
 */
export function TrapPage({ host, trap }: { host: string; trap: TrapText }) {
  const { m } = useI18n();
  const [open, setOpen] = useState(false);
  const [sprung, setSprung] = useState(false);
  const after = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sprung) after.current?.focus();
  }, [sprung]);

  return (
    <div class="trap">
      <button
        type="button"
        class="button button--secondary"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {m.linkInspect.seeWhatHappens}
      </button>
      {open && (
        <>
          <figure class="trap__phone" aria-label={m.linkInspect.trapLabel}>
            <p class="trap__bar">
              <span aria-hidden="true">🔒 </span>
              {host}
            </p>
            <div class="trap__page">
              <p class="trap__brand">{trap.brand}</p>
              <p class="trap__title">{trap.title}</p>
              <p>{trap.body}</p>
              {trap.fields.map((field) => (
                <div key={field} class="trap__field">
                  <span>{field}</span>
                  <span class="trap__box" aria-hidden="true" />
                </div>
              ))}
              <button
                type="button"
                class="trap__button"
                disabled={sprung}
                onClick={() => setSprung(true)}
              >
                {trap.button}
              </button>
            </div>
          </figure>
          {sprung && (
            <div ref={after} tabIndex={-1} class="trap__after">
              <h3>{m.linkInspect.afterHeading}</h3>
              <p>{trap.after}</p>
              <p>
                <strong>{m.linkInspect.trapMoral}</strong>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
