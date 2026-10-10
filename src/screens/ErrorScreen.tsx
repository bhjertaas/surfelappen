import { href } from '../app/routes.ts';
import { Page } from '../components/Page.tsx';
import { useI18n } from '../i18n/i18n.ts';

/** "Something went wrong" or "not found": plain language, always a way back to town. */
export function ErrorScreen({ kind }: { kind: 'error' | 'not-found' }) {
  const { m } = useI18n();
  const notFound = kind === 'not-found';
  return (
    <Page title={notFound ? m.error.notFoundTitle : m.error.errorTitle}>
      <p>{notFound ? m.error.notFoundBody : m.error.errorBody}</p>
      <p>
        <a class="button" href={href({ name: 'town' })}>
          {m.error.backToTown}
        </a>
      </p>
    </Page>
  );
}
