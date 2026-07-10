import { BG_COLOR, GREEN, TEXT_COLOR } from "@/constants/constants";
import { translations } from "@/constants/translations";
import { markOnboardingComplete } from "@/storage/onboardingStorage";
import { useRouter } from "expo-router";
import { Check, Sparkles, Trash2 } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = async () => {
    await markOnboardingComplete();
    router.push("/OfferScreen1");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>{translations.appName}</Text>
        <Text style={styles.tagline}>
          نظف سنوات من الصور في دقائق باستخدام إيماءات السحب المرضية.
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureRow}>
            <Check color={TEXT_COLOR} size={22} />
            <Text style={styles.featureText}>اسحب لليمين للاحتفاظ</Text>
          </View>
          <View style={styles.featureRow}>
            <Trash2 color={TEXT_COLOR} size={22} />
            <Text style={styles.featureText}>اسحب لليسار للحذف</Text>
          </View>
          <View style={styles.featureRow}>
            <Sparkles color={TEXT_COLOR} size={22} />
            <Text style={styles.featureText}>راجع صورة واحدة في كل مرة</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>ابدأ الآن</Text>
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
    direction: "rtl",
  },
  appName: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 36,
    color: TEXT_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  tagline: {
    fontFamily: "Thmanyah-Regular",
    fontSize: 18,
    color: "gray",
    lineHeight: 26,
    textAlign: "right",
    writingDirection: "rtl",
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
    fontFamily: "Thmanyah-Bold",
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
    fontFamily: "Thmanyah-Bold",
    fontSize: 18,
    color: TEXT_COLOR,
  },
});
