# Search & Discovery

The `tidalApi` handles all external music exploration.

## 1. Implementing Search
Tidal v2 returns rich relational data. Always use the `mapTrack` helper to ensure the data is ready for the player.

```tsx
import { tidalApi } from '@shared/services/tidalApi';

const onSearch = async (text) => {
  const results = await tidalApi.search(text);
  
  // Transform results for your UI
  const tracks = results.data.tracks.map(t => tidalApi.mapTrack(t));
  setSearchResults(tracks);
};
```

## 2. Personalized Discovery
On the Home screen, you should display the user's generated mixes:

```tsx
const loadHome = async () => {
  const homeData = await tidalApi.getMixes();
  // Filter and display 'Daily Mix', 'New Arrivals', etc.
};
```

## 3. Starting a "Radio" Station
To implement a "Start Radio" button on a track:

```tsx
const startRadio = async (trackId) => {
  const recs = await tidalApi.getRecommendations(trackId);
  const radioQueue = recs.map(t => tidalApi.mapTrack(t));
  
  // Set the whole collection as the queue
  useAudioStore.getState().setQueue(radioQueue);
  useAudioStore.getState().playTrack(radioQueue[0]);
};
```

---

## Next Step
Go to [The Music Library](LIBRARY_GUIDE.md) to build user collections.
