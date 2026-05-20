# Building the Player UI

The player UI is powered by `useAudioStore`. It is fully reactive and handles all the complex logic of queueing and stream resolution.

## 1. Playback Controls
Use these simple actions for your buttons:

```tsx
const { isPlaying, pause, resume, skipNext, skipPrevious } = useAudioStore();

<Button onPress={isPlaying ? pause : resume}>
  {isPlaying ? 'Pause' : 'Play'}
</Button>
```

## 2. The Progress Slider
This is the most important part of the UI. Use the reactive `progress` value (0.0 to 1.0) and the `currentTrack.duration` (seconds).

```tsx
const { progress, currentTrack, seek } = useAudioStore();

// UI Calculation
const elapsed = progress * (currentTrack?.duration || 0);
const remaining = (currentTrack?.duration || 0) - elapsed;

// When the user drags the slider:
<Slider 
  value={progress}
  onSlidingComplete={(val) => seek(val)} 
/>
```

## 3. Synced Lyrics
The `AudioEngine` is optimized for live lyrics. 

```tsx
import { lyricsService } from '@shared/services/lyrics';

const loadLyrics = async () => {
  if (currentTrack) {
    const data = await lyricsService.getLyrics(
      currentTrack.title, 
      currentTrack.artist,
      currentTrack.duration
    );
    // Parse data.syncedLyrics (LRC format) and sync with `progress`
  }
};
```

## 4. Play Next / Add to Queue
To implement "Add to Queue" menus:

```tsx
const handleAddToQueue = (track) => {
  // Option A: Play this track immediately after the current one
  useAudioStore.getState().playNext(track);
  
  // Option B: Appends to the very end
  useAudioStore.getState().addToQueue(track);
};
```

---

## Next Step
Go to [Search & Discovery](SEARCH_GUIDE.md) to add music searching.
