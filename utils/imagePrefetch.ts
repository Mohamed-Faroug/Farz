import { GalleryPhoto } from "@/types/media";
import { Image } from "expo-image";

export function prefetchPhotoUris(
  photos: GalleryPhoto[],
  count = 3,
  skip = 0
): void {
  photos.slice(skip, skip + count).forEach((photo) => {
    Image.prefetch(photo.uri).catch(() => {});
  });
}
