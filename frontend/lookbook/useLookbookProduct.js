import { useEffect, useState } from 'react';
import { fetchLookbookProducts } from './api';

function requestKey(payload, handles) {
  return [payload.storeDomain, payload.country, payload.language, ...handles].join('|');
}

export function useLookbookProducts(payload) {
  const handles = [...new Set(payload.lookbooks.flatMap((l) => l.productHandles))];
  const key = requestKey(payload, handles);
  const [state, setState] = useState({ status: 'loading', byHandle: {} });

  useEffect(() => {
    let cancelled = false;

    fetchLookbookProducts({
      storeDomain: payload.storeDomain,
      storefrontToken: payload.storefrontToken,
      apiVersion: payload.apiVersion,
      country: payload.country,
      language: payload.language,
      handles,
    })
      .then((products) => {
        if (cancelled) return;
        setState({
          status: 'ready',
          byHandle: Object.fromEntries(products.map((p) => [p.handle, p])),
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error(error);
        setState({ status: 'error', byHandle: {} });
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return state;
}
