import { translations } from "@/constants/translations";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const SPLASH_ICON = require("../assets/images/splash-icon.png");

export default function SplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [fontsLoaded] = useFonts({
    "Thmanyah-Bold": require("../assets/fonts/thmanyahserifdisplay-Bold.otf"),
    "Thmanyah-Regular": require("../assets/fonts/thmanyahserifdisplay-Regular.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image source={SPLASH_ICON} style={styles.logo} contentFit="contain" />
        <Text style={styles.footer}>{translations.appName} - صنع بحب في مدينة عطبرة</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  footer: {
    fontFamily: "Thmanyah-Regular",
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.8,
    position: "absolute",
    bottom: 60,
    paddingHorizontal: 40,
  },
});