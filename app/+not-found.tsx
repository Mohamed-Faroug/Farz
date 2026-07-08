import { BG_COLOR, GREEN, TEXT_COLOR } from "@/constants/constants";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found", headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>📷</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.message}>
          This screen doesn't exist in SwipeClean.
        </Text>

        <Link href="/(tabs)" style={styles.link}>
          <Text style={styles.linkText}>Back to Swipe</Text>
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
    fontFamily: "Goldman-Bold",
    fontSize: 24,
    color: TEXT_COLOR,
  },
  message: {
    fontFamily: "Goldman-Regular",
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
    fontFamily: "Goldman-Bold",
    fontSize: 15,
    color: GREEN,
  },
});
