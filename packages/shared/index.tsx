// --- SERVICES ---
export { audioEngine } from './src/services/audioEngine';
export { tidalApi } from './src/services/tidalApi';
export { initDb, useLocalStore } from './src/services/database';
export { useOfflineStore } from './src/services/offlineManager';
export { lyricsService } from './src/services/lyrics';
export { metadataService } from './src/services/metadataService';
export { lastfmService } from './src/services/lastfm';

// --- STORES & CONTEXT ---
export { useAudioStore } from './src/store/audioContext';
export { useLocalContext } from './src/store/localContext';

// --- TYPES ---
export type { Track, RepeatMode, AudioStore } from './src/store/audioContext';
export type { TidalTrack, AudioQuality } from './src/services/tidalApi';
export type { SyncedLyrics } from './src/services/lyrics';
export type { Playlist, LocalData } from './src/services/database';

// --- UI PLACEHOLDER ---
// The UI developer will replace this with the actual App Navigator
import React from 'react';
export const AppNavigator = () => <></>;
export default AppNavigator;
