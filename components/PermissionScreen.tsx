import { BG_COLOR, GREEN, TEXT_COLOR } from "@/constants/constants";
import { translations } from "@/constants/translations";
import { Images } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onRequestPermission: () => void;
  isLoading?: boolean;
  isDenied?: boolean;
};

const PermissionScreen = ({
  onRequestPermission,
  isLoading = false,
  isDenied = false,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Images color={TEXT_COLOR} size={48} />
      </View>
      <Text style={styles.title}>{translations.accessYourGallery}</Text>
      <Text style={styles.subtitle}>
        {translations.permissionSubtitle}
      </Text>
      {isDenied && (
        <Text style={styles.deniedText}>
          {translations.permissionDenied}
        </Text>
      )}
      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={onRequestPermission}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={TEXT_COLOR} />
        ) : (
          <Text style={styles.buttonText}>
            {isDenied ? translations.tryAgain : translations.allowAccess}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default PermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
    backgroundColor: BG_COLOR,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 24,
    color: TEXT_COLOR,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Thmanyah-Regular",
    fontSize: 15,
    color: "gray",
    textAlign: "center",
    lineHeight: 22,
  },
  deniedText: {
    fontFamily: "Thmanyah-Regular",
    fontSize: 14,
    color: "#f14de1",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    backgroundColor: GREEN,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
    minWidth: 180,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 16,
    color: TEXT_COLOR,
  },
});
