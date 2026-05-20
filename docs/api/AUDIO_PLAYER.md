# Audio Player & Playback

The playback system is a hybrid of a **Zustand Store** (for state) and the **Audio Engine** (for the platform-specific audio driver).

## 🔌 Import
```typescript
import { useAudioStore } from '@shared/store/audioContext';
```

## 📊 State Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `isPlaying` | `boolean` | Reactive playback status. |
| `currentTrack` | `Track \| null` | The currently loaded track. |
| `progress` | `number` | Current position as a decimal (**0.0 to 1.0**). |
| `queue` | `Track[]` | Current list of upcoming tracks. |
| `repeatMode` | `'OFF' \| 'ALL' \| 'ONE'` | Controls queue/track looping. |
| `isShuffle` | `boolean` | If the queue order is randomized. |
| `sleepTimerEnd` | `number \| null` | Expiry timestamp (ms) for the sleep timer. |

### The `Track` Interface
```typescript
interface Track {
  id: string;
  title: string;
  artist: string;
  artworkUrl?: string;
  duration: number; // Length in seconds
  replayGain?: { gain: number; peak: number };
}
```

## 🎮 Actions

### Basic Controls
*   `playTrack(track: Track)`: Starts playback of a new track immediately.
*   `pause()`: Pauses the audio.
*   `resume()`: Resumes the current track (restores session on app start).

### Queue Navigation
*   `skipNext()`: Moves to the next item. Respects `repeatMode`.
*   `skipPrevious()`: If progress > 5%, restarts current track. Otherwise, goes to previous track.

### Queue Management
*   `playNext(track: Track)`: Inserts track immediately after the current one.
*   `addToQueue(track: Track)`: Appends track to the bottom of the list.
*   `setQueue(tracks: Track[])`: Replaces the entire queue.

### Utilities
*   `toggleShuffle()`: Randomizes the queue. Calling it again restores the `originalQueue` order.
*   `setRepeatMode(mode)`: Cycles loop behavior.
*   `setSleepTimer(minutes: number)`: Automatically pauses music after X minutes.

## 💡 Pro Tip: Custom Time Slider
Since `progress` is 0.0 to 1.0 and `duration` is in seconds, your slider should be implemented like this:

```tsx
const { progress, currentTrack } = useAudioStore();

const currentTime = progress * (currentTrack?.duration || 0);
const timeLeft = (currentTrack?.duration || 0) - currentTime;

// To format as MM:SS
const formatTime = (secs) => new Date(secs * 1000).toISOString().substr(14, 5);
```
