# Native Mobile Implementation

Because the core is **headless**, you must bridge the service layer to native modules for the best mobile experience.

## 1. Background Audio (CRITICAL)
By default, the `AudioEngine.ts` uses a web-based `Audio` object. For iOS/Android, you **must** replace the native placeholder in `audioEngine.ts` with a professional library.

**Recommended: `react-native-track-player`**

1.  Install the library.
2.  In `audioEngine.ts`, update the `else` block:

```typescript
// packages/shared/src/services/audioEngine.ts
} else {
  // REPLACE THE PLACEHOLDER:
  await TrackPlayer.add({
    id: trackId,
    url: url, // Our resolved Tidal/Local URL
    title: track.title,
    artist: track.artist,
  });
  await TrackPlayer.play();
}
```

## 2. File System (Offline Mode)
The `offlineManager.ts` includes placeholders for downloading tracks to disk.

**Recommended: `expo-file-system`**

1.  Install `expo-file-system`.
2.  In `offlineManager.ts`, uncomment and complete the `FileSystem.downloadAsync` block. This ensures tracks are saved to the app's document directory and aren't visible to the user in their phone's gallery/files app.

## 3. Storage Persistence
Ensure you swap the `storageShim` in `database.ts` with `@react-native-async-storage/async-storage` as described in the [Setup Guide](SETUP.md).

## 4. Last.fm Login
The `lastfmService.getAuthUrl()` returns a URL. Use Expo's `WebBrowser` or `Linking` to open this on mobile:

```tsx
import * as WebBrowser from 'expo-web-browser';

const openLastFMLogin = async (url) => {
  await WebBrowser.openBrowserAsync(url);
};
```
