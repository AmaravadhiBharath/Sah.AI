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
  getDoc
} from 'firebase/firestore';

// Firebase config (from previous build)
const firebaseConfig = {
  apiKey: "AIzaSyCub0XtA27wJfA8QzLWTRcVvsn4Wiz84H0",
  authDomain: "tiger-superextension-09.firebaseapp.com",
  projectId: "tiger-superextension-09",
  storageBucket: "tiger-superextension-09.firebasestorage.app",
  messagingSenderId: "523127017746",
  appId: "1:523127017746:web:c58418b3ad5009509823cb",
  measurementId: "G-53CSV68T7D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, 'prompt-extractor');
export const db = getFirestore(app);

// Store current user ID for Firestore operations
let currentUserId: string | null = null;

// ============================================
// Authentication (Chrome Identity based)
// ============================================

/**
 * Set the current user ID (called after Chrome Identity auth)
 */
export function setCurrentUser(userId: string | null): void {
  currentUserId = userId;
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
  currentUserId = null;
  console.log('[Firebase] Signed out');
}

/**
 * Get current Firebase user ID
 */
export function getCurrentUserId(): string | null {
  return currentUserId;
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
 * Save history item to Firestore
 */
export async function saveHistoryToCloud(userId: string, item: CloudHistoryItem): Promise<void> {
  try {
    const historyRef = doc(db, `users/${userId}/history/${item.id}`);
    await setDoc(historyRef, {
      ...item,
      timestamp: item.timestamp || Date.now(),
      syncedAt: Date.now(),
    });
    console.log('[Firebase] Saved history:', item.id);
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
    const historyRef = collection(db, `users/${userId}/history`);
    const q = query(historyRef, orderBy('timestamp', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CloudHistoryItem));
  } catch (error) {
    console.error('[Firebase] Get history error:', error);
    return [];
  }
}

/**
 * Delete history item from Firestore
 */
export async function deleteHistoryFromCloud(userId: string, itemId: string): Promise<void> {
  try {
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
    const historyRef = collection(db, `users/${userId}/history`);
    const snapshot = await getDocs(historyRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
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
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      email: user.email,
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
  pro: number;
}

const DEFAULT_QUOTAS: Quotas = { guest: 3, free: 10, pro: 100 };

/**
 * Get admin-configured quotas from Firestore
 */
export async function getQuotas(): Promise<Quotas> {
  try {
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
 * Check if user is Pro (from admin settings)
 */
export async function checkProStatus(email: string): Promise<boolean> {
  try {
    const userKey = email.replace(/\./g, '_');
    const settingsRef = doc(db, 'settings', 'admin_features');
    const snapshot = await getDoc(settingsRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      const users = data.users || {};
      return users[userKey]?.isPro || false;
    }

    return false;
  } catch (error) {
    console.error('[Firebase] Check pro status error:', error);
    return false;
  }
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
 * Save raw keylogs to Firestore
 */
export async function saveKeylogsToCloud(userId: string, platform: string, prompts: CloudKeylogItem[]): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const keylogRef = doc(db, `users/${userId}/keylogs/${platform}_${today}`);

    // We use setDoc with merge: true to append/update
    // However, Firestore doesn't support direct array append without reading first or using arrayUnion
    // But arrayUnion requires unique elements. Since prompts might be identical content, we need to be careful.
    // For simplicity and cost (fewer reads), we'll read, merge locally, and write back.

    const snapshot = await getDoc(keylogRef);
    let existing: CloudKeylogItem[] = [];

    if (snapshot.exists()) {
      existing = snapshot.data().prompts || [];
    }

    // Merge and deduplicate based on content + conversationId
    const merged = [...existing];
    const existingKeys = new Set(existing.map(p => `${p.content}_${p.conversationId}`));

    for (const prompt of prompts) {
      const key = `${prompt.content}_${prompt.conversationId}`;
      if (!existingKeys.has(key)) {
        merged.push(prompt);
        existingKeys.add(key);
      }
    }

    await setDoc(keylogRef, {
      prompts: merged,
      lastUpdated: Date.now()
    }, { merge: true });

    console.log('[Firebase] Saved keylogs:', merged.length);
  } catch (error) {
    console.error('[Firebase] Save keylogs error:', error);
    // Don't throw, just log. Keylogs are best-effort.
  }
}
