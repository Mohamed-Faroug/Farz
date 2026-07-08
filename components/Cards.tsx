import EmptyState from "@/components/EmptyState";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  MAX_VISIBLE_STACK,
  PREFETCH_AHEAD_COUNT,
  SPACING,
  TEXT_COLOR,
} from "@/constants/constants";
import { GalleryPhoto, SwipeAction } from "@/types/media";
import { prefetchPhotoUris } from "@/utils/imagePrefetch";
import { ImageIcon, PartyPopper, RefreshCw } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import CardItem from "./CardItem";

const LOAD_MORE_THRESHOLD = 10;

type Props = {
  photos: GalleryPhoto[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onPhotosRemainingChange?: (count: number) => void;
  onNearEnd?: () => void;
  onKeep?: (photo: GalleryPhoto) => void;
  onTrash?: (photo: GalleryPhoto) => void;
};

const Cards = ({
  photos,
  isLoading = false,
  error = null,
  onRetry,
  onPhotosRemainingChange,
  onNearEnd,
  onKeep,
  onTrash,
}: Props) => {
  const [cards, setCards] = useState<GalleryPhoto[]>([]);
  const topCardDragX = useSharedValue(0);

  const visibleCards = useMemo(
    () => cards.slice(0, MAX_VISIBLE_STACK),
    [cards]
  );

  useEffect(() => {
    if (photos.length === 0) {
      setCards([]);
      return;
    }

    setCards((prev) => {
      const photoIds = new Set(photos.map((photo) => photo.id));
      const filteredPrev = prev.filter((photo) => photoIds.has(photo.id));

      if (filteredPrev.length === 0) return photos;

      const existingIds = new Set(filteredPrev.map((photo) => photo.id));
      const newPhotos = photos.filter((photo) => !existingIds.has(photo.id));
      return newPhotos.length > 0 ? [...filteredPrev, ...newPhotos] : filteredPrev;
    });
  }, [photos]);

  useEffect(() => {
    if (onPhotosRemainingChange) {
      // Use requestAnimationFrame to defer the callback and avoid
      // state updates during the render phase
      const timeoutId = setTimeout(() => {
        onPhotosRemainingChange(cards.length);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
    
    if (cards.length > 0 && cards.length <= LOAD_MORE_THRESHOLD) {
      onNearEnd?.();
    }
  }, [cards.length, onPhotosRemainingChange, onNearEnd]);

  useEffect(() => {
    prefetchPhotoUris(cards, PREFETCH_AHEAD_COUNT, 1);
  }, [cards]);

  const handleSwipe = useCallback(
    (action: SwipeAction) => {
      setCards((prev) => {
        const [first, ...rest] = prev;
        if (!first) return prev;

        // Defer the callback to avoid state updates during render
        if (action === "keep") {
          setTimeout(() => onKeep?.(first), 0);
        } else {
          setTimeout(() => onTrash?.(first), 0);
        }

        return rest;
      });
    },
    [onKeep, onTrash]
  );

  if (isLoading && cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Review Photos</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={TEXT_COLOR} />
          <Text style={styles.loadingText}>Loading your gallery...</Text>
        </View>
      </View>
    );
  }

  if (error && cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Review Photos</Text>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon={RefreshCw}
            title="Couldn't load photos"
            message={error}
            actionLabel="Try again"
            onAction={onRetry}
          />
        </View>
      </View>
    );
  }

  if (!isLoading && cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Review Photos</Text>
        <View style={styles.emptyContainer}>
          {photos.length > 0 ? (
            <EmptyState
              icon={PartyPopper}
              title="Gallery clean!"
              message="You've reviewed every photo in your queue. Great work!"
            />
          ) : (
            <EmptyState
              icon={ImageIcon}
              title="No photos found"
              message="Your gallery appears empty or photos could not be loaded."
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Photos</Text>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          paddingHorizontal: SPACING,
        }}
      >
        <View
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            position: "relative",
          }}
        >
          {visibleCards.map((photo, index) => {
            return (
              <CardItem
                key={photo.id}
                index={index}
                uri={photo.uri}
                topCardDragX={topCardDragX}
                onSwipe={handleSwipe}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Cards;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    paddingHorizontal: SPACING,
  },
  title: {
    fontFamily: "Goldman-Bold",
    fontSize: 24,
    color: TEXT_COLOR,
    alignSelf: "flex-start",
  },
  loadingContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  loadingText: {
    fontFamily: "Goldman-Regular",
    fontSize: 15,
    color: "gray",
  },
});
