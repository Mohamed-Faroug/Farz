import SessionProgress from "@/components/SessionProgress";
import { BG_COLOR, GREEN, TEXT_COLOR } from "@/constants/constants";
import { useAppState } from "@/context/AppStateContext";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";
import { formatBytes } from "@/utils/formatBytes";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
      "Reset session?",
      "This clears kept, trash, and stats. Your gallery photos will not be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.title}>Session Stats</Text>

      <SessionProgress reviewedCount={reviewedCount} totalCount={totalCount} />

      <View style={styles.card}>
        <StatRow label="Reviewed" value={String(reviewedCount)} />
        <StatRow label="Kept" value={String(keptCount)} />
        <StatRow label="In trash" value={String(trashCount)} />
        <StatRow label="Deleted from device" value={String(deletedCount)} />
        <StatRow
          label="Space freed"
          value={formatBytes(freedBytesTotal)}
          highlight
        />
        <StatRow
          label="Pending in trash"
          value={formatBytes(pendingTrashBytes)}
        />
      </View>

      <Text style={styles.note}>
        Stats are saved automatically and persist when you reopen the app.
      </Text>

      <Pressable
        style={[styles.resetButton, isResetting && styles.buttonDisabled]}
        onPress={handleReset}
        disabled={isResetting}
      >
        {isResetting ? (
          <ActivityIndicator color={TEXT_COLOR} />
        ) : (
          <Text style={styles.resetButtonText}>Reset session</Text>
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
  title: {
    fontFamily: "Goldman-Bold",
    fontSize: 28,
    color: TEXT_COLOR,
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
    fontFamily: "Goldman-Regular",
    fontSize: 16,
    color: "gray",
  },
  statValue: {
    fontFamily: "Goldman-Bold",
    fontSize: 22,
    color: TEXT_COLOR,
  },
  highlightValue: {
    color: GREEN,
  },
  note: {
    fontFamily: "Goldman-Regular",
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
    fontFamily: "Goldman-Bold",
    fontSize: 16,
    color: "#f14de1",
  },
});
