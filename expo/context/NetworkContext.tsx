import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Platform, AppState } from 'react-native';

type NetworkContextType = {
  isOnline: boolean;
  isChecking: boolean;
  lastCheckedAt: string | null;
  checkConnection: () => Promise<boolean>;
};

async function checkInternetReachability(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://clients3.google.com/generate_204', {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok || response.status === 204;
  } catch {
    return false;
  }
}

export const [NetworkProvider, useNetwork] = createContextHook<NetworkContextType>(() => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const reachable = await checkInternetReachability();
      setIsOnline(reachable);
      setLastCheckedAt(new Date().toISOString());
      console.log('[Network] Connection check:', reachable ? 'ONLINE' : 'OFFLINE');
      return reachable;
    } catch {
      setIsOnline(false);
      setLastCheckedAt(new Date().toISOString());
      console.log('[Network] Connection check: OFFLINE (error)');
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    void checkConnection();

    intervalRef.current = setInterval(() => {
      void checkConnection();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkConnection]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        console.log('[Network] App became active, checking connection...');
        void checkConnection();
      }
    });

    return () => subscription.remove();
  }, [checkConnection]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleOnline = () => {
        console.log('[Network] Browser reports online');
        setIsOnline(true);
        void checkConnection();
      };
      const handleOffline = () => {
        console.log('[Network] Browser reports offline');
        setIsOnline(false);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [checkConnection]);

  return useMemo(() => ({
    isOnline,
    isChecking,
    lastCheckedAt,
    checkConnection,
  }), [isOnline, isChecking, lastCheckedAt, checkConnection]);
});
