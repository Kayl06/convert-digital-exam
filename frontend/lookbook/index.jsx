import { createRoot } from 'react-dom/client';
import { Lookbook } from './Lookbook';

const roots = new Map();

function readLookbookData(el) {
  const script = el.querySelector('script[type="application/json"]');
  if (!script) return null;
  return JSON.parse(script.textContent);
}

function unmount(id) {
  const root = roots.get(id);
  if (!root) return;
  root.unmount();
  roots.delete(id);
}

function mount(el) {
  const payload = readLookbookData(el);
  if (!payload) return;
  unmount(payload.sectionId);
  const root = createRoot(el);
  roots.set(payload.sectionId, root);
  root.render(<Lookbook payload={payload} />);
}

document.querySelectorAll('[data-lookbook-root]').forEach(mount);

if (!window.lookbookIsland) {
  window.lookbookIsland = true;

  document.addEventListener('shopify:section:load', (event) => {
    event.target.querySelectorAll('[data-lookbook-root]').forEach(mount);

    const script = event.target.querySelector('script[src*="lookbook.js"]');
    if (!script) return;
    const next = document.createElement('script');
    next.src = script.src;
    script.replaceWith(next);
  });

  document.addEventListener('shopify:section:unload', (event) => {
    event.target.querySelectorAll('[data-lookbook-root]').forEach((el) => {
      const payload = readLookbookData(el);
      unmount(payload?.sectionId || el.id.replace(/^Lookbook-/, ''));
    });
  });
}
