# Local Storage & Offline

User library data and offline files are managed via two persistent stores.

## 🔌 Import
```typescript
import { useLocalStore } from '@shared/services/database';
import { useOfflineStore } from '@shared/services/offlineManager';
```

---

## 📚 Local Library (`useLocalStore`)
Handles Favorites, Playlists, and History. Automatically persisted.

### State Properties
*   `favorites`: `string[]` - Array of favorited track IDs.
*   `savedAlbums`: `string[]` - Array of saved album IDs.
*   `playlists`: `Playlist[]` - Custom user playlists.
*   `listeningHistory`: `string[]` - IDs of the last 50 tracks played.
*   `settings`: Object containing `streamingQuality` and `downloadQuality`.

### Actions
*   `toggleFavorite(id)` / `isFavorite(id)`
*   `toggleSavedAlbum(id)` / `isAlbumSaved(id)`
*   `createPlaylist(name, description)`
*   `deletePlaylist(id)`
*   `addTrackToPlaylist(playlistId, trackId)`
*   `removeTrackFromPlaylist(playlistId, trackId)`
*   `addRecentSearch(query)`
*   `setQuality(type: 'streaming' | 'download', quality: AudioQuality)`

---

## 💾 Offline Manager (`useOfflineStore`)
Handles local file mapping and background downloading.

### State Properties
*   `downloadedTracks`: `Record<string, string>` - Map of `trackId` to local file URI.
*   `isDownloading`: `Record<string, boolean>` - Tracks currently being downloaded.

### Actions
*   `downloadTrack(trackId: string)`: Resolves stream URL and downloads file.
*   `removeDownload(trackId: string)`: Deletes file and removes from index.
*   `isDownloaded(trackId: string)`: Returns `boolean`.
*   `getLocalUri(trackId: string)`: Returns the `file://` URI if downloaded.

---

## 🛠 Platform Implementation Detail
The core is headless. UI developers must ensure the following are passed to the store on initialization for persistence to work on Native:

### Native (Mobile)
Ensure `@react-native-async-storage/async-storage` is used as the storage provider in `createJSONStorage` in `database.ts` and `offlineManager.ts`.

### Web
Uses `localStorage` by default (already implemented in the shim).
