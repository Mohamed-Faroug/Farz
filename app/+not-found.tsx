import { BG_COLOR, GREEN, TEXT_COLOR } from "@/constants/constants";
import { translations } from "@/constants/translations";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: translations.pageNotFound, headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>📷</Text>
        <Text style={styles.title}>{translations.pageNotFound}</Text>
        <Text style={styles.message}>
          {translations.screenNotFound}
        </Text>

        <Link href="/(tabs)" style={styles.link}>
          <Text style={styles.linkText}>{translations.backToHome}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: BG_COLOR,
    gap: 12,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 24,
    color: TEXT_COLOR,
    textAlign: "center",
  },
  message: {
    fontFamily: "Thmanyah-Regular",
    fontSize: 15,
    color: "gray",
    textAlign: "center",
  },
  link: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "black",
  },
  linkText: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 15,
    color: GREEN,
  },
});
