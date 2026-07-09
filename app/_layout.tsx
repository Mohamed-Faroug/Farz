import { BG_COLOR } from "@/constants/constants";
import { AppStateProvider } from "@/context/AppStateContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "FiraCode-Regular": require("../assets/fonts/FiraCode-Regular.ttf"),
    "SF-Pro-Rounded-Bold": require("../assets/fonts/SF-Pro-Rounded-Bold.otf"),
    "Goldman-Bold": require("../assets/fonts/Goldman-Bold.ttf"),
    "Goldman-Regular": require("../assets/fonts/Goldman-Regular.ttf"),
    "Thmanyah-Regular": require("../assets/fonts/thmanyahserifdisplay-Regular.otf"),
    "Thmanyah-Bold": require("../assets/fonts/thmanyahserifdisplay-Bold.otf"),
    "Thmanyah-Black": require("../assets/fonts/thmanyahserifdisplay-Black.otf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AppStateProvider>
      <View style={{ flex: 1, backgroundColor: BG_COLOR }}>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </AppStateProvider>
  );
}
