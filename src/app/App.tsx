import type { ComponentChildren } from 'preact';
import { useMemo } from 'preact/hooks';
import { ErrorBoundary } from '../components/ErrorBoundary.tsx';
import { StickerCelebration } from '../components/StickerCelebration.tsx';
import { StorageNote } from '../components/StorageNote.tsx';
import { UpdateBar } from '../components/UpdateBar.tsx';
import { I18nContext, i18nFor } from '../i18n/i18n.ts';
import { ProgressContext, useProgress } from '../progress/hooks.ts';
import { audienceOf } from '../progress/selectors.ts';
import type { ProgressStore } from '../progress/store.ts';
import { About } from '../screens/About.tsx';
import { ErrorScreen } from '../screens/ErrorScreen.tsx';
import { MissionIntro } from '../screens/MissionIntro.tsx';
import { MissionMore } from '../screens/MissionMore.tsx';
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
    case 'mission-more':
      return <MissionMore missionId={route.missionId} />;
    case 'passport':
      return <Passport />;
    case 'about':
      return <About />;
    case 'not-found':
      return <ErrorScreen kind="not-found" />;
  }
}

/** Provides locale and audience; the audience is the player's own choice, saved with progress. */
function WithI18n({ children }: { children: ComponentChildren }) {
  const { progress } = useProgress();
  const audience = audienceOf(progress);
  const i18n = useMemo(() => i18nFor('nb', audience), [audience]);
  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}

export function App({ store }: { store: ProgressStore }) {
  const route = useRoute();
  const key = routeKey(route);
  return (
    <ProgressContext.Provider value={store}>
      <WithI18n>
        {/* Keyed by route: each screen mounts fresh, and an error on one screen doesn't stick to the next. */}
        <ErrorBoundary key={key}>
          <Screen route={route} />
        </ErrorBoundary>
        <StickerCelebration />
        <div class="bars">
          <StorageNote />
          <UpdateBar />
        </div>
      </WithI18n>
    </ProgressContext.Provider>
  );
}
