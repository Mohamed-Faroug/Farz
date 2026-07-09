import { GREEN, TEXT_COLOR } from "@/constants/constants";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  useSharedValue,
  withTiming
} from "react-native-reanimated";


type Props = {
  reviewedCount: number;
  totalCount: number;
};

const SessionProgress = ({ reviewedCount, totalCount }: Props) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    const target = Math.min(reviewedCount / Math.max(totalCount, 1), 1);
    progress.value = withTiming(target, { duration: 350 });
  }, [reviewedCount, totalCount, progress]);

  const percentage = Math.round((reviewedCount / Math.max(totalCount, 1)) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {reviewedCount}/{Math.max(totalCount, 0)}
      </Text>
      <Text style={styles.percentage}>{percentage}%</Text>
    </View>
  );
};

export default SessionProgress;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GREEN,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 14,
    color: TEXT_COLOR,
  },
  percentage: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 14,
    color: TEXT_COLOR,
    opacity: 0.8,
  },
});
