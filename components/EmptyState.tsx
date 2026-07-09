import { GREEN, TEXT_COLOR } from "@/constants/constants";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

const EmptyState = ({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon color={TEXT_COLOR} size={40} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.actionButton}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 22,
    color: TEXT_COLOR,
    textAlign: "center",
  },
  message: {
    fontFamily: "Thmanyah-Regular",
    fontSize: 15,
    color: "gray",
    textAlign: "center",
    lineHeight: 22,
  },
  actionButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "black",
  },
  actionText: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 14,
    color: GREEN,
  },
});
