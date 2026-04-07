import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react-native';
import { useNetwork } from '@/context/NetworkContext';

export default function OfflineBanner() {
  const { isOnline, isChecking, checkConnection } = useNetwork();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const reconnectedAnim = useRef(new Animated.Value(-60)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -60,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (wasOffline) {
        setShowReconnected(true);
        setWasOffline(false);
        Animated.spring(reconnectedAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }).start();

        const timer = setTimeout(() => {
          Animated.timing(reconnectedAnim, {
            toValue: -60,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setShowReconnected(false));
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [isOnline, slideAnim, wasOffline, reconnectedAnim]);

  useEffect(() => {
    if (isChecking) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [isChecking, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isOnline && !showReconnected) return null;

  return (
    <>
      {!isOnline && (
        <Animated.View
          style={[
            styles.banner,
            styles.offlineBanner,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.bannerContent}>
            <WifiOff size={16} color="#fff" />
            <Text style={styles.bannerText}>You're offline</Text>
          </View>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => void checkConnection()}
            disabled={isChecking}
          >
            <Animated.View style={{ transform: [{ rotate: isChecking ? spin : '0deg' }] }}>
              <RefreshCw size={14} color="#fff" />
            </Animated.View>
            <Text style={styles.retryText}>{isChecking ? 'Checking...' : 'Retry'}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {showReconnected && (
        <Animated.View
          style={[
            styles.banner,
            styles.onlineBanner,
            { transform: [{ translateY: reconnectedAnim }] },
          ]}
        >
          <View style={styles.bannerContent}>
            <Wifi size={16} color="#fff" />
            <Text style={styles.bannerText}>Back online</Text>
          </View>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 44,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  offlineBanner: {
    backgroundColor: '#DC2626',
  },
  onlineBanner: {
    backgroundColor: '#16A34A',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
});
