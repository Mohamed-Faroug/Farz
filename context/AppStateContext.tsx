import { loadAppState, saveAppState } from "@/storage/appStateStorage";
import {
  DEFAULT_APP_STATE,
  PersistedAppState,
} from "@/types/appState";
import { GalleryPhoto } from "@/types/media";
import * as MediaLibrary from "expo-media-library";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AppStateContextValue = {
  isHydrated: boolean;
  keptPhotoIds: string[];
  trashQueue: GalleryPhoto[];
  deletedCount: number;
  freedBytesTotal: number;
  keptCount: number;
  trashCount: number;
  reviewedCount: number;
  pendingTrashBytes: number;
  excludedPhotoIds: Set<string>;
  lastAction: { photo: GalleryPhoto; action: "keep" | "trash" } | null;
  keepPhoto: (photo: GalleryPhoto) => void;
  trashPhoto: (photo: GalleryPhoto) => void;
  undoTrash: (photoId: string) => void;
  undoLastAction: () => void;
  deleteAllTrash: () => Promise<{ success: boolean; message?: string }>;
  resetSession: () => Promise<void>;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function sumTrashBytes(trashQueue: GalleryPhoto[]): number {
  return trashQueue.reduce((total, photo) => total + (photo.fileSize ?? 0), 0);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedAppState>(DEFAULT_APP_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    loadAppState().then((loaded) => {
      setState(loaded);
      setIsHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveAppState(state);
  }, [state, isHydrated]);

  const updateState = useCallback(
    (updater: (prev: PersistedAppState) => PersistedAppState) => {
      setState((prev) => updater(prev));
    },
    []
  );

  const keepPhoto = useCallback(
    (photo: GalleryPhoto) => {
      updateState((prev) => {
        if (prev.keptPhotoIds.includes(photo.id)) return prev;
        return {
          ...prev,
          keptPhotoIds: [...prev.keptPhotoIds, photo.id],
          lastAction: { photo, action: "keep" },
        };
      });
    },
    [updateState]
  );

  const trashPhoto = useCallback(
    (photo: GalleryPhoto) => {
      updateState((prev) => {
        if (prev.trashQueue.some((item) => item.id === photo.id)) return prev;
        return {
          ...prev,
          trashQueue: [...prev.trashQueue, photo],
          lastAction: { photo, action: "trash" },
        };
      });
    },
    [updateState]
  );

  const undoTrash = useCallback(
    (photoId: string) => {
      updateState((prev) => ({
        ...prev,
        trashQueue: prev.trashQueue.filter((photo) => photo.id !== photoId),
      }));
    },
    [updateState]
  );

  const undoLastAction = useCallback(() => {
    updateState((prev) => {
      if (!prev.lastAction) return prev;

      const { photo, action } = prev.lastAction;

      if (action === "keep") {
        // Undo keep: remove from keptPhotoIds
        return {
          ...prev,
          keptPhotoIds: prev.keptPhotoIds.filter((id) => id !== photo.id),
          lastAction: null,
        };
      } else if (action === "trash") {
        // Undo trash: remove from trashQueue
        return {
          ...prev,
          trashQueue: prev.trashQueue.filter((p) => p.id !== photo.id),
          lastAction: null,
        };
      }

      return prev;
    });
  }, [updateState]);

  const deleteAllTrash = useCallback(async () => {
    if (state.trashQueue.length === 0) {
      return { success: true };
    }

    const ids = state.trashQueue.map((photo) => photo.id);
    const bytesFreed = sumTrashBytes(state.trashQueue);

    try {
      // Check if we have write permissions before attempting deletion
      const permissionResponse = await MediaLibrary.getPermissionsAsync();
      
      if (!permissionResponse.granted) {
        // Request permissions if not granted
        const requestResponse = await MediaLibrary.requestPermissionsAsync();
        
        if (!requestResponse.granted) {
          return {
            success: false,
            message: "Permission denied. Please grant gallery permissions to delete photos.",
          };
        }
      }

      const deleted = await MediaLibrary.deleteAssetsAsync(ids);
      if (!deleted) {
        return {
          success: false,
          message: "Could not delete photos. Please try again.",
        };
      }

      updateState((prev) => ({
        ...prev,
        trashQueue: [],
        deletedCount: prev.deletedCount + ids.length,
        freedBytesTotal: prev.freedBytesTotal + bytesFreed,
      }));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete photos",
      };
    }
  }, [state, updateState]);

  const resetSession = useCallback(async () => {
    setState(DEFAULT_APP_STATE);
  }, []);

  const excludedPhotoIds = useMemo(() => {
    const ids = new Set<string>();
    state.keptPhotoIds.forEach((id) => ids.add(id));
    state.trashQueue.forEach((photo) => ids.add(photo.id));
    return ids;
  }, [state.keptPhotoIds, state.trashQueue]);

  const keptCount = state.keptPhotoIds.length;
  const trashCount = state.trashQueue.length;
  const reviewedCount = keptCount + trashCount + state.deletedCount;
  const pendingTrashBytes = sumTrashBytes(state.trashQueue);

  const value = useMemo<AppStateContextValue>(
    () => ({
      isHydrated,
      keptPhotoIds: state.keptPhotoIds,
      trashQueue: state.trashQueue,
      deletedCount: state.deletedCount,
      freedBytesTotal: state.freedBytesTotal,
      keptCount,
      trashCount,
      reviewedCount,
      pendingTrashBytes,
      excludedPhotoIds,
      lastAction: state.lastAction,
      keepPhoto,
      trashPhoto,
      undoTrash,
      undoLastAction,
      deleteAllTrash,
      resetSession,
    }),
    [
      isHydrated,
      state,
      keptCount,
      trashCount,
      reviewedCount,
      pendingTrashBytes,
      excludedPhotoIds,
      state.lastAction,
      keepPhoto,
      trashPhoto,
      undoTrash,
      undoLastAction,
      deleteAllTrash,
      resetSession,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}
