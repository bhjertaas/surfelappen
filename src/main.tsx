import { render } from 'preact';
import { App } from './app/App.tsx';
import { applyAwards } from './progress/awards.ts';
import { localStorageBackend, STORAGE_KEY } from './progress/backends.ts';
import { createProgressStore } from './progress/store.ts';
import { registerServiceWorker } from './pwa/register.ts';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

const store = createProgressStore(localStorageBackend(), applyAwards);

// Another tab saved or reset progress: pick it up.
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY || event.key === null) store.reload();
});

const root = document.getElementById('app');
if (root) render(<App store={store} />, root);

registerServiceWorker();
