import { createStore } from 'redux';
import rootReducer from './reducers/reducers';

// La sesión y las favoritas se guardan en el navegador para sobrevivir a recargas.
// No hay backend: es una sesión simulada solo en este dispositivo.
const STORAGE_KEY = 'moviematch-state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

const store = createStore(rootReducer, loadState());

store.subscribe(() => {
  const { user, favorites } = store.getState();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, favorites }));
  } catch {
    /* almacenamiento lleno o bloqueado: seguimos sin persistir */
  }
});

export default store;
