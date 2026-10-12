import { useId, useState } from 'preact/hooks';
import type { LinkCase } from '../../content/types.ts';
import { useI18n } from '../../i18n/i18n.ts';

/**
 * The link in a message, to look at without opening it, the way you would for real:
 * pointing at it (or tabbing to it) shows its address in a status bar at the bottom
 * left, as browsers do; pressing it shows a preview like a long press on a phone.
 * A QR case shows a real QR code instead, and a button for what the camera would show.
 * Nothing here ever navigates.
 */
export function LinkPeek({ step, qr }: { step: LinkCase; qr: string | undefined }) {
  const { m } = useI18n();
  const previewId = useId();
  const [pointing, setPointing] = useState(false);
  const [open, setOpen] = useState(false);
  const isQr = step.context === 'qr' && qr !== undefined;

  const preview = (
    <div id={previewId} class="link-preview" hidden={!open}>
      <p class="link-preview__label">
        {isQr ? m.linkInspect.cameraShows : m.linkInspect.linkGoesTo}
      </p>
      <p class="address__url">{step.url}</p>
    </div>
  );

  if (isQr) {
    return (
      <>
        <img class="qr" src={qr} width="148" height="148" alt={m.linkInspect.qrAlt} />
        <p class="peek-help">{m.linkInspect.qrHelp}</p>
        <button
          type="button"
          class="button button--secondary"
          aria-expanded={open}
          aria-controls={previewId}
          onClick={() => setOpen(!open)}
        >
          {m.linkInspect.showCamera}
        </button>
        {preview}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        class="message__link"
        aria-expanded={open}
        aria-controls={previewId}
        onMouseEnter={() => setPointing(true)}
        onMouseLeave={() => setPointing(false)}
        onFocus={() => setPointing(true)}
        onBlur={() => setPointing(false)}
        onClick={() => {
          setPointing(false);
          setOpen(!open);
        }}
      >
        {step.linkText}
      </button>
      {pointing && (
        <div class="statusbar" aria-hidden="true">
          {step.url}
        </div>
      )}
      <p class="peek-help">{m.linkInspect.peekHelp}</p>
      {preview}
    </>
  );
}
