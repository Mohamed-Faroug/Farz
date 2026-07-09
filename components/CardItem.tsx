import {
  GREEN,
  SPRING_CONFIG,
  SWIPE_THRESHOLD,
  SWIPE_VELOCITY_THRESHOLD,
} from "@/constants/constants";
import { translations } from "@/constants/translations";
import { SwipeAction } from "@/types/media";
import { triggerKeepHaptic, triggerTrashHaptic } from "@/utils/haptics";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const DELETE_COLOR = "#f14de1";

type Props = {
  index: number;
  uri: string;
  topCardDragX: SharedValue<number>;
  onSwipe: (action: SwipeAction) => void;
};

const CardItem = ({ index, uri, topCardDragX, onSwipe }: Props) => {
  const transformX = useSharedValue(0);
  const transformY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = 1;
    transformX.value = 0;
    transformY.value = 0;
    if (index === 0) {
      topCardDragX.value = 0;
    }
  }, [index, opacity, transformX, transformY, topCardDragX]);

  const triggerHaptic = (action: SwipeAction) => {
    if (action === "keep") {
      triggerKeepHaptic();
    } else {
      triggerTrashHaptic();
    }
  };

  const finishSwipe = (action: SwipeAction) => {
    "worklet";
    scheduleOnRN(triggerHaptic, action);
    opacity.value = withSpring(0, SPRING_CONFIG);
    transformX.value = withDecay(
      {
        velocity: action === "trash" ? -1000 : 1000,
        rubberBandEffect: false,
      },
      () => {
        "worklet";
        topCardDragX.value = 0;
        scheduleOnRN(onSwipe, action);
      }
    );
  };

  const gesture = Gesture.Pan()
    .enabled(index === 0)
    .onUpdate((e) => {
      transformX.value = e.translationX;
      transformY.value = e.translationY * 0.25;
      topCardDragX.value = e.translationX;
    })
    .onEnd((e) => {
      const isTrashSwipe =
        transformX.value < -SWIPE_THRESHOLD ||
        (e.velocityX < -SWIPE_VELOCITY_THRESHOLD && transformX.value < 0);
      const isKeepSwipe =
        transformX.value > SWIPE_THRESHOLD ||
        (e.velocityX > SWIPE_VELOCITY_THRESHOLD && transformX.value > 0);

      if (isTrashSwipe) {
        finishSwipe("trash");
      } else if (isKeepSwipe) {
        finishSwipe("keep");
      } else {
        opacity.value = withSpring(1, SPRING_CONFIG);
        transformX.value = withSpring(0, SPRING_CONFIG);
        transformY.value = withSpring(0, SPRING_CONFIG);
        topCardDragX.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const stackRotation = index === 0 ? 0 : index % 2 ? 10 : -10;
    const dragRotation = index === 0 ? transformX.value / 20 : 0;

    let scale = 1;
    if (index > 0) {
      const dragProgress = Math.min(
        Math.abs(topCardDragX.value) / SWIPE_THRESHOLD,
        1
      );
      const baseScale = index === 1 ? 0.96 : 0.92;
      scale = baseScale + dragProgress * (1 - baseScale) * 0.5;
    }

    return {
      opacity: opacity.value,
      zIndex: -index,
      transform: [
        { translateX: transformX.value },
        { translateY: transformY.value },
        { scale },
        { rotate: `${stackRotation + dragRotation}deg` },
      ],
    };
  });

  const keepOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      transformX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  const deleteOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      transformX.value,
      [0, -SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="cover"
          cachePolicy="memory-disk"
          recyclingKey={uri}
          priority={index === 0 ? "high" : "normal"}
        />

        <Animated.View
          style={[styles.overlay, styles.keepOverlay, keepOverlayStyle]}
          pointerEvents="none"
        >
          <Text style={styles.overlayLabel}>{translations.keep}</Text>
        </Animated.View>

        <Animated.View
          style={[styles.overlay, styles.deleteOverlay, deleteOverlayStyle]}
          pointerEvents="none"
        >
          <Text style={styles.deleteOverlayLabel}>{translations.delete}</Text>
        </Animated.View>

        <BlurView style={styles.blurViewContainer} intensity={50}>
          <View style={styles.contentContainer}>
            <Text style={styles.hintText}>{translations.delete}</Text>
            <Text style={styles.keepText}>{translations.keep}</Text>
          </View>
        </BlurView>
      </Animated.View>
    </GestureDetector>
  );
};

export default CardItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 28,
    borderWidth: 12,
    borderColor: "white",
    backgroundColor: "white",
  },
  image: { width: "100%", height: "100%", borderRadius: 20 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  keepOverlay: {
    backgroundColor: GREEN,
  },
  deleteOverlay: {
    backgroundColor: DELETE_COLOR,
  },
  overlayLabel: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 32,
    color: "black",
    letterSpacing: 2,
  },
  deleteOverlayLabel: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 32,
    color: "white",
    letterSpacing: 2,
  },
  blurViewContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    padding: 16,
    zIndex: 2,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
  hintText: {
    fontFamily: "Thmanyah-Regular",
    fontSize: 14,
    color: "white",
  },
  keepText: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 18,
    color: "white",
  },
});
