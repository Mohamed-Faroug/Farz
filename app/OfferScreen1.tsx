import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OfferScreen1() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const handleStartPlan = () => {
    // Navigate to next offer screen or main app
    router.push("/OfferScreen2");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      <Pressable onPress={handleClose} style={styles.closeButton}>
        <X color="white" size={28} />
      </Pressable>

      {/* Main Content */}
      <View style={styles.content}>
        {/* 50% OFF Text */}
        <View style={styles.discountSection}>
          <Text style={styles.discountText}>50%</Text>
          <Text style={styles.discountText}>OFF</Text>
        </View>

        {/* Images Collage */}
        <View style={styles.imagesContainer}>
          <View style={styles.imageCard}>
            <View style={[styles.imagePlaceholder, { backgroundColor: "#87CEEB" }]} />
          </View>
          <View style={styles.imageCardCenter}>
            <View style={[styles.imagePlaceholder, { backgroundColor: "#DEB887" }]} />
          </View>
          <View style={styles.imageCard}>
            <View style={[styles.imagePlaceholder, { backgroundColor: "#F4A460" }]} />
          </View>
        </View>

        {/* One Time Offer */}
        <Text style={styles.offerLabel}>عرض لمرة واحدة</Text>

        {/* Countdown Timer */}
        <View style={styles.timerContainer}>
          <View style={styles.timerBox}>
            <Text style={styles.timerNumber}>0</Text>
          </View>
          <View style={styles.timerBox}>
            <Text style={styles.timerNumber}>4</Text>
          </View>
          <Text style={styles.timerColon}>:</Text>
          <View style={styles.timerBox}>
            <Text style={styles.timerNumber}>5</Text>
          </View>
          <View style={styles.timerBox}>
            <Text style={styles.timerNumber}>7</Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingContainer}>
          <Text style={styles.originalPrice}>SAR 124.99</Text>
          <Text style={styles.discountedPrice}>SAR 64.99</Text>
        </View>

        {/* Start Plan Button */}
        <Pressable style={styles.startButton} onPress={handleStartPlan}>
          <Text style={styles.startButtonText}>ابدأ الخطة</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A90E2",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
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
  discountSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  discountText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "white",
    lineHeight: 80,
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    gap: 10,
  },
  imageCard: {
    width: 100,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    transform: [{ rotate: "-5deg" }],
  },
  imageCardCenter: {
    width: 140,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    zIndex: 2,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
  },
  offerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
    letterSpacing: 1,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 30,
  },
  timerBox: {
    width: 50,
    height: 60,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timerNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  timerColon: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  pricingContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  originalPrice: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    textDecorationLine: "line-through",
    marginBottom: 8,
  },
  discountedPrice: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
  },
  startButton: {
    backgroundColor: "white",
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    minWidth: 250,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A90E2",
  },
});