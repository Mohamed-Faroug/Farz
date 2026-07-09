import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

type ActionButtonProps = {
  icon: React.ReactNode;
  onPress: () => void;
  color: string;
  size?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ActionButton = ({ icon, onPress, color, size = 56 }: ActionButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        animatedStyles,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {icon}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ActionButton;