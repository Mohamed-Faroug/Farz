import EmptyState from "@/components/EmptyState";
import {
  BG_COLOR,
  SPACING,
  TEXT_COLOR,
} from "@/constants/constants";
import { translations } from "@/constants/translations";
import { useAppState } from "@/context/AppStateContext";
import { GalleryPhoto } from "@/types/media";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowRight, Trash2, Undo2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const GRID_GAP = 8;
const GRID_COLUMNS = 3;
const TILE_SIZE =
  (width - SPACING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

export default function TrashScreen() {
  const router = useRouter();
  const { trashQueue, trashCount, undoTrash, deleteAllTrash } = useAppState();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = () => {
    Alert.alert(
      translations.deleteAllPhotos,
      `${trashCount} ${translations.photosWillBeRemoved}`,
      [
        { text: translations.cancel, style: "cancel" },
        {
          text: translations.deleteAll,
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            const result = await deleteAllTrash();
            setIsDeleting(false);

            if (!result.success) {
              Alert.alert(
                translations.deleteFailed,
                result.message ?? translations.somethingWentWrong
              );
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: GalleryPhoto }) => (
    <View style={styles.tileWrap}>
      <Image
        source={{ uri: item.uri }}
        style={styles.tileImage}
        contentFit="cover"
        cachePolicy="memory-disk"
        recyclingKey={item.id}
      />
      <Pressable
        style={styles.undoButton}
        onPress={() => undoTrash(item.id)}
        accessibilityLabel="Undo delete"
      >
        <Undo2 color="white" size={16} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowRight color={TEXT_COLOR} size={24} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>{translations.trashTitle}</Text>
          <Text style={styles.subtitle}>
            {trashCount} {translations.pendingInTrash}
          </Text>
        </View>
      </View>

      {trashCount === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon={Trash2}
            title={translations.trashEmpty}
            message={translations.trashEmptyMessage}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={trashQueue}
            keyExtractor={(item) => item.id}
            numColumns={GRID_COLUMNS}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
            renderItem={renderItem}
            removeClippedSubviews
            windowSize={5}
          />

          <View style={styles.footer}>
            <Pressable
              style={[styles.deleteButton, isDeleting && styles.buttonDisabled]}
              onPress={handleDeleteAll}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color={TEXT_COLOR} />
              ) : (
                <Text style={styles.deleteButtonText}>
                  {translations.deleteAll} ({trashCount})
                </Text>
              )}
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  header: {
    paddingHorizontal: SPACING,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 28,
    color: TEXT_COLOR,
    textAlign: "right",
  },
  subtitle: {
    fontFamily: "Thmanyah-Regular",
    fontSize: 15,
    color: "gray",
    textAlign: "right",
  },
  grid: {
    paddingHorizontal: SPACING,
    paddingBottom: 120,
    gap: GRID_GAP,
  },
  row: {
    gap: GRID_GAP,
  },
  tileWrap: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  undoButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 100,
    paddingHorizontal: SPACING,
  },
  deleteButton: {
    backgroundColor: "#f14de1",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  deleteButtonText: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 18,
    color: "white",
  },
  emptyWrap: {
    flex: 1,
  },
});
