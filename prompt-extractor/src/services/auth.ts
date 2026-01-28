// Authentication service using Chrome Identity API + Firebase

import { 
  signInToFirebase, 
  signOutFromFirebase, 
  saveUserProfile, 
  checkProStatus,
  getQuotas,
  setCurrentUser
} from './firebase';

export interface ChromeUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export type UserTier = 'guest' | 'free' | 'pro' | 'admin';

export interface UserState {
  user: ChromeUser | null;
  tier: UserTier;
  usage: {
    used: number;
    limit: number;
  };
  isLoading: boolean;
}

const STORAGE_KEY = 'promptExtractor_user';

// Default tier limits (can be overridden by Firebase admin)
let TIER_LIMITS: Record<UserTier, number> = {
  guest: 3,
  free: 10,
  pro: 100,
  admin: 999,
};

// Load quotas from Firebase
async function loadQuotas(): Promise<void> {
  try {
    const quotas = await getQuotas();
    TIER_LIMITS = {
      guest: quotas.guest,
      free: quotas.free,
      pro: quotas.pro,
      admin: 999,
    };
    console.log('[Auth] Loaded quotas from Firebase:', TIER_LIMITS);
  } catch (error) {
    console.log('[Auth] Using default quotas');
  }
}

// Get stored user data
export async function getStoredUser(): Promise<ChromeUser | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY] || null);
    });
  });
}

// Store user data
async function storeUser(user: ChromeUser | null): Promise<void> {
  return new Promise((resolve) => {
    if (user) {
      chrome.storage.local.set({ [STORAGE_KEY]: user }, resolve);
    } else {
      chrome.storage.local.remove([STORAGE_KEY], resolve);
    }
  });
}

// Get usage count
export async function getUsageCount(): Promise<number> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['usage_count'], (result) => {
      resolve(result.usage_count || 0);
    });
  });
}

// Increment usage count
export async function incrementUsage(): Promise<number> {
  const current = await getUsageCount();
  const newCount = current + 1;
  await chrome.storage.local.set({ usage_count: newCount });
  return newCount;
}

// Reset usage (for testing or new billing period)
export async function resetUsage(): Promise<void> {
  await chrome.storage.local.set({ usage_count: 0 });
}

// Get user tier (checks Firebase for Pro status)
export async function getUserTier(user: ChromeUser | null): Promise<UserTier> {
  if (!user) return 'guest';
  
  try {
    const isPro = await checkProStatus(user.email);
    if (isPro) return 'pro';
  } catch (error) {
    console.log('[Auth] Could not check pro status, defaulting to free');
  }
  
  return 'free';
}

// Get tier limit
export function getTierLimit(tier: UserTier): number {
  return TIER_LIMITS[tier];
}

// Check if user can extract (within quota)
export async function canExtract(tier: UserTier): Promise<boolean> {
  const usage = await getUsageCount();
  const limit = getTierLimit(tier);
  return usage < limit;
}

// Sign in with Google
export async function signInWithGoogle(): Promise<ChromeUser> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError || !token) {
        reject(new Error(chrome.runtime.lastError?.message || 'Failed to get auth token'));
        return;
      }

      try {
        // Fetch user info from Google first
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        const user: ChromeUser = {
          id: data.id,
          email: data.email,
          name: data.name || data.email.split('@')[0],
          picture: data.picture,
        };

        // Set the current user ID for Firebase operations
        setCurrentUser(user.id);
        
        // Sign in to Firebase (now just acknowledges Chrome Identity auth)
        await signInToFirebase(token);

        // Save user profile to Firebase
        await saveUserProfile(user);
        
        // Store locally
        await storeUser(user);
        
        // Load quotas from Firebase
        await loadQuotas();
        
        resolve(user);
      } catch (error) {
        // Revoke the token on error
        chrome.identity.removeCachedAuthToken({ token }, () => {});
        reject(error);
      }
    });
  });
}

// Sign out
export async function signOut(): Promise<void> {
  // Clear current user
  setCurrentUser(null);
  
  // Sign out from Firebase
  await signOutFromFirebase();
  
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (token) {
        // Revoke the token
        chrome.identity.removeCachedAuthToken({ token }, () => {
          // Also revoke from Google
          fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
        });
      }
      storeUser(null).then(resolve);
    });
  });
}

// Subscribe to auth changes
export function subscribeToAuthChanges(callback: (user: ChromeUser | null) => void): () => void {
  const listener = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
    if (area === 'local' && changes[STORAGE_KEY]) {
      callback(changes[STORAGE_KEY].newValue || null);
    }
  };

  chrome.storage.onChanged.addListener(listener);
  
  // Return unsubscribe function
  return () => {
    chrome.storage.onChanged.removeListener(listener);
  };
}

// Initialize auth state
export async function initializeAuth(): Promise<UserState> {
  // Load quotas from Firebase
  await loadQuotas();
  
  const user = await getStoredUser();
  const tier = await getUserTier(user);
  const used = await getUsageCount();
  const limit = getTierLimit(tier);

  return {
    user,
    tier,
    usage: { used, limit },
    isLoading: false,
  };
}
