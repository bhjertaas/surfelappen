import { useEffect, useState } from 'preact/hooks';
import { href, parseHash, type Route } from './routes.ts';

/**
 * A minimal hash router (ADR 0003). `navigate` adds a history entry; `replace`
 * swaps the current one, which is how a mission moves between steps so the back
 * button leaves the mission instead of revisiting answered cases.
 */

const ROUTE_CHANGE = 'surfelappen:routechange';

export function currentRoute(): Route {
  return parseHash(window.location.hash);
}

export function navigate(route: Route): void {
  window.location.hash = href(route);
}

export function replace(route: Route): void {
  const url = new URL(window.location.href);
  url.hash = href(route);
  window.history.replaceState(window.history.state, '', url);
  // replaceState fires no event of its own.
  window.dispatchEvent(new Event(ROUTE_CHANGE));
}

export function useRoute(): Route {
  const [route, setRoute] = useState(currentRoute);
  useEffect(() => {
    const update = () => setRoute(currentRoute());
    window.addEventListener('hashchange', update);
    window.addEventListener(ROUTE_CHANGE, update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener(ROUTE_CHANGE, update);
    };
  }, []);
  return route;
}
