import { GREEN, TEXT_COLOR } from "@/constants/constants";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
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

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {reviewedCount} of {Math.max(totalCount, 0)} reviewed
      </Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
};

export default SessionProgress;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 8,
  },
  label: {
    fontFamily: "Goldman-Regular",
    fontSize: 14,
    color: TEXT_COLOR,
  },
  track: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: GREEN,
  },
});
