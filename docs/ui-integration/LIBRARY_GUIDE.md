# The Music Library

User data is managed through `useLocalStore` (Library) and `useOfflineStore` (Downloads).

## 1. Favorites & Saved Albums
These are simple toggles that persist automatically.

```tsx
const isFavorite = useLocalStore((s) => s.isFavorite(trackId));
const toggle = () => useLocalStore.getState().toggleFavorite(trackId);
```

## 2. Playlists
To create a new playlist and add a song:

```tsx
const { createPlaylist, addTrackToPlaylist } = useLocalStore.getState();

const handleNewPlaylist = () => {
  createPlaylist("My Chill Mix", "A collection for relaxing.");
};

const handleAddToPlaylist = (playlistId, trackId) => {
  addTrackToPlaylist(playlistId, trackId);
};
```

## 3. Offline Music (Downloads)
This is a critical "premium" feature. You should show a progress spinner if a track is downloading.

```tsx
import { useOfflineStore } from '@shared/services/offlineManager';

const { downloadTrack, isDownloaded, isDownloading } = useOfflineStore();

// In your TrackItem component:
const isTrackOffline = isDownloaded(trackId);
const isPending = isDownloading[trackId];

<DownloadButton 
  status={isTrackOffline ? 'success' : isPending ? 'loading' : 'idle'}
  onPress={() => downloadTrack(trackId)} 
/>
```

**Note**: The `AudioEngine` will automatically pick up these files. You don't need to change any playback code for offline mode to work!

---

## Next Step
Go to [Native Mobile Tasks](NATIVE_MOBILE.md) for platform implementation.
