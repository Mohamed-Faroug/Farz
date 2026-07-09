import { StyleSheet, Text, View } from "react-native";

import Cards from "@/components/Cards";
import PermissionScreen from "@/components/PermissionScreen";
import SessionProgress from "@/components/SessionProgress";
import ActionBar from "@/components/tabbar/ActionBar";
import { BG_COLOR, TEXT_COLOR } from "@/constants/constants";
import { translations } from "@/constants/translations";
import { useAppState } from "@/context/AppStateContext";
import { useAlbums } from "@/hooks/useAlbums";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  FadeInLeft,
  FadeInRight
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ICON_SIZE = 20;

export default function TabOneScreen() {
  const [photosRemaining, setPhotosRemaining] = useState(0);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [currentPhotoUri, setCurrentPhotoUri] = useState<string | null>(null);

  const { keptCount, trashCount, excludedPhotoIds, keepPhoto, trashPhoto, reviewedCount } =
    useAppState();

  const {
    photos,
    totalCount,
    permission,
    isLoading,
    error,
    requestPermission,
    loadMore,
    refresh,
  } = useGalleryPhotos(albumId);

  const {
    filterOptions,
    selectedAlbumId,
    setSelectedAlbumId,
  } = useAlbums(permission?.granted ?? false);

  useEffect(() => {
    setAlbumId(selectedAlbumId);
  }, [selectedAlbumId]);

  const reviewablePhotos = useMemo(
    () => photos.filter((photo) => !excludedPhotoIds.has(photo.id)),
    [photos, excludedPhotoIds]
  );

  // Update current photo URI when photos change
  useEffect(() => {
    if (reviewablePhotos.length > 0 && !currentPhotoUri) {
      setCurrentPhotoUri(reviewablePhotos[0].uri);
    }
  }, [reviewablePhotos, currentPhotoUri]);

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    try {
      await requestPermission();
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handlePhotosRemainingChange = useCallback((count: number) => {
    setPhotosRemaining(count);
  }, []);

  const handleNearEnd = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const showPermissionScreen = !permission?.granted;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
        <Animated.View
          entering={FadeInRight.springify()}
          exiting={FadeInLeft.springify()}
          style={styles.header}
        >
          <Text style={styles.appTitle}>{translations.appName}</Text>
          {!showPermissionScreen && (
            <SessionProgress
              reviewedCount={reviewedCount}
              totalCount={totalCount}
            />
          )}
        </Animated.View>

        {/* {!showPermissionScreen && filterOptions.length > 1 && (
          <AlbumFilter
            options={filterOptions}
            selectedAlbumId={selectedAlbumId}
            onSelect={setSelectedAlbumId}
          />
        )} */}

        <View style={styles.cardsContainer}>
          {showPermissionScreen ? (
            <PermissionScreen
              onRequestPermission={handleRequestPermission}
              isLoading={isRequestingPermission || permission === null}
              isDenied={
                permission !== null &&
                !permission.granted &&
                !permission.canAskAgain
              }
            />
          ) : (
            <Cards
              photos={reviewablePhotos}
              isLoading={isLoading}
              error={error}
              onRetry={refresh}
              onPhotosRemainingChange={handlePhotosRemainingChange}
              onNearEnd={handleNearEnd}
              onKeep={keepPhoto}
              onTrash={trashPhoto}
            />
          )}
        </View>

        {/* Action Bar - always visible */}
        {!showPermissionScreen && (
          <ActionBar
            onKeep={() => reviewablePhotos.length > 0 && keepPhoto(reviewablePhotos[0])}
            onDelete={() => reviewablePhotos.length > 0 && trashPhoto(reviewablePhotos[0])}
            currentPhotoUri={currentPhotoUri}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 24,
    backgroundColor: BG_COLOR,
  },
  appTitle: {
    fontFamily: "Thmanyah-Bold",
    fontSize: 24,
    color: TEXT_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
    direction: "rtl",
  },
  cardsContainer: {
    width: "100%",
    flex: 1,
  },
});
