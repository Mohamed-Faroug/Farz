import { useRouter } from "expo-router";
import { Star, X } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OfferScreen2() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const handleTryFree = () => {
    // Navigate to main app or complete onboarding
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      <Pressable onPress={handleClose} style={styles.closeButton}>
        <X color="white" size={28} />
      </Pressable>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Star color="white" size={60} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>جرب فرز برو</Text>

        {/* Description */}
        <Text style={styles.description}>
          افتح جميع الميزات المميزة واختبر الفوائد الكاملة للاشتراك المميز.
        </Text>

        {/* Pricing Cards */}
        <View style={styles.pricingCards}>
          {/* Weekly */}
          <View style={styles.pricingCard}>
            <Text style={styles.pricingLabel}>أسبوعي</Text>
            <Text style={styles.pricingPrice}>14.99</Text>
            <Text style={styles.pricingPeriod}>ريال/أسبوع</Text>
          </View>

          {/* Yearly - Popular */}
          <View style={[styles.pricingCard, styles.popularCard]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>شائع</Text>
            </View>
            <Text style={styles.pricingLabel}>سنوي</Text>
            <Text style={styles.pricingPrice}>12.49</Text>
            <Text style={styles.pricingPeriod}>ريال/سنة</Text>
          </View>

          {/* Monthly */}
          <View style={styles.pricingCard}>
            <Text style={styles.pricingLabel}>شهري</Text>
            <Text style={styles.pricingPrice}>24.99</Text>
            <Text style={styles.pricingPeriod}>ريال/شهر</Text>
          </View>
        </View>

        {/* Auto Renew Text */}
        <Text style={styles.autoRenew}>يتجدد تلقائياً. يمكنك الإلغاء في أي وقت.</Text>

        {/* Try for Free Button */}
        <Pressable style={styles.tryButton} onPress={handleTryFree}>
          <Text style={styles.tryButtonText}>جرّب مجاناً</Text>
        </Pressable>

        {/* Bottom Links */}
        <View style={styles.bottomLinks}>
          <Pressable>
            <Text style={styles.linkText}>الشروط</Text>
          </Pressable>
          <Pressable>
            <Text style={styles.linkText}>الخصوصية</Text>
          </Pressable>
          <Pressable>
            <Text style={styles.linkText}>استعادة</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  pricingCards: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  popularCard: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: "#1a1a2e",
    fontSize: 12,
    fontWeight: "bold",
  },
  pricingLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  pricingPeriod: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  autoRenew: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 30,
  },
  tryButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    minWidth: 250,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  tryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  bottomLinks: {
    flexDirection: "row",
    gap: 30,
  },
  linkText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
});