// =============================================================================
// usePwaUpdate - registers the service worker and exposes a "new version
// available" signal so the UI can show a Reload banner (registerType:'prompt').
// =============================================================================

import { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePwaUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateSW = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    updateSW.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true);
      },
    });
  }, []);

  const reload = () => {
    void updateSW.current?.(true); // skip waiting + reload the page
  };

  return { needRefresh, reload };
}
