import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ProviderContext } from "@/context/ProviderContext";
import { NetworkProvider } from "@/context/NetworkContext";
import { BookingsProvider } from "@/context/BookingsContext";
import OfflineBanner from "@/components/OfflineBanner";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="service/[category]" options={{ headerShown: false }} />
      <Stack.Screen name="provider/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="provider-register" options={{ headerShown: false }} />
      <Stack.Screen name="admin-providers" options={{ headerShown: false }} />
      <Stack.Screen name="privacy" options={{ title: "Privacy Policy" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <ProviderContext>
          <BookingsProvider>
            <GestureHandlerRootView>
              <RootLayoutNav />
              <OfflineBanner />
            </GestureHandlerRootView>
          </BookingsProvider>
        </ProviderContext>
      </NetworkProvider>
    </QueryClientProvider>
  );
}
