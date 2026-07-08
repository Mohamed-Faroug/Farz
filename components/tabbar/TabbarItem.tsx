import { TAB_ITEM_SIZE, TEXT_COLOR } from "@/constants/constants";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  title: string | undefined;
  tabBarIcon: React.ReactNode;
  onPress: () => void;
  isFocused: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TabbarItem = ({ title, tabBarIcon, onPress, isFocused }: Props) => {
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    rotateY.value = withSpring(isFocused ? 0 : 360);
    scale.value = withSpring(isFocused ? 1.2 : 1);
  }, [isFocused]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotateY.value}deg` }, { scale: scale.value }],
    };
  });

  return (
    <Animated.View style={styles.container}>
      <AnimatedPressable style={animatedStyles} onPress={onPress}>
        {tabBarIcon}
      </AnimatedPressable>
      {!isFocused && (
        <Animated.Text
          entering={FadeInUp.springify()}
          exiting={FadeOutDown.springify()}
          style={{ fontSize: 12, color: TEXT_COLOR }}
        >
          {title}
        </Animated.Text>
      )}
    </Animated.View>
  );
};

export default TabbarItem;

const styles = StyleSheet.create({
  container: {
    height: TAB_ITEM_SIZE,
    width: TAB_ITEM_SIZE,
    borderRadius: TAB_ITEM_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
