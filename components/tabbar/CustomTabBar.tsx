import {
  GREEN,
  SPACING,
  TAB_ITEM_SIZE,
  TABBAR_WIDTH,
  TEXT_COLOR,
} from "@/constants/constants";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TabbarItem from "./TabbarItem";

type Props = { props: BottomTabBarProps };

const CustomTabBar = ({ props }: Props) => {
  const { state, descriptors, navigation } = props;

  const activeIndex = state.index;
  const numberOfTabs = state.routes.length;

  const availableWidth = TABBAR_WIDTH - 2 * SPACING;
  const totalItemsWidth = numberOfTabs * TAB_ITEM_SIZE;
  const totalGapWidth = availableWidth - totalItemsWidth;
  const spaceBetweenItems = totalGapWidth / (numberOfTabs - 1);

  const itemOffset = TAB_ITEM_SIZE + spaceBetweenItems;

  const translateX = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.activeBg, animatedStyles]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const { tabBarIcon, title } = options;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
            translateX.value = withSpring(index * itemOffset, {
              stiffness: 800,
              damping: 80,
            });
          }
        };

        return (
          <TabbarItem
            key={route.key}
            onPress={onPress}
            title={title}
            tabBarIcon={
              tabBarIcon &&
              tabBarIcon({
                focused: isFocused,
                size: 26,
                color: isFocused ? "black" : "gray",
              })
            }
            isFocused={isFocused}
          />
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: TABBAR_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 1.5 * SPACING,
    paddingHorizontal: SPACING,
    backgroundColor: "white",
    borderRadius: TABBAR_WIDTH / 2,
    shadowColor: TEXT_COLOR,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 5,
    height: TAB_ITEM_SIZE + SPACING,
  },
  activeBg: {
    position: "absolute",
    left: SPACING,
    top: SPACING / 2,
    width: TAB_ITEM_SIZE,
    height: TAB_ITEM_SIZE,
    borderRadius: TAB_ITEM_SIZE / 2,
    backgroundColor: GREEN,
  },
});
