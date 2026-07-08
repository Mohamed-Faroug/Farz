import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  APP_STATE_STORAGE_KEY,
  APP_STATE_VERSION,
  DEFAULT_APP_STATE,
  LEGACY_APP_STATE_STORAGE_KEY,
  PersistedAppState,
} from "@/types/appState";
import { GalleryPhoto } from "@/types/media";

type LegacyPersistedAppState = {
  version?: number;
  keptPhotoIds?: string[];
  trashQueue?: GalleryPhoto[];
  deletedCount?: number;
  freedBytesTotal?: number;
};

function migrateState(raw: LegacyPersistedAppState): PersistedAppState {
  return {
    version: APP_STATE_VERSION,
    keptPhotoIds: Array.isArray(raw.keptPhotoIds) ? raw.keptPhotoIds : [],
    trashQueue: Array.isArray(raw.trashQueue) ? raw.trashQueue : [],
    deletedCount:
      typeof raw.deletedCount === "number" ? raw.deletedCount : 0,
    freedBytesTotal:
      typeof raw.freedBytesTotal === "number" ? raw.freedBytesTotal : 0,
  };
}

function isPersistedAppState(value: unknown): value is PersistedAppState {
  if (!value || typeof value !== "object") return false;

  const state = value as PersistedAppState;
  return (
    state.version === APP_STATE_VERSION &&
    Array.isArray(state.keptPhotoIds) &&
    Array.isArray(state.trashQueue) &&
    typeof state.deletedCount === "number" &&
    typeof state.freedBytesTotal === "number"
  );
}

async function readRawState(key: string): Promise<unknown | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  return JSON.parse(raw) as unknown;
}

export async function loadAppState(): Promise<PersistedAppState> {
  try {
    const current = await readRawState(APP_STATE_STORAGE_KEY);
    if (current && isPersistedAppState(current)) {
      return current;
    }

    if (current && typeof current === "object") {
      return migrateState(current as LegacyPersistedAppState);
    }

    const legacy = await readRawState(LEGACY_APP_STATE_STORAGE_KEY);
    if (legacy && typeof legacy === "object") {
      const migrated = migrateState(legacy as LegacyPersistedAppState);
      await saveAppState(migrated);
      return migrated;
    }

    return DEFAULT_APP_STATE;
  } catch {
    return DEFAULT_APP_STATE;
  }
}

export async function saveAppState(state: PersistedAppState): Promise<void> {
  const payload: PersistedAppState = {
    ...state,
    version: APP_STATE_VERSION,
  };
  await AsyncStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(payload));
}

export async function clearAppState(): Promise<void> {
  await AsyncStorage.removeItem(APP_STATE_STORAGE_KEY);
  await AsyncStorage.removeItem(LEGACY_APP_STATE_STORAGE_KEY);
}
