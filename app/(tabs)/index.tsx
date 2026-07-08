import { Pressable, StyleSheet, Text, View } from "react-native";

import BadgeItem from "@/components/BadgeItem";
import AlbumFilter from "@/components/AlbumFilter";
import Cards from "@/components/Cards";
import Footer from "@/components/Footer";
import PermissionScreen from "@/components/PermissionScreen";
import SessionProgress from "@/components/SessionProgress";
import {
  BACKGROUND_TRANSLATE_Y,
  BADGE_HEIGHT,
  BADGE_WIDTH,
  BG_COLOR,
  INACTIVE_ROTATION,
  TEXT_COLOR,
} from "@/constants/constants";
import { useAppState } from "@/context/AppStateContext";
import { useAlbums } from "@/hooks/useAlbums";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";
import { StatPill } from "@/types/types";
import { Check, Images, Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  FadeInLeft,
  FadeInRight,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ICON_SIZE = 20;

export default function TabOneScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [photosRemaining, setPhotosRemaining] = useState(0);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [albumId, setAlbumId] = useState<string | null>(null);

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

  const stats: StatPill[] = useMemo(
    () => [
      {
        label: "photos-left",
        value: String(photosRemaining || reviewablePhotos.length || totalCount || 0),
        icon: <Images color="#000000" size={ICON_SIZE} />,
        color: "#bdf14d",
        textColor: "black",
      },
      {
        label: "kept",
        value: String(keptCount),
        icon: <Check color="#000000" size={ICON_SIZE} />,
        color: "black",
        textColor: "white",
      },
      {
        label: "trash",
        value: String(trashCount),
        icon: <Trash2 color="#000000" size={ICON_SIZE} />,
        color: "#f14de1ff",
        textColor: "white",
      },
    ],
    [photosRemaining, reviewablePhotos.length, totalCount, keptCount, trashCount]
  );

  const handlePress = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % stats.length);
  };

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

  const stylesReanimated = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        stats[activeIndex === 2 ? 0 : activeIndex + 1].color,
        { duration: 250 }
      ),
    };
  });

  const showPermissionScreen = !permission?.granted;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
        <Animated.View
          entering={FadeInRight.springify()}
          exiting={FadeInLeft.springify()}
          style={styles.header}
        >
          <Text style={styles.appTitle}>SwipeClean</Text>
          <Pressable onPress={handlePress} style={styles.badgeContainer}>
            <Animated.View style={[styles.placeholderBg, stylesReanimated]} />
            {stats.map((stat, index) => (
              <BadgeItem
                index={index}
                value={stat.value}
                activeIndex={activeIndex}
                key={stat.label}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </Pressable>
        </Animated.View>

        {!showPermissionScreen && (
          <SessionProgress
            reviewedCount={reviewedCount}
            totalCount={totalCount}
          />
        )}

        {!showPermissionScreen && filterOptions.length > 1 && (
          <AlbumFilter
            options={filterOptions}
            selectedAlbumId={selectedAlbumId}
            onSelect={setSelectedAlbumId}
          />
        )}

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

        {!showPermissionScreen && <Footer />}
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
    fontFamily: "Goldman-Bold",
    fontSize: 24,
    color: TEXT_COLOR,
  },
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  badgeContainer: {
    height: BADGE_HEIGHT,
    width: BADGE_WIDTH,
    position: "relative",
  },
  placeholderBg: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
    borderRadius: BADGE_HEIGHT / 2,
    position: "absolute",
    transformOrigin: "left",
    transform: [
      { rotateZ: INACTIVE_ROTATION },
      { translateY: BACKGROUND_TRANSLATE_Y },
    ],
  },
  cardsContainer: {
    width: "100%",
    flex: 1,
  },
});
