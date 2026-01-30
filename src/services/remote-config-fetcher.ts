import { RemoteConfig, STORAGE_KEY, LAST_FETCH_KEY } from './remote-config';

export async function fetchRemoteConfigUpdates(currentVersion: number): Promise<void> {
    try {
        // Try to fetch from Firestore
        const { doc, getDoc } = await import('firebase/firestore');
        const { getDb } = await import('./firebase');
        const db = await getDb();

        const docRef = doc(db, 'config', 'selectors');
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            const remoteData = snapshot.data() as RemoteConfig;

            // Basic validation
            if (remoteData && remoteData.version && remoteData.version > currentVersion) {
                console.log('[RemoteConfig] New version found:', remoteData.version);
                await chrome.storage.local.set({ [STORAGE_KEY]: remoteData });
            }
        }

        // On success (or even if no new version), update last fetch time
        await chrome.storage.local.set({ [LAST_FETCH_KEY]: Date.now() });

    } catch (error) {
        console.warn('[RemoteConfig] Firestore update failed, using cached config:', error);
        // Fallback logic could go here if needed
    }
}
