import AsyncStorage from "@react-native-async-storage/async-storage";

const SELECTED_ALBUM_KEY = "@swipeclean/selected-album";

export async function loadSelectedAlbumId(): Promise<string | null> {
  const value = await AsyncStorage.getItem(SELECTED_ALBUM_KEY);
  if (value === null || value === "null") return null;
  return value;
}

export async function saveSelectedAlbumId(albumId: string | null): Promise<void> {
  await AsyncStorage.setItem(
    SELECTED_ALBUM_KEY,
    albumId === null ? "null" : albumId
  );
}
