import { useEffect, useRef } from 'preact/hooks';

/** Focuses the returned heading whenever `key` changes (not on first render). */
export function useHeadingFocus(key: unknown) {
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [key]);
  return heading;
}
