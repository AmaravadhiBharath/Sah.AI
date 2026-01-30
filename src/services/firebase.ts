/**
 * Firebase Cloud Sync Service
 * - History sync for logged-in users
 * - Admin-controlled quotas
 * - User profile management
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  deleteDoc,
  getDoc,
  where
} from 'firebase/firestore';

import { config } from '../config';

// Initialize Firebase using Config Service
let app: any;
let db: any;

export async function initializeFirebase() {
  // Use bundled config for initialization to avoid circular dependency
  // (We can't load remote config from Firestore before initializing Firestore!)
  const firebaseConfig = config.firebase;

  if (!app) {
    app = initializeApp(firebaseConfig, 'sahai');
    db = getFirestore(app);
  }
  return { app, db };
}

// Export db getter to handle async initialization

// Export db getter to handle async initialization
export const getDb = async () => {
  // Service Worker check: Ensure we don't crash if window is missing
  if (typeof window === 'undefined' && typeof self === 'undefined') {
    throw new Error('Firebase cannot be initialized in this environment');
  }

  if (!db) await initializeFirebase();
  return db;
};

const USER_ID_KEY = 'firebase_current_user_id';

// ============================================
// Authentication (Chrome Identity based)
// ============================================

/**
 * Set the current user ID (called after Chrome Identity auth)
 */
export async function setCurrentUser(userId: string | null): Promise<void> {
  if (userId) {
    await chrome.storage.session.set({ [USER_ID_KEY]: userId });
  } else {
    await chrome.storage.session.remove([USER_ID_KEY]);
  }
  console.log('[Firebase] User set:', userId ? 'logged in' : 'logged out');
}

/**
 * Sign in to Firebase - now just stores the user ID
 * Chrome Identity handles the actual Google auth
 */
export async function signInToFirebase(_googleAccessToken: string): Promise<void> {
  // Token is verified by Chrome Identity, we just acknowledge it
  console.log('[Firebase] Auth acknowledged via Chrome Identity');
}

/**
 * Sign out from Firebase
 */
export async function signOutFromFirebase(): Promise<void> {
  await chrome.storage.session.remove([USER_ID_KEY]);
  console.log('[Firebase] Signed out');
}

/**
 * Get current Firebase user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const result = await chrome.storage.session.get([USER_ID_KEY]);
  return result[USER_ID_KEY] || null;
}

/**
 * Hash email for privacy-preserving lookups
 */
async function hashEmail(email: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(email.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================
// History Sync
// ============================================

export interface CloudHistoryItem {
  id: string;
  platform: string;
  promptCount: number;
  mode: 'raw' | 'summary';
  timestamp: number;
  preview: string;
  prompts: Array<{ content: string; index: number }>;
  summary?: string;
}

/**
 * Save history item to Firestore with Transactions and Versioning
 */
export async function saveHistoryToCloud(userId: string, item: CloudHistoryItem): Promise<void> {
  const db = await getDb();
  const historyRef = doc(db, `users/${userId}/history/${item.id}`);

  try {
    const { runTransaction } = await import('firebase/firestore');
    await runTransaction(db, async (transaction) => {
      const existing = await transaction.get(historyRef);
      const currentVersion = existing.exists() ? (existing.data().version || 0) : 0;

      transaction.set(historyRef, {
        ...item,
        version: currentVersion + 1,
        timestamp: item.timestamp || Date.now(),
        syncedAt: Date.now(),
      });
    });
    console.log('[Firebase] Saved history with transaction:', item.id);
  } catch (error) {
    console.error('[Firebase] Save history error:', error);
    throw error;
  }
}

/**
 * Get history from Firestore
 */
export async function getHistoryFromCloud(userId: string): Promise<CloudHistoryItem[]> {
  try {
    const db = await getDb();
    const historyRef = collection(db, `users/${userId}/history`);
    const q = query(historyRef, orderBy('timestamp', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CloudHistoryItem));
  } catch (error) {
    console.error('[Firebase] Get history error:', error);
    // Return empty array but log error - UI should ideally handle this
    // For now, we keep behavior but at least we logged it clearly
    return [];
  }
}

/**
 * Delete history item from Firestore
 */
export async function deleteHistoryFromCloud(userId: string, itemId: string): Promise<void> {
  try {
    const db = await getDb();
    const historyRef = doc(db, `users/${userId}/history/${itemId}`);
    await deleteDoc(historyRef);
    console.log('[Firebase] Deleted history:', itemId);
  } catch (error) {
    console.error('[Firebase] Delete history error:', error);
    throw error;
  }
}

/**
 * Clear all history from Firestore
 */
export async function clearHistoryFromCloud(userId: string): Promise<void> {
  try {
    const db = await getDb();
    const historyRef = collection(db, `users/${userId}/history`);
    const snapshot = await getDocs(historyRef);

    // Use batch for better performance
    const { writeBatch } = await import('firebase/firestore');
    const batch = writeBatch(db);

    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    console.log('[Firebase] Cleared all history');
  } catch (error) {
    console.error('[Firebase] Clear history error:', error);
    throw error;
  }
}

// ============================================
// User Profile
// ============================================

/**
 * Save user profile to Firestore
 */
export async function saveUserProfile(user: {
  id: string;
  email: string;
  name: string;
  picture?: string
}): Promise<void> {
  try {
    const db = await getDb();
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      email: user.email, // Kept for user's own profile (secured by rules)
      name: user.name,
      picture: user.picture || '',
      lastLogin: Date.now(),
    }, { merge: true });
    console.log('[Firebase] Saved user profile');
  } catch (error) {
    // Don't block sign-in if Firestore fails
    console.warn('[Firebase] Save profile skipped (permissions):', error);
  }
}

