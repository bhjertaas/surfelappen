import type { ComponentChildren } from 'preact';
import { artFor } from '../content/art.ts';

interface Props {
  /** Art ID of the portrait; left out when the scene above already shows the speaker. */
  portrait?: string;
  /** Who is speaking, e.g. "Hanne på postkontoret". */
  name: string;
  children: ComponentChildren;
}

/** A townsperson's portrait with what they say in a speech bubble. The portrait is decoration. */
export function Guide({ portrait, name, children }: Props) {
  const image = portrait ? artFor(portrait) : undefined;
  return (
    <div class="guide">
      {image && (
        <img
          class="pixel-art guide__portrait"
          src={image.src}
          width={image.width * 2}
          height={image.height * 2}
          alt=""
        />
      )}
      <div class="guide__bubble">
        <p class="character">{name}</p>
        {children}
      </div>
    </div>
  );
}
