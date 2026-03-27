import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkProvider, ClerkLoaded, SignedIn, SignedOut } from "@clerk/clerk-expo";
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your client/.env');
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkLoaded>
        <SafeAreaProvider>
          {/* IF LOGGED IN: Show the main app */}
          <SignedIn>
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="search" options={{ animation: 'fade' }} />
            </Stack>
          </SignedIn>

          {/* IF NOT LOGGED IN: Show only the Login/Register screen */}
          <SignedOut>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="sign-in" />
            </Stack>
          </SignedOut>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}