# Tidal API Client

The `tidalApi` service is the direct bridge to Tidal's servers. It handles authentication, 24-bit stream resolution, and search.

## 🔌 Import
```typescript
import { tidalApi } from '@shared/services/tidalApi';
```

## 🔍 Searching
`tidalApi.search(query: string, limit: number = 20)`

Returns a complex object from Tidal v2 OpenAPI including tracks, albums, and artists.

### Recommended Usage
Use the `mapTrack` helper to instantly convert search results into our app's player format:

```typescript
const results = await tidalApi.search('Pink Floyd');
// Transform all returned tracks
const tracks = results.data.tracks.map(t => tidalApi.mapTrack(t));
```

## 🎵 Fetching Metadata
*   `getTrack(id: string)`: Fetches a single track's full metadata.
*   `getAlbum(id: string)`: Fetches album info.
*   `getAlbumTracks(id: string)`: Returns an array of tracks for an album.
*   `getArtist(id: string)`: Fetches artist profile.
*   `getArtistTopTracks(id: string)`: Returns most popular tracks by an artist.

## 📻 Discovery & Mixes
*   `getRecommendations(trackId: string)`: Starts a "Radio" by finding similar tracks.
*   `getMixes()`: Fetches the user's generated homepage mixes (Daily Mix, etc.).

## 🖼 Image Resolution
`tidalApi.getCoverUrl(uuid: string, size: string = '1280')`

Tidal API provides UUIDs for covers. This method converts them into high-res HTTPS URLs.

```typescript
const url = tidalApi.getCoverUrl(track.album.cover);
```

## 🛠 `mapTrack(rawApiData)`
This is a critical utility. It handles:
1.  Mapping `album.cover` or `album.id` to a full image URL.
2.  Normalizing `duration` to seconds.
3.  Extracting the primary `artist` name.
4.  Capturing the `isrc` for metadata lookups.

---

## 🔒 Authentication & Headers
The client handles token lifecycle automatically. 
*   **User-Agent**: Requests are spoofed as a standard Tidal Windows Desktop client to minimize blocking risk.
*   **Tokens**: Tokens are cached for 24 hours. If a `401 Unauthorized` is received, the client automatically refreshes the token and retries the request once.
