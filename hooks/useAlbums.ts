import {
  loadSelectedAlbumId,
  saveSelectedAlbumId,
} from "@/storage/albumStorage";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useMemo, useState } from "react";

export type AlbumOption = {
  id: string | null;
  title: string;
};

const ALL_PHOTOS: AlbumOption = { id: null, title: "All" };

const PREFERRED_ALBUM_TITLES = ["Camera", "Screenshots"];

function findAlbumByTitle(
  albums: MediaLibrary.Album[],
  title: string
): MediaLibrary.Album | undefined {
  const normalized = title.toLowerCase();
  return albums.find((album) => album.title.toLowerCase().includes(normalized));
}

function buildFilterOptions(albums: MediaLibrary.Album[]): AlbumOption[] {
  const options: AlbumOption[] = [ALL_PHOTOS];
  const usedIds = new Set<string>();

  for (const title of PREFERRED_ALBUM_TITLES) {
    const match = findAlbumByTitle(albums, title);
    if (match && !usedIds.has(match.id)) {
      options.push({ id: match.id, title: match.title });
      usedIds.add(match.id);
    }
  }

  if (options.length === 1) {
    for (const album of albums.slice(0, 5)) {
      if (!usedIds.has(album.id)) {
        options.push({ id: album.id, title: album.title });
        usedIds.add(album.id);
      }
    }
  }

  return options;
}

type UseAlbumsResult = {
  filterOptions: AlbumOption[];
  selectedAlbumId: string | null;
  setSelectedAlbumId: (albumId: string | null) => void;
  isLoading: boolean;
};

export function useAlbums(enabled: boolean): UseAlbumsResult {
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumIdState] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function loadAlbums() {
      setIsLoading(true);
      try {
        const [result, savedAlbumId] = await Promise.all([
          MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true }),
          loadSelectedAlbumId(),
        ]);

        if (cancelled) return;

        setAlbums(result);
        if (
          savedAlbumId === null ||
          result.some((album) => album.id === savedAlbumId)
        ) {
          setSelectedAlbumIdState(savedAlbumId);
        }
      } catch {
        if (!cancelled) {
          setAlbums([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAlbums();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const setSelectedAlbumId = useCallback((albumId: string | null) => {
    setSelectedAlbumIdState(albumId);
    saveSelectedAlbumId(albumId);
  }, []);

  const filterOptions = useMemo(
    () => buildFilterOptions(albums),
    [albums]
  );

  return {
    filterOptions,
    selectedAlbumId,
    setSelectedAlbumId,
    isLoading,
  };
}
