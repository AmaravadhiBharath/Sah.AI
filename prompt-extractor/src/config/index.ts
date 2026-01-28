/**
 * Configuration Management
 * Priority: Runtime Config (Firestore) > Bundled Defaults
 */

interface Config {
    firebase: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
    };
    backend: {
        url: string;
    };
    features: {
        telemetryEnabled: boolean;
        remoteSelectorEnabled: boolean;
    };
}

const BUNDLED_CONFIG: Config = {
    firebase: {
        apiKey: "AIzaSyCub0XtA27wJfA8QzLWTRcVvsn4Wiz84H0",
        authDomain: "tiger-superextension-09.firebaseapp.com",
        projectId: "tiger-superextension-09",
        storageBucket: "tiger-superextension-09.firebasestorage.app",
        messagingSenderId: "523127017746",
        appId: "1:523127017746:web:c58418b3ad5009509823cb",
    },
    backend: {
        url: "https://tai-backend.amaravadhibharath.workers.dev",
    },
    features: {
        telemetryEnabled: true,
        remoteSelectorEnabled: true,
    },
};

class ConfigService {
    private config: Config = BUNDLED_CONFIG;
    private loaded = false;

    async load(): Promise<Config> {
        if (this.loaded) return this.config;

        try {
            // Lazy load Firestore to avoid circular dependencies
            const { doc, getDoc } = await import('firebase/firestore');
            const { getDb } = await import('../services/firebase');
            const db = await getDb();

            const configDoc = await getDoc(doc(db, 'config', 'runtime'));
            if (configDoc.exists()) {
                const remoteConfig = configDoc.data() as Partial<Config>;
                this.config = this.mergeConfig(BUNDLED_CONFIG, remoteConfig);
                console.log('[Config] Loaded runtime config from Firestore');
            }
        } catch (error) {
            console.log('[Config] Using bundled config');
        }

        this.loaded = true;
        return this.config;
    }

    private mergeConfig(base: Config, override: Partial<Config>): Config {
        return {
            firebase: { ...base.firebase, ...override.firebase },
            backend: { ...base.backend, ...override.backend },
            features: { ...base.features, ...override.features },
        };
    }

    get firebase() { return this.config.firebase; }
    get backend() { return this.config.backend; }
    get features() { return this.config.features; }
}

export const config = new ConfigService();
