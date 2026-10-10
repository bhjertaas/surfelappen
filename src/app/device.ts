/**
 * True when the device has a touch screen and no fine pointer (mouse/trackpad),
 * i.e. probably no physical keyboard. A Bluetooth keyboard can't be detected,
 * which is why "Start likevel" is always offered.
 */
export function isTouchOnly(): boolean {
  if (typeof window.matchMedia !== 'function') return false;
  return (
    window.matchMedia('(any-pointer: coarse)').matches &&
    !window.matchMedia('(any-pointer: fine)').matches
  );
}