// ============================================
// Admin Quotas
// ============================================

export interface Quotas {
  guest: number;
  free: number;
  go?: number;
  pro: number;
  infi?: number;
}

const DEFAULT_QUOTAS: Quotas = { guest: 3, free: 10, go: 25, pro: 100, infi: 999 };

/**
 * Get admin-configured quotas from Firestore
 */
export async function getQuotas(): Promise<Quotas> {
  try {
    const db = await getDb();
    const settingsRef = doc(db, 'settings', 'admin_features');
    const snapshot = await getDoc(settingsRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return data.quotas || DEFAULT_QUOTAS;
    }

    return DEFAULT_QUOTAS;
  } catch (error) {
    console.error('[Firebase] Get quotas error:', error);
    return DEFAULT_QUOTAS;
  }
}

/**
 * Check user tier from admin settings
 */
export async function checkUserTier(email: string): Promise<'free' | 'go' | 'pro' | 'infi' | 'admin' | null> {
  // Hardcoded admin override for developer account
  const adminEmails = [
    'bharathamaravadi@gmail.com',
    'bharath.amaravadi@gmail.com'
  ];

  if (adminEmails.includes(email.toLowerCase().trim())) {
    console.log('[Firebase] Admin access granted for:', email);
    return 'admin';
  }

  try {
    const db = await getDb();
    // Use hashed email for privacy in shared document
    const userKey = await hashEmail(email);
    const settingsRef = doc(db, 'settings', 'admin_features');
    const snapshot = await getDoc(settingsRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      const users = data.users || {};
      // Check both hash (preferred) and legacy sanitized email for backward compat
      const legacyKey = email.toLowerCase().replace(/\./g, '_dot_').replace(/@/g, '_at_');
      const userConfig = users[userKey] || users[legacyKey];

      if (userConfig) {
        // Return the tier if specified, otherwise check legacy isPro flag
        if (userConfig.tier) return userConfig.tier;
        if (userConfig.isPro) return 'pro';
        if (userConfig.isAdmin) return 'admin';
      }
    }

    return null;
  } catch (error) {
    console.error('[Firebase] Check user tier error:', error);
    return null;
  }
}

/**
 * Check if user is Pro (from admin settings) - Legacy function for backward compatibility
 */
export async function checkProStatus(email: string): Promise<boolean> {
  const tier = await checkUserTier(email);
  return tier === 'pro' || tier === 'infi' || tier === 'admin';
}

// ============================================
// Sync Helper
// ============================================

/**
 * Merge local and cloud history (cloud wins on conflict)
 */
export function mergeHistory(
  local: CloudHistoryItem[],
  cloud: CloudHistoryItem[]
): CloudHistoryItem[] {
  const cloudIds = new Set(cloud.map(item => item.id));

  // Start with all cloud items
  const merged = [...cloud];

  // Add local items that aren't in cloud
  for (const localItem of local) {
    if (!cloudIds.has(localItem.id)) {
      merged.push(localItem);
    }
  }

  // Sort by timestamp descending
  merged.sort((a, b) => b.timestamp - a.timestamp);

  return merged;
}

// ============================================
// Raw Keylog Sync
// ============================================

export interface CloudKeylogItem {
  content: string;
  timestamp: number;
  conversationId: string;
  platform: string;
}

/**
 * Save raw keylogs to Firestore using Transactions
 */
export async function saveKeylogsToCloud(userId: string, platform: string, prompts: CloudKeylogItem[]): Promise<void> {
  if (prompts.length === 0) return;

  const db = await getDb();
  const today = new Date().toISOString().split('T')[0];
  const conversationId = prompts[0].conversationId;

  // Key by conversation to avoid mixing data
  const keylogRef = doc(db, `users/${userId}/keylogs/${platform}_${conversationId}_${today}`);

  try {
    const { runTransaction } = await import('firebase/firestore');
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(keylogRef);
      let existing: CloudKeylogItem[] = [];

      if (snapshot.exists()) {
        existing = snapshot.data().prompts || [];
      }

      // Merge with deduplication using safer delimiter
      const merged = [...existing];
      const existingKeys = new Set(
        existing.map(p => `${p.timestamp}|||${normalizeForKey(p.content)}`)
      );

      for (const prompt of prompts) {
        const key = `${prompt.timestamp}|||${normalizeForKey(prompt.content)}`;
        if (!existingKeys.has(key)) {
          merged.push(prompt);
          existingKeys.add(key);
        }
      }

      transaction.set(keylogRef, {
        prompts: merged,
        conversationId,
        platform,
        lastUpdated: Date.now(),
      });
    });

    console.log('[Firebase] Saved keylogs with transaction:', prompts.length);
  } catch (error) {
    console.error('[Firebase] Transaction failed:', error);
    // Don't throw, just log. Keylogs are best-effort.
  }
}

/**
 * Get raw keylogs from Firestore for a specific conversation
 */
export async function getKeylogsFromCloud(userId: string, conversationId: string): Promise<CloudKeylogItem[]> {
  try {
    const db = await getDb();
    const keylogsRef = collection(db, `users/${userId}/keylogs`);
    const q = query(keylogsRef, where('conversationId', '==', conversationId));
    const snapshot = await getDocs(q);

    let allPrompts: CloudKeylogItem[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.prompts && Array.isArray(data.prompts)) {
        allPrompts = [...allPrompts, ...data.prompts];
      }
    });

    // Deduplicate and sort
    const seen = new Set<string>();
    const unique = allPrompts.filter(p => {
      const key = `${p.timestamp}|||${normalizeForKey(p.content)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('[Firebase] Get keylogs error:', error);
    return [];
  }
}

function normalizeForKey(text: string): string {
  return text.toLowerCase().trim().slice(0, 100);
}
