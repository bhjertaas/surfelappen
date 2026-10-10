import { parseMarkup } from '../i18n/markup.ts';

/** Renders text with *em* and **strong** (ADR 0005). Never interprets HTML. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {parseMarkup(text).map((segment, i) =>
        segment.style === 'strong' ? (
          <strong key={i}>{segment.text}</strong>
        ) : segment.style === 'em' ? (
          <em key={i}>{segment.text}</em>
        ) : (
          segment.text
        ),
      )}
    </>
  );
}
