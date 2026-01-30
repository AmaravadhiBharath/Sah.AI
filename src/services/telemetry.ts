/**
 * Telemetry Service
 * Tracks extraction success/failure and reports errors to Firestore.
 */

interface TelemetryEvent {
    event: string;
    timestamp: number;
    data: Record<string, any>;
}


class TelemetryService {
    private queue: TelemetryEvent[] = [];
    private enabled = false; // Default to false for privacy
    private consentGiven = false;

    constructor() {

        // Load consent from storage
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get('telemetryConsent', (data) => {
                this.consentGiven = !!data.telemetryConsent;
                this.enabled = this.consentGiven;
            });

            // Listen for changes from other contexts (e.g. sidepanel toggling settings)
            chrome.storage.onChanged.addListener((changes, area) => {
                if (area === 'local' && changes.telemetryConsent) {
                    this.consentGiven = changes.telemetryConsent.newValue;
                    this.enabled = this.consentGiven;
                }
            });
        }

        // Flush every 60 seconds
        if (typeof window !== 'undefined' || typeof self !== 'undefined') {
            setInterval(() => this.flush(), 60000);
        }
    }

    setConsent(given: boolean): void {
        this.consentGiven = given;
        this.enabled = given;
        chrome.storage.local.set({ telemetryConsent: given });

        if (!given) {
            this.queue = []; // Clear queue if consent revoked
        }
    }

    track(event: string, data: Record<string, any> = {}): void {
        if (!this.enabled || !this.consentGiven) return;

        this.queue.push({
            event,
            timestamp: Date.now(),
            data: {
                ...data,
                version: chrome.runtime.getManifest().version,
            },
        });

        // Flush immediately for critical events
        if (event.includes('error') || event.includes('crash') || event.includes('failure')) {
            this.flush();
        }
    }

    async flush(): Promise<void> {
        if (this.queue.length === 0) return;
        if (!this.consentGiven) {
            this.queue = [];
            return;
        }

        const events = [...this.queue];
        this.queue = [];

        try {
            const { collection, addDoc } = await import('firebase/firestore');
            const { getDb } = await import('./firebase');
            const db = await getDb();

            // Get current user ID from storage to avoid circular dependency
            const stored = await chrome.storage.session.get('firebase_current_user_id');
            const userId = stored.firebase_current_user_id || 'anonymous';

            const telemetryRef = collection(db, 'telemetry');
            await addDoc(telemetryRef, {
                userId, // This is now just the ID, no personal info
                events,
                sentAt: Date.now(),
            });
        } catch (error) {
            // Re-queue on failure (with limit)
            if (events.length < 100) {
                this.queue = [...events, ...this.queue].slice(0, 100);
            }
        }
    }
}

export const telemetry = new TelemetryService();
