import { artFor } from '../content/art.ts';

/** A place's scene picture, at the top of a mission. Decoration: the text tells the story. */
export function Scene({ id }: { id: string }) {
  const image = artFor(id);
  if (!image) return null;
  return <img class="scene" src={image.src} width={image.width} height={image.height} alt="" />;
}
