# UI Integration Roadmap

Welcome! The core logic of SonarBuzz is fully implemented as a **headless backend** in `@packages/shared/src/services` and `@packages/shared/src/store`. Your job is to build the visual experience and link it to these pre-built services.

## 🏗 What is already done?
- **High-Res Audio**: 24-bit streaming and manifest parsing.
- **Persistence**: All library data and player sessions survive app restarts.
- **State Management**: Zustand stores for Player, Library, and Offline files.
- **Synced Lyrics**: Direct LRCLIB integration.
- **Social**: Automatic Last.fm scrobbling and auth.
- **Pro Logic**: Gapless pre-warming, Replay Gain, and Discovery.

## 🚀 Single Entry Point
All services, stores, and types are exported from the root of the `@shared` package. You can import everything you need in one line:

```typescript
import { 
  useAudioStore, 
  useLocalStore, 
  tidalApi, 
  lyricsService 
} from '@shared';
```

---

## 🛠 Your Integration Roadmap

### 1. [Bootstrapping & Setup](SETUP.md)
How to initialize the database and wrap your app in the necessary providers.

### 2. [Building the Player](PLAYER_GUIDE.md)
How to implement the play/pause logic, the "Time Left" slider, and the advanced queue.

### 3. [Search & Discovery](SEARCH_GUIDE.md)
How to fetch search results, map them to the UI, and start "Radio" sessions.

### 4. [The Music Library](LIBRARY_GUIDE.md)
Building the Favorites view, Playlist management, and Offline downloads.

### 5. [Native Mobile Tasks](NATIVE_MOBILE.md)
**Critical**: Bridging the headless engine to iOS/Android native modules.

---

## 📝 Remaining Task Checklist

### UI Tasks
- [ ] **Home Screen**: Display "Daily Mixes" and "Recently Played".
- [ ] **Search Screen**: Implement search bar with debounced results.
- [ ] **Player View**: Full-screen player with high-res artwork and synced lyrics.
- [ ] **Library**: Tabs for Playlists, Favorites, and Downloads.
- [ ] **Settings**: UI for Quality, Themes, and Last.fm login.

### Native Tasks (Bridges)
- [ ] **Audio Driver**: Link `audioEngine.ts` to `react-native-track-player`.
- [ ] **File System**: Link `offlineManager.ts` to `expo-file-system`.
- [ ] **Auth**: Implement `Linking.openURL` for the Last.fm OAuth flow.

---

## 📖 Related Docs
Refer to `docs/api/README.md` for technical API signatures.
