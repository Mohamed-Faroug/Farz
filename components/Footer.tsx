import { GREEN, TEXT_COLOR } from "@/constants/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SessionSummary from "./SessionSummary";

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Session</Text>
      <View style={styles.row}>
        <SessionSummary />
        <View style={styles.tipBadge}>
          <Text style={styles.tipText}>Tip</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Swipe right to keep · Swipe left to delete
      </Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    gap: 10,
  },
  mainTitle: {
    fontFamily: "Goldman-Bold",
    color: TEXT_COLOR,
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  subtitle: {
    fontFamily: "Goldman-Regular",
    color: "gray",
    fontSize: 14,
  },
  tipBadge: {
    backgroundColor: GREEN,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  tipText: {
    fontFamily: "Goldman-Bold",
    color: TEXT_COLOR,
    fontSize: 14,
  },
});
