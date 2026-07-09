import { TEXT_COLOR } from "@/constants/constants";
import { translations } from "@/constants/translations";
import { useAppState } from "@/context/AppStateContext";
import { formatBytes } from "@/utils/formatBytes";
import React from "react";
import { StyleSheet, Text } from "react-native";

const SessionSummary = () => {
  const { reviewedCount, deletedCount, freedBytesTotal } = useAppState();

  return (
    <Text style={styles.summary}>
      {translations.sessionSummary
        .replace("{reviewed}", String(reviewedCount))
        .replace("{deleted}", String(deletedCount))
        .replace("{freed}", formatBytes(freedBytesTotal))}
    </Text>
  );
};

export default SessionSummary;

const styles = StyleSheet.create({
  summary: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 15,
    color: TEXT_COLOR,
    flex: 1,
    textAlign: "right",
  },
});
