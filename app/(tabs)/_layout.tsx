import CustomTabBar from "@/components/tabbar/CustomTabBar";
import { Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { BarChart3, Trash2 } from "lucide-react-native";
import React from "react";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <CustomTabBar props={props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Swipe",
          tabBarIcon: ({ color, focused }) =>
            !focused ? (
              <Octicons name="home" size={24} color={color} />
            ) : (
              <Octicons name="home-fill" size={24} color="black" />
            ),
        }}
      />
      <Tabs.Screen
        name="trash"
        options={{
          title: "Trash",
          tabBarIcon: ({ color, focused }) => (
            <Trash2
              color={color}
              size={26}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <BarChart3
              size={26}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
