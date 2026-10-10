import { ErrorBoundary } from '../components/ErrorBoundary.tsx';
import { StorageNote } from '../components/StorageNote.tsx';
import { UpdateBar } from '../components/UpdateBar.tsx';
import { ProgressContext } from '../progress/hooks.ts';
import type { ProgressStore } from '../progress/store.ts';
import { About } from '../screens/About.tsx';
import { ErrorScreen } from '../screens/ErrorScreen.tsx';
import { MissionIntro } from '../screens/MissionIntro.tsx';
import { MissionStep } from '../screens/MissionStep.tsx';
import { MissionSummary } from '../screens/MissionSummary.tsx';
import { Passport } from '../screens/Passport.tsx';
import { Start } from '../screens/Start.tsx';
import { Town } from '../screens/Town.tsx';
import { useRoute } from './router.ts';
import { type Route, routeKey } from './routes.ts';

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case 'start':
      return <Start />;
    case 'town':
      return <Town />;
    case 'mission-intro':
      return <MissionIntro missionId={route.missionId} />;
    case 'mission-step':
      return <MissionStep missionId={route.missionId} stepId={route.stepId} />;
    case 'mission-summary':
      return <MissionSummary missionId={route.missionId} />;
    case 'passport':
      return <Passport />;
    case 'about':
      return <About />;
    case 'not-found':
      return <ErrorScreen kind="not-found" />;
  }
}

export function App({ store }: { store: ProgressStore }) {
  const route = useRoute();
  const key = routeKey(route);
  return (
    <ProgressContext.Provider value={store}>
      {/* Keyed by route: each screen mounts fresh, and an error on one screen doesn't stick to the next. */}
      <ErrorBoundary key={key}>
        <Screen route={route} />
      </ErrorBoundary>
      <div class="bars">
        <StorageNote />
        <UpdateBar />
      </div>
    </ProgressContext.Provider>
  );
}
