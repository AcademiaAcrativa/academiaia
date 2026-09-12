import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log(
  '%cfeito pelo pedro luka crlh, veio procurar oq no console hein???',
  'color: #00ffff; font-size: 16px; font-weight: bold; background: #111; padding: 8px 12px; border-radius: 6px; border: 1px solid #00c8ff;'
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

