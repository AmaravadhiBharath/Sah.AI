var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { a as initializeApp, g as getFirestore, b as collection, q as query, o as orderBy, l as limit, e as getDocs, d as doc, s as setDoc, f as getDoc, w as where } from "./vendor.js";
const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i = links.length - 1; i >= 0; i--) {
            const link2 = links[i];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const BUNDLED_CONFIG = {
  firebase: {
    apiKey: "AIzaSyCub0XtA27wJfA8QzLWTRcVvsn4Wiz84H0",
    authDomain: "tiger-superextension-09.firebaseapp.com",
    projectId: "tiger-superextension-09",
    storageBucket: "tiger-superextension-09.firebasestorage.app",
    messagingSenderId: "523127017746",
    appId: "1:523127017746:web:c58418b3ad5009509823cb"
  },
  backend: {
    url: "https://tai-backend.amaravadhibharath.workers.dev"
  },
  features: {
    telemetryEnabled: true,
    remoteSelectorEnabled: true
  }
};
class ConfigService {
  constructor() {
    __publicField(this, "config", BUNDLED_CONFIG);
    __publicField(this, "loaded", false);
  }
  async load() {
    if (this.loaded) return this.config;
    try {
      const { doc: doc2, getDoc: getDoc2 } = await __vitePreload(async () => {
        const { doc: doc3, getDoc: getDoc3 } = await import("./vendor.js").then((n) => n.h);
        return { doc: doc3, getDoc: getDoc3 };
      }, true ? [] : void 0, import.meta.url);
      const { getDb: getDb2 } = await __vitePreload(async () => {
        const { getDb: getDb3 } = await Promise.resolve().then(() => firebase);
        return { getDb: getDb3 };
      }, true ? void 0 : void 0, import.meta.url);
      const db2 = await getDb2();
      const configDoc = await getDoc2(doc2(db2, "config", "runtime"));
      if (configDoc.exists()) {
        const remoteConfig = configDoc.data();
        this.config = this.mergeConfig(BUNDLED_CONFIG, remoteConfig);
        console.log("[Config] Loaded runtime config from Firestore");
      }
    } catch (error) {
      console.log("[Config] Using bundled config");
    }
    this.loaded = true;
    return this.config;
  }
  mergeConfig(base, override) {
    return {
      firebase: { ...base.firebase, ...override.firebase },
      backend: { ...base.backend, ...override.backend },
      features: { ...base.features, ...override.features }
    };
  }
  get firebase() {
    return this.config.firebase;
  }
  get backend() {
    return this.config.backend;
  }
  get features() {
    return this.config.features;
  }
}
const config = new ConfigService();
let app;
let db;
async function initializeFirebase() {
  const firebaseConfig = config.firebase;
  if (!app) {
    app = initializeApp(firebaseConfig, "prompt-extractor");
    db = getFirestore(app);
  }
  return { app, db };
}
const getDb = async () => {
  if (typeof window === "undefined" && typeof self === "undefined") {
    throw new Error("Firebase cannot be initialized in this environment");
  }
  if (!db) await initializeFirebase();
  return db;
};
const USER_ID_KEY = "firebase_current_user_id";
const CLIENT_ID = crypto.randomUUID();
async function setCurrentUser(userId) {
  if (userId) {
    await chrome.storage.session.set({ [USER_ID_KEY]: userId });
  } else {
    await chrome.storage.session.remove([USER_ID_KEY]);
  }
  console.log("[Firebase] User set:", userId ? "logged in" : "logged out");
}
async function signInToFirebase(_googleAccessToken) {
  console.log("[Firebase] Auth acknowledged via Chrome Identity");
}
async function signOutFromFirebase() {
  await chrome.storage.session.remove([USER_ID_KEY]);
  console.log("[Firebase] Signed out");
}
async function getCurrentUserId() {
  const result = await chrome.storage.session.get([USER_ID_KEY]);
  return result[USER_ID_KEY] || null;
}
function sanitizeEmailKey(email) {
  return email.toLowerCase().replace(/\./g, "_dot_").replace(/\+/g, "_plus_").replace(/@/g, "_at_").replace(/[^a-z0-9_]/g, "_");
}
async function saveHistoryToCloud(userId, item) {
  const db2 = await getDb();
  const historyRef = doc(db2, `users/${userId}/history/${item.id}`);
  try {
    const { runTransaction } = await __vitePreload(async () => {
      const { runTransaction: runTransaction2 } = await import("./vendor.js").then((n) => n.h);
      return { runTransaction: runTransaction2 };
    }, true ? [] : void 0, import.meta.url);
    await runTransaction(db2, async (transaction) => {
      const existing = await transaction.get(historyRef);
      const currentVersion = existing.exists() ? existing.data().version || 0 : 0;
      transaction.set(historyRef, {
        ...item,
        version: currentVersion + 1,
        clientId: CLIENT_ID,
        timestamp: item.timestamp || Date.now(),
        syncedAt: Date.now()
      });
    });
    console.log("[Firebase] Saved history with transaction:", item.id);
  } catch (error) {
    console.error("[Firebase] Save history error:", error);
    throw error;
  }
}
async function getHistoryFromCloud(userId) {
  try {
    const db2 = await getDb();
    const historyRef = collection(db2, `users/${userId}/history`);
    const q = query(historyRef, orderBy("timestamp", "desc"), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  } catch (error) {
    console.error("[Firebase] Get history error:", error);
    return [];
  }
}
async function saveUserProfile(user) {
  try {
    const db2 = await getDb();
    const userRef = doc(db2, "users", user.id);
    await setDoc(userRef, {
      email: user.email,
      name: user.name,
      picture: user.picture || "",
      lastLogin: Date.now()
    }, { merge: true });
    console.log("[Firebase] Saved user profile");
  } catch (error) {
    console.warn("[Firebase] Save profile skipped (permissions):", error);
  }
}
const DEFAULT_QUOTAS = { guest: 3, free: 10, pro: 100 };
async function getQuotas() {
  try {
    const db2 = await getDb();
    const settingsRef = doc(db2, "settings", "admin_features");
    const snapshot = await getDoc(settingsRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return data.quotas || DEFAULT_QUOTAS;
    }
    return DEFAULT_QUOTAS;
  } catch (error) {
    console.error("[Firebase] Get quotas error:", error);
    return DEFAULT_QUOTAS;
  }
}
async function checkProStatus(email) {
  var _a;
  try {
    const db2 = await getDb();
    const userKey = sanitizeEmailKey(email);
    const settingsRef = doc(db2, "settings", "admin_features");
    const snapshot = await getDoc(settingsRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      const users = data.users || {};
      return ((_a = users[userKey]) == null ? void 0 : _a.isPro) || false;
    }
    return false;
  } catch (error) {
    console.error("[Firebase] Check pro status error:", error);
    return false;
  }
}
function mergeHistory(local, cloud) {
  const cloudIds = new Set(cloud.map((item) => item.id));
  const merged = [...cloud];
  for (const localItem of local) {
    if (!cloudIds.has(localItem.id)) {
      merged.push(localItem);
    }
  }
  merged.sort((a, b) => b.timestamp - a.timestamp);
  return merged;
}
async function saveKeylogsToCloud(userId, platform, prompts) {
  if (prompts.length === 0) return;
  const db2 = await getDb();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const conversationId = prompts[0].conversationId;
  const keylogRef = doc(db2, `users/${userId}/keylogs/${platform}_${conversationId}_${today}`);
  try {
    const { runTransaction } = await __vitePreload(async () => {
      const { runTransaction: runTransaction2 } = await import("./vendor.js").then((n) => n.h);
      return { runTransaction: runTransaction2 };
    }, true ? [] : void 0, import.meta.url);
    await runTransaction(db2, async (transaction) => {
      const snapshot = await transaction.get(keylogRef);
      let existing = [];
      if (snapshot.exists()) {
        existing = snapshot.data().prompts || [];
      }
      const merged = [...existing];
      const existingKeys = new Set(
        existing.map((p) => `${p.timestamp}|||${normalizeForKey(p.content)}`)
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
        lastUpdated: Date.now()
      });
    });
    console.log("[Firebase] Saved keylogs with transaction:", prompts.length);
  } catch (error) {
    console.error("[Firebase] Transaction failed:", error);
  }
}
async function getKeylogsFromCloud(userId, conversationId) {
  try {
    const db2 = await getDb();
    const keylogsRef = collection(db2, `users/${userId}/keylogs`);
    const q = query(keylogsRef, where("conversationId", "==", conversationId));
    const snapshot = await getDocs(q);
    let allPrompts = [];
    snapshot.forEach((doc2) => {
      const data = doc2.data();
      if (data.prompts && Array.isArray(data.prompts)) {
        allPrompts = [...allPrompts, ...data.prompts];
      }
    });
    const seen2 = /* @__PURE__ */ new Set();
    const unique = allPrompts.filter((p) => {
      const key = `${p.timestamp}|||${normalizeForKey(p.content)}`;
      if (seen2.has(key)) return false;
      seen2.add(key);
      return true;
    });
    return unique.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error("[Firebase] Get keylogs error:", error);
    return [];
  }
}
function normalizeForKey(text) {
  return text.toLowerCase().trim().slice(0, 100);
}
const firebase = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  checkProStatus,
  getCurrentUserId,
  getDb,
  getHistoryFromCloud,
  getKeylogsFromCloud,
  getQuotas,
  initializeFirebase,
  mergeHistory,
  saveHistoryToCloud,
  saveKeylogsToCloud,
  saveUserProfile,
  setCurrentUser,
  signInToFirebase,
  signOutFromFirebase
}, Symbol.toStringTag, { value: "Module" }));
export {
  __vitePreload as _,
  signOutFromFirebase as a,
  signInToFirebase as b,
  saveUserProfile as c,
  checkProStatus as d,
  getHistoryFromCloud as e,
  saveHistoryToCloud as f,
  getQuotas as g,
  getCurrentUserId as h,
  getKeylogsFromCloud as i,
  getDb as j,
  saveKeylogsToCloud as k,
  firebase as l,
  mergeHistory as m,
  setCurrentUser as s
};
