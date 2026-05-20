# Lyrics & Advanced Metadata

SonarBuzz uses external community-driven APIs to enrich the Tidal experience.

## 🔌 Import
```typescript
import { lyricsService } from '@shared/services/lyrics';
import { metadataService } from '@shared/services/metadataService';
```

---

## 🎤 Synced Lyrics (`lyricsService`)
Uses **LRCLIB** to fetch synced lyrics in `.lrc` format.

### Actions
*   `getLyrics(title, artist, album?, duration?)`: Returns a `SyncedLyrics` object.

### The `SyncedLyrics` Interface
```typescript
interface SyncedLyrics {
  plainLyrics: string;  // Plain text
  syncedLyrics: string; // [00:12.34] Timestamped text
  instrumental: boolean;
}
```

### 💡 Integration Tip
To display live lyrics, split the `syncedLyrics` string by line and use a regex to extract the `[mm:ss.xx]` timestamp. Compare this timestamp with `useAudioStore.progress * currentTrack.duration`.

---

## 🔍 Advanced Metadata (`metadataService`)
Uses **MusicBrainz Picard** to fetch enriched recording details using the track's **ISRC** (provided by Tidal).

### Actions
*   `getAdvancedMetadata(isrc: string)`

### Returns
*   `mbid`: MusicBrainz Recording ID.
*   `firstReleaseDate`: The actual original recording/release date.
*   `releases`: Array of labels and release titles this track appeared on.
*   `tags`: High-fidelity genre tags and descriptors.

### Example
```typescript
const { currentTrack } = useAudioStore.getState();
if (currentTrack?.isrc) {
  const meta = await metadataService.getAdvancedMetadata(currentTrack.isrc);
  console.log('Original Label:', meta.releases[0].label);
}
```
