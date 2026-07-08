import { BADGE_HEIGHT, INACTIVE_ROTATION } from "@/constants/constants";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  icon: React.ReactNode;
  activeIndex: number;
  value: string;
  color: string;
  index: number;
};

const BadgeItem = ({ icon, activeIndex, value, color, index }: Props) => {
  const isActive = activeIndex === index;
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = isActive ? 1 : 0;
  }, [isActive]);

  const stylesReanimated = useAnimatedStyle(() => {
    return {
      zIndex: animatedValue.value,
      opacity: withTiming(animatedValue.value, { duration: 250 }),
      transform: [
        {
          rotateZ: withSpring(
            animatedValue.value === 0 ? INACTIVE_ROTATION : "0deg",
            {
              damping: 20,
              stiffness: 900,
              mass: 0.9,
            }
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[styles.container, { backgroundColor: color }, stylesReanimated]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.valueText]}>{value}</Text>
    </Animated.View>
  );
};

export default BadgeItem;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 7,
    flexDirection: "row",
    gap: 10,
    backgroundColor: "blue",
    borderRadius: BADGE_HEIGHT / 2,
    transformOrigin: "left",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 28,
    height: 28,
    borderRadius: 28 / 2,
  },
  valueText: {
    color: "white",
    fontFamily: "Goldman-Bold",
    fontSize: 18,
  },
});
