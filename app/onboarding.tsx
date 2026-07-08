import { BG_COLOR, GREEN, TEXT_COLOR } from "@/constants/constants";
import { markOnboardingComplete } from "@/storage/onboardingStorage";
import { Sparkles, Trash2, Check } from "lucide-react-native";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = async () => {
    await markOnboardingComplete();
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>SwipeClean</Text>
        <Text style={styles.tagline}>
          Clean years of photos in minutes with satisfying swipe gestures.
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureRow}>
            <Check color={TEXT_COLOR} size={22} />
            <Text style={styles.featureText}>Swipe right to keep</Text>
          </View>
          <View style={styles.featureRow}>
            <Trash2 color={TEXT_COLOR} size={22} />
            <Text style={styles.featureText}>Swipe left to trash</Text>
          </View>
          <View style={styles.featureRow}>
            <Sparkles color={TEXT_COLOR} size={22} />
            <Text style={styles.featureText}>Review one photo at a time</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get started</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
  },
  appName: {
    fontFamily: "Goldman-Bold",
    fontSize: 36,
    color: TEXT_COLOR,
  },
  tagline: {
    fontFamily: "Goldman-Regular",
    fontSize: 18,
    color: "gray",
    lineHeight: 26,
  },
  featureList: {
    gap: 16,
    marginTop: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontFamily: "Goldman-Bold",
    fontSize: 16,
    color: TEXT_COLOR,
  },
  button: {
    backgroundColor: GREEN,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Goldman-Bold",
    fontSize: 18,
    color: TEXT_COLOR,
  },
});
