# App Setup & Bootstrapping

To ensure persistence and the audio engine work correctly, you must initialize the services at the very root of your app.

## 1. Initialization
In your entry file (e.g., `index.js` or `App.tsx`), call `initDb()`. This prepares the local storage and hydration of state.

```tsx
import { initDb } from '@shared/services/database';

export default function App() {
  useEffect(() => {
    initDb();
  }, []);

  return <MainNavigator />;
}
```

## 2. Path Aliases
The project uses Bun workspaces. You should import from `@shared` to access the core package:
*   `@shared/services/...`
*   `@shared/store/...`

## 3. Storage Persistence (Mobile)
By default, the stores use a `localStorage` shim. To make data survive on iOS/Android, you **must** update the storage configuration in `database.ts` and `audioContext.tsx`:

```typescript
// packages/shared/src/services/database.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace the storageShim with:
const storage = createJSONStorage(() => AsyncStorage);
```

---

## Next Step
Go to [Building the Player](PLAYER_GUIDE.md) to start music playback.
