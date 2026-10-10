/**
 * Focus handling on navigation (architecture "Router"): the first screen after a
 * page load keeps the browser's default focus; every later screen moves focus to
 * its <h1> so screen readers announce the new screen, and scrolls to the top.
 */
let firstScreen = true;

export function focusScreenHeading(heading: HTMLElement | null): void {
  if (firstScreen) {
    firstScreen = false;
    return;
  }
  window.scrollTo(0, 0);
  heading?.focus({ preventScroll: true });
}
