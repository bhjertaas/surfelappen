import { nb } from '../i18n/locales/nb.ts';

export function App() {
  const m = nb;
  return (
    <>
      <main>
        <h1>{m.app.name}</h1>
        <p>{m.app.pitch}</p>
        <p>{m.app.underConstruction}</p>
      </main>
      <footer>
        <small>
          {m.app.version} {__APP_VERSION__}
        </small>
      </footer>
    </>
  );
}
