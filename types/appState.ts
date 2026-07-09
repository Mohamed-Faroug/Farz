import { GalleryPhoto } from "@/types/media";

export const APP_STATE_VERSION = 2;
export const APP_STATE_STORAGE_KEY = "@swipeclean/app-state-v2";
export const LEGACY_APP_STATE_STORAGE_KEY = "@swipeclean/app-state-v1";

export type PersistedAppState = {
  version: typeof APP_STATE_VERSION;
  keptPhotoIds: string[];
  trashQueue: GalleryPhoto[];
  deletedCount: number;
  freedBytesTotal: number;
  lastAction: { photo: GalleryPhoto; action: "keep" | "trash" } | null;
};

export const DEFAULT_APP_STATE: PersistedAppState = {
  version: APP_STATE_VERSION,
  keptPhotoIds: [],
  trashQueue: [],
  deletedCount: 0,
  freedBytesTotal: 0,
  lastAction: null,
};
