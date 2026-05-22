import React, { useEffect, useState } from "react";
import { initDb, tidalApi, useAudioStore, useLocalStore, lyricsService, lastfmService } from "shared";
import "./App.css";

// Bypass CORS by hijacking fetch to route to the Vite Proxy during development,
// or via Rust Tauri invoke calls in desktop/production builds.
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  
  const isTauri = typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__;
  
  // Resolve relative/proxy paths first to absolute domains
  let targetUrl = url;
  const origin = window.location.origin;
  if (targetUrl.startsWith(origin)) {
    targetUrl = targetUrl.substring(origin.length);
  }
  
  if (targetUrl.startsWith('/tidal-auth')) {
    targetUrl = targetUrl.replace(/^\/tidal-auth/, 'https://auth.tidal.com');
  } else if (targetUrl.startsWith('/tidal-api')) {
    targetUrl = targetUrl.replace(/^\/tidal-api/, 'https://api.tidal.com');
  } else if (targetUrl.startsWith('/tidal-openapi')) {
    targetUrl = targetUrl.replace(/^\/tidal-openapi/, 'https://openapi.tidal.com');
  } else if (targetUrl.startsWith('/')) {
    targetUrl = origin + targetUrl;
  }

  // Only route known external APIs through the Rust proxy to avoid intercepting 
  // massive local resources (like compiled scripts/HMR) which can cause RangeError.
  const isExternalApi = 
    targetUrl.includes('tidal.com') ||
    targetUrl.includes('githubusercontent.com') ||
    targetUrl.includes('lrclib.net') ||
    targetUrl.includes('audioscrobbler.com') ||
    targetUrl.includes('musicbrainz.org');

  if (isTauri && isExternalApi) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      
      const headersRecord: Record<string, string> = {};
      if (init?.headers) {
        const headers = new Headers(init.headers);
        headers.forEach((value, key) => {
          headersRecord[key] = value;
        });
      }

      let bodyStr: string | null = null;
      if (init?.body) {
        if (typeof init.body === 'string') {
          bodyStr = init.body;
        } else if (init.body instanceof URLSearchParams) {
          bodyStr = init.body.toString();
        } else {
          bodyStr = String(init.body);
        }
      }
      
      const res = await invoke<{ status: number; body: string }>('http_request', {
        url: targetUrl,
        method: init?.method || 'GET',
        headers: headersRecord,
        body: bodyStr,
      });

      return {
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        statusText: '',
        headers: new Headers(),
        text: async () => res.body,
        json: async () => JSON.parse(res.body),
      } as Response;
    } catch (err) {
      console.error("Tauri HTTP invoke error, falling back to original fetch:", err);
    }
  }

  // Standard development web browser proxy mapping
  if (url.startsWith('https://auth.tidal.com')) {
    url = url.replace('https://auth.tidal.com', '/tidal-auth');
  } else if (url.startsWith('https://api.tidal.com')) {
    url = url.replace('https://api.tidal.com', '/tidal-api');
  } else if (url.startsWith('https://openapi.tidal.com')) {
    url = url.replace('https://openapi.tidal.com', '/tidal-openapi');
  }
  
  return originalFetch(url, init);
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [lyrics, setLyrics] = useState<any>(null);
  const [lfmToken, setLfmToken] = useState("");
  const [lfmAuthUrl, setLfmAuthUrl] = useState("");

  const { favorites, settings, toggleFavorite } = useLocalStore();

  const {
    isPlaying,
    pause,
    resume,
    skipNext,
    skipPrevious,
    progress,
    currentTrack,
    playTrack,
    playNext
  } = useAudioStore();

  useEffect(() => {
    initDb();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const data = await tidalApi.search(searchQuery);
      // Depending on Tidal API v2 format, we try to extract tracks.
      // E.g., data.tracks.items or data.items or data.data
      let tracks = [];
      if (data?.tracks?.items) tracks = data.tracks.items;
      else if (data?.tracks) tracks = data.tracks;
      else if (data?.data) tracks = data.data;
      else if (Array.isArray(data)) tracks = data;
      
      setResults(tracks.slice(0, 10)); // just top 10
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const handleFetchLyrics = async () => {
    if (currentTrack) {
      const data = await lyricsService.getLyrics(currentTrack.title, currentTrack.artist);
      setLyrics(data);
    }
  };

  const handleLfmAuth = async () => {
    const auth = await lastfmService.getAuthUrl();
    if (auth) {
      try { window.open(auth.url, '_blank'); } catch(e) {}
      setLfmAuthUrl(auth.url);
      setLfmToken(auth.token);
    }
  };

  const completeLfm = async () => {
    await lastfmService.completeAuth(lfmToken);
  };

  const elapsed = progress * (currentTrack?.duration || 0);

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1>SonarBuzz Prototype</h1>

      <div style={{ marginBottom: 20 }}>
        <h2>Player</h2>
        {currentTrack ? (
          <div>
            <p><strong>Playing:</strong> {currentTrack.title} by {currentTrack.artist}</p>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={progress}
              disabled
              style={{ width: "100%" }}
            />
            <p>{Math.round(elapsed)}s / {currentTrack.duration}s</p>
          </div>
        ) : (
          <p>No track playing</p>
        )}
        
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button onClick={skipPrevious} disabled={!currentTrack}>Prev</button>
          <button onClick={isPlaying ? pause : resume} disabled={!currentTrack}>{isPlaying ? 'Pause' : 'Play'}</button>
          <button onClick={skipNext} disabled={!currentTrack}>Next</button>
          {currentTrack && (
            <>
              <button onClick={() => toggleFavorite(currentTrack.id)}>
                {favorites.includes(currentTrack.id) ? '♥ Favorited' : '♡ Favorite'}
              </button>
              <button onClick={handleFetchLyrics}>Fetch Lyrics</button>
            </>
          )}
        </div>
        
        {lyrics && (
          <div style={{ marginTop: 15, padding: 10, background: '#eee', maxHeight: 200, overflow: 'auto' }}>
            <p><strong>Lyrics from LRCLIB</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{lyrics.plainLyrics || lyrics.syncedLyrics}</pre>
          </div>
        )}
      </div>

      <hr />

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Tidal..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" style={{ padding: 8 }}>Search</button>
      </form>

      <div style={{ marginBottom: 20, padding: 10, border: '1px solid #ccc' }}>
        <h3>Last.fm Settings</h3>
        {settings.lastfmSession ? (
          <div>
            <p>Connected as: <strong>{settings.lastfmSession.name}</strong></p>
            <button onClick={() => lastfmService.logout()}>Logout</button>
          </div>
        ) : (
          <div>
            <p>Not connected to Last.fm</p>
            <button onClick={handleLfmAuth}>1. Get Auth URL</button>
            {lfmAuthUrl && (
              <div style={{ marginTop: 10, padding: 10, background: '#f5f5f5', fontSize: '13px' }}>
                <p style={{ margin: '0 0 5px 0' }}>Tauri blocked the popup! Please open this URL in your browser:</p>
                <input readOnly value={lfmAuthUrl} style={{ width: '100%', marginBottom: 5 }} onClick={e => (e.target as any).select()} />
                <p style={{ margin: '0 0 5px 0' }}><strong>After clicking "Yes, Allow access" on that page, click the button below:</strong></p>
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <input value={lfmToken} onChange={e => setLfmToken(e.target.value)} placeholder="Token" disabled />
              <button onClick={completeLfm}>2. Complete Login with Token</button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3>Results</h3>
        {results.length === 0 && <p>No results yet.</p>}
        {results.map((res: any, idx: number) => {
          // If the item itself is not mapped yet, let's map it safely
          const rawTrack = res.resource || res.track || res; 
          const mapped = tidalApi.mapTrack(rawTrack);

          return (
            <div key={mapped.id || idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, padding: 10, border: "1px solid #ccc" }}>
              <div>
                <strong>{mapped.title}</strong>
                <div>{mapped.artist}</div>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                <button onClick={() => playTrack(mapped)}>Play</button>
                <button onClick={() => playNext(mapped)}>Queue</button>
                <button onClick={() => toggleFavorite(mapped.id)}>
                  {favorites.includes(mapped.id) ? '♥' : '♡'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
