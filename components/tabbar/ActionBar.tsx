import { useAppState } from "@/context/AppStateContext";
import { useRouter } from "expo-router";
import { Share2, ThumbsUp, Trash2, Undo2, X } from "lucide-react-native";
import React from "react";
import { Share, StyleSheet, View } from "react-native";
import ActionButton from "./ActionButton";

type ActionBarProps = {
  onKeep: () => void;
  onDelete: () => void;
  currentPhotoUri: string | null;
};

const ActionBar = ({ onKeep, onDelete, currentPhotoUri }: ActionBarProps) => {
  const router = useRouter();
  const { undoLastAction, trashCount } = useAppState();

  const handleShare = async () => {
    if (!currentPhotoUri) return;

    try {
      await Share.share({
        message: "Check out this photo from Farz!",
        url: currentPhotoUri,
      });
    } catch (error) {
      console.error("Error sharing photo:", error);
    }
  };

  const handleUndo = () => {
    undoLastAction();
  };

  const handleTrashNavigation = () => {
    router.push("/(tabs)/trash");
  };

  return (
    <View style={styles.container}>
      {/* Trash button - leftmost */}
      <ActionButton
        icon={<Trash2 color="white" size={24} />}
        onPress={handleTrashNavigation}
        color="#8E8E93"
      />

      {/* Delete button - X */}
      <ActionButton
        icon={<X color="white" size={32} />}
        onPress={onDelete}
        color="#FF6B6B"
      />

      {/* Share button */}
      <ActionButton
        icon={<Share2 color="white" size={24} />}
        onPress={handleShare}
        color="#FF2D92"
      />

      {/* Like/Keep button */}
      <ActionButton
        icon={<ThumbsUp color="white" size={24} />}
        onPress={onKeep}
        color="#34C759"
      />

      {/* Undo button - rightmost */}
      <ActionButton
        icon={<Undo2 color="white" size={24} />}
        onPress={handleUndo}
        color="#8E8E93"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
  },
});

export default ActionBar;