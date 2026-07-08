import { GalleryPhoto } from "@/types/media";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";

const PAGE_SIZE = 50;
const GRANULAR_PERMISSIONS: MediaLibrary.GranularPermission[] = ["photo"];

type UseGalleryPhotosResult = {
  photos: GalleryPhoto[];
  totalCount: number;
  permission: MediaLibrary.PermissionResponse | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  requestPermission: () => Promise<MediaLibrary.PermissionResponse>;
  recheckPermission: () => Promise<MediaLibrary.PermissionResponse | null>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
};

export function useGalleryPhotos(
  albumId: string | null = null
): UseGalleryPhotosResult {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [permission, setPermission] =
    useState<MediaLibrary.PermissionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endCursor = useRef<string | undefined>(undefined);
  const hasNextPage = useRef(true);
  const isFetching = useRef(false);

  const mapAssets = (assets: MediaLibrary.Asset[]): GalleryPhoto[] =>
    assets.map((asset) => ({
      id: asset.id,
      uri: asset.uri,
    }));

  const fetchPage = useCallback(
    async (after?: string) => {
      if (isFetching.current) return;
      isFetching.current = true;

      const isInitialLoad = !after;
      if (isInitialLoad) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const result = await MediaLibrary.getAssetsAsync({
          first: PAGE_SIZE,
          after,
          album: albumId ?? undefined,
          mediaType: MediaLibrary.MediaType.photo,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });

        const mapped = mapAssets(result.assets);
        setPhotos((prev) => (after ? [...prev, ...mapped] : mapped));
        setTotalCount(result.totalCount);
        endCursor.current = result.endCursor;
        hasNextPage.current = result.hasNextPage;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load photos");
      } finally {
        isFetching.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [albumId]
  );

  const checkPermission = useCallback(async () => {
    try {
      const response = await MediaLibrary.getPermissionsAsync(
        false,
        GRANULAR_PERMISSIONS
      );
      setPermission(response);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to check permissions";
      setError(message);
      return null;
    }
  }, []);

  const recheckPermission = useCallback(async () => {
    return checkPermission();
  }, [checkPermission]);

  const requestPermission = useCallback(async () => {
    const response = await MediaLibrary.requestPermissionsAsync(
      false,
      GRANULAR_PERMISSIONS
    );
    setPermission(response);
    return response;
  }, []);

  const refresh = useCallback(async () => {
    endCursor.current = undefined;
    hasNextPage.current = true;
    setPhotos([]);
    await fetchPage();
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasNextPage.current || !endCursor.current) return;
    await fetchPage(endCursor.current);
  }, [fetchPage]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active") {
          recheckPermission();
        }
      }
    );

    return () => subscription.remove();
  }, [recheckPermission]);

  useEffect(() => {
    if (!permission?.granted) return;

    endCursor.current = undefined;
    hasNextPage.current = true;
    setPhotos([]);
    fetchPage();
  }, [permission?.granted, albumId, fetchPage]);

  return {
    photos,
    totalCount,
    permission,
    isLoading,
    isLoadingMore,
    error,
    requestPermission,
    recheckPermission,
    loadMore,
    refresh,
  };
}
