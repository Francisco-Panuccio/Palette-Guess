import { Injectable } from '@angular/core';
import { IMAGE_PATHS, PRIORITY_IMAGE_PATHS } from '../data/image-paths.data';

@Injectable({
  providedIn: 'root'
})
export class ImagePreloadService {
  private readonly loadedImages = new Set<string>();
  private readonly loadingImages = new Map<string, Promise<void>>();

  preloadPriority(): Promise<void> {
    return this.preloadMany(PRIORITY_IMAGE_PATHS, true);
  }

  preloadAll(): Promise<void> {
    return this.preloadPriority()
      .then(() => this.preloadMany(IMAGE_PATHS));
  }

  preloadMany(paths: readonly string[], priority: boolean = false): Promise<void> {
    return Promise.all(paths.map((path) => this.preload(path, priority))).then(() => undefined);
  }

  preload(path: string, priority: boolean = false): Promise<void> {
    if (this.loadedImages.has(path) || typeof Image === 'undefined') {
      return Promise.resolve();
    }

    const loadingImage = this.loadingImages.get(path);

    if (loadingImage) {
      return loadingImage;
    }

    const imagePromise = new Promise<void>((resolve) => {
      const image = new Image();
      image.decoding = 'async';

      if (priority) {
        image.fetchPriority = 'high';
      }

      const complete = () => {
        this.loadedImages.add(path);
        this.loadingImages.delete(path);
        resolve();
      };

      image.onload = complete;
      image.onerror = complete;

      window.setTimeout(complete, 5000);
      image.src = path;
    });

    this.loadingImages.set(path, imagePromise);

    return imagePromise;
  }
}
