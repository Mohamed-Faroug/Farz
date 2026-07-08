import { TEXT_COLOR } from "@/constants/constants";
import { useAppState } from "@/context/AppStateContext";
import { formatBytes } from "@/utils/formatBytes";
import React from "react";
import { StyleSheet, Text } from "react-native";

const SessionSummary = () => {
  const { reviewedCount, deletedCount, freedBytesTotal } = useAppState();

  return (
    <Text style={styles.summary}>
      {reviewedCount} reviewed · {deletedCount} deleted ·{" "}
      {formatBytes(freedBytesTotal)} freed
    </Text>
  );
};

export default SessionSummary;

const styles = StyleSheet.create({
  summary: {
    fontFamily: "Goldman-Bold",
    fontSize: 15,
    color: TEXT_COLOR,
    flex: 1,
  },
});
