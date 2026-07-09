import SessionProgress from "@/components/SessionProgress";
import { BG_COLOR, GREEN, TEXT_COLOR } from "@/constants/constants";
import { translations } from "@/constants/translations";
import { useAppState } from "@/context/AppStateContext";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";
import { formatBytes } from "@/utils/formatBytes";
import { Check, Images, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInLeft, FadeInRight, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type StatRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function StatRow({ label, value, highlight }: StatRowProps) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, highlight && styles.highlightValue]}>
        {value}
      </Text>
    </View>
  );
}

export default function StatsScreen() {
  const {
    reviewedCount,
    keptCount,
    trashCount,
    deletedCount,
    freedBytesTotal,
    pendingTrashBytes,
    resetSession,
  } = useAppState();
  const { totalCount } = useGalleryPhotos();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    Alert.alert(
      translations.resetSessionAlert,
      translations.resetAlertMessage,
      [
        { text: translations.cancel, style: "cancel" },
        {
          text: translations.reset,
          style: "destructive",
          onPress: async () => {
            setIsResetting(true);
            await resetSession();
            setIsResetting(false);
          },
        },
      ]
    );
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const stats = [
    {
      label: translations.reviewed,
      value: String(reviewedCount),
      icon: <Images color="#000000" size={20} />,
      color: "#bdf14d",
      textColor: "black",
    },
    {
      label: translations.kept,
      value: String(keptCount),
      icon: <Check color="#000000" size={20} />,
      color: "black",
      textColor: "white",
    },
    {
      label: translations.trash,
      value: String(trashCount),
      icon: <Trash2 color="#000000" size={20} />,
      color: "#f14de1ff",
      textColor: "white",
    },
  ];

  const handlePress = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % stats.length);
  };

  const stylesReanimated = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        stats[activeIndex === 2 ? 0 : activeIndex + 1].color,
        { duration: 250 }
      ),
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Animated.View
        entering={FadeInRight.springify()}
        exiting={FadeInLeft.springify()}
        style={styles.header}
      >
        <Text style={styles.title}>{translations.sessionStats}</Text>
        <View style={styles.rightHeader}>
          <SessionProgress reviewedCount={reviewedCount} totalCount={totalCount} />
          <Pressable onPress={handlePress} style={styles.badgeContainer}>
            <Animated.View style={[styles.placeholderBg, stylesReanimated]} />
            {stats.map((stat, index) => (
              <View
                key={stat.label}
                style={[
                  styles.badgeItem,
                  { backgroundColor: stat.color },
                  activeIndex === index && styles.activeBadge,
                ]}
              >
                <View style={styles.iconContainer}>{stat.icon}</View>
                <Text style={[styles.valueText, { color: stat.textColor }]}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </Pressable>
        </View>
      </Animated.View>

      <View style={styles.card}>
        <StatRow label={translations.reviewed} value={String(reviewedCount)} />
        <StatRow label={translations.kept} value={String(keptCount)} />
        <StatRow label={translations.trash} value={String(trashCount)} />
        <StatRow label={translations.deletedFromDevice} value={String(deletedCount)} />
        <StatRow
          label={translations.spaceFreed}
          value={formatBytes(freedBytesTotal)}
          highlight
        />
        <StatRow
          label={translations.pendingInTrash}
          value={formatBytes(pendingTrashBytes)}
        />
      </View>

      <Text style={styles.note}>
        {translations.statsNote}
      </Text>

      <Pressable
        style={[styles.resetButton, isResetting && styles.buttonDisabled]}
        onPress={handleReset}
        disabled={isResetting}
      >
        {isResetting ? (
          <ActivityIndicator color={TEXT_COLOR} />
        ) : (
          <Text style={styles.resetButtonText}>{translations.resetSession}</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingHorizontal: 24,
    paddingTop: 10,
    gap: 20,
  },
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
    direction: "rtl",
  },
  title: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 24,
    color: TEXT_COLOR,
    textAlign: "right",
  },
  rightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badgeContainer: {
    height: 44,
    width: 120,
    position: "relative",
  },
  placeholderBg: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
    borderRadius: 22,
    position: "absolute",
    transformOrigin: "left",
    transform: [
      { rotateZ: "8deg" },
      { translateY: -2 },
    ],
  },
  badgeItem: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 7,
    flexDirection: "row",
    gap: 10,
    borderRadius: 22,
    opacity: 0,
  },
  activeBadge: {
    opacity: 1,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  valueText: {
    fontFamily: "Goldman-Bold",
    fontSize: 18,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontFamily: "Thmanyah-Regular",
    fontSize: 16,
    color: "gray",
  },
  statValue: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 22,
    color: TEXT_COLOR,
  },
  highlightValue: {
    color: GREEN,
  },
  note: {
    fontFamily: "Thmanyah-Regular",
    fontSize: 14,
    color: "gray",
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f14de1",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 16,
    color: "#f14de1",
  },
});
