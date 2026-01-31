const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./firebase.js","./vendor.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "./index.js";
import { j as jsxRuntimeExports, r as reactExports, c as client, R as React } from "./vendor.js";
import { g as getQuotas, _ as __vitePreload, s as setCurrentUser, a as signOutFromFirebase, b as signInToFirebase, c as saveUserProfile, d as getHistoryFromCloud, m as mergeHistory, e as saveHistoryToCloud } from "./firebase.js";
const STORAGE_KEY = "promptExtractor_user";
let TIER_LIMITS = {
  guest: 3,
  free: 10,
  go: 25,
  pro: 100,
  infi: 999,
  admin: 999
};
async function loadQuotas() {
  try {
    const quotas = await getQuotas();
    TIER_LIMITS = {
      guest: quotas.guest,
      free: quotas.free,
      go: quotas.go || 25,
      pro: quotas.pro,
      infi: quotas.infi || 999,
      admin: 999
    };
    console.log("[Auth] Loaded quotas from Firebase:", TIER_LIMITS);
  } catch (error) {
    console.log("[Auth] Using default quotas");
  }
}
async function getStoredUser() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY] || null);
    });
  });
}
async function storeUser(user) {
  return new Promise((resolve) => {
    if (user) {
      chrome.storage.local.set({ [STORAGE_KEY]: user }, resolve);
    } else {
      chrome.storage.local.remove([STORAGE_KEY], resolve);
    }
  });
}
async function getUsageCount() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["usage_count"], (result) => {
      resolve(result.usage_count || 0);
    });
  });
}
async function getUserTier(user) {
  if (!user) return "guest";
  try {
    const { checkUserTier } = await __vitePreload(async () => {
      const { checkUserTier: checkUserTier2 } = await import("./firebase.js").then((n) => n.k);
      return { checkUserTier: checkUserTier2 };
    }, true ? __vite__mapDeps([0,1]) : void 0, import.meta.url);
    const tier = await checkUserTier(user.email);
    if (tier) return tier;
  } catch (error) {
    console.log("[Auth] Could not check tier, defaulting to free");
  }
  return "free";
}
function getTierLimit(tier) {
  return TIER_LIMITS[tier];
}
async function signInWithGoogle() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      var _a;
      if (chrome.runtime.lastError || !token) {
        reject(new Error(((_a = chrome.runtime.lastError) == null ? void 0 : _a.message) || "Failed to get auth token"));
        return;
      }
      try {
        const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }
        const data = await response.json();
        const user = {
          id: data.id,
          email: data.email,
          name: data.name || data.email.split("@")[0],
          picture: data.picture
        };
        setCurrentUser(user.id);
        await signInToFirebase(token);
        await saveUserProfile(user);
        await storeUser(user);
        await loadQuotas();
        resolve(user);
      } catch (error) {
        chrome.identity.removeCachedAuthToken({ token }, () => {
        });
        reject(error);
      }
    });
  });
}
async function signOut() {
  setCurrentUser(null);
  await signOutFromFirebase();
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (token) {
        chrome.identity.removeCachedAuthToken({ token }, () => {
          fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
        });
      }
      storeUser(null).then(resolve);
    });
  });
}
function subscribeToAuthChanges(callback) {
  const listener = (changes, area) => {
    if (area === "local" && changes[STORAGE_KEY]) {
      callback(changes[STORAGE_KEY].newValue || null);
    }
  };
  chrome.storage.onChanged.addListener(listener);
  return () => {
    chrome.storage.onChanged.removeListener(listener);
  };
}
async function initializeAuth() {
  await loadQuotas();
  const user = await getStoredUser();
  const tier = await getUserTier(user);
  const used = await getUsageCount();
  const limit = getTierLimit(tier);
  return {
    user,
    tier,
    usage: { used, limit },
    isLoading: false
  };
}
function LoadingState({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loading-state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loader-minimal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-message", children: message })
  ] });
}
function ErrorState({ error, onRetry, onDismiss }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-message", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "error-retry-btn", onClick: onRetry, children: "Try Again" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "error-dismiss-btn", onClick: onDismiss, children: "Dismiss" })
    ] })
  ] });
}
function Toast({ visible, message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `toast ${visible ? "visible" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "20 6 9 17 4 12" }) }),
    message
  ] });
}
function ConfirmDialog({ visible, title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "confirm-overlay", onClick: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "confirm-dialog", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "confirm-title", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "confirm-message", children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "confirm-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "confirm-cancel", onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "confirm-danger", onClick: onConfirm, children: confirmLabel })
    ] })
  ] }) });
}
function Tooltip({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
function SelectionToolbar({ selectedCount, totalCount, onSelectAll, onClearAll }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "selection-toolbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "toolbar-btn",
        onClick: onSelectAll,
        disabled: selectedCount === totalCount,
        children: "All"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "toolbar-btn",
        onClick: onClearAll,
        disabled: selectedCount === 0,
        children: "Clear"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "toolbar-count", children: [
      selectedCount,
      " of ",
      totalCount,
      " selected"
    ] })
  ] });
}
const IconHome = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 22 9 12 15 12 15 22" })
] });
const IconGrid = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "3", width: "8", height: "8", rx: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "13", y: "3", width: "8", height: "8", rx: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "13", width: "8", height: "8", rx: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "13", y: "13", width: "8", height: "8", rx: "2" })
] });
const IconUser = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "7", r: "4" })
] });
const APP_VERSION = "3.2.0";
const SUPPORT_URL = "https://sahai.app/support";
const HistoryView = ({ history, onSelect, currentPlatform }) => {
  const [filterPlatform, setFilterPlatform] = reactExports.useState("all");
  const [filterTime, setFilterTime] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const filteredHistory = history.filter((item) => {
    if (filterPlatform === "current" && currentPlatform) {
      if (item.platform.toLowerCase() !== currentPlatform.toLowerCase()) return false;
    }
    if (filterTime === "today") {
      const today = /* @__PURE__ */ new Date();
      const itemDate = new Date(item.timestamp);
      if (today.setHours(0, 0, 0, 0) !== itemDate.setHours(0, 0, 0, 0)) return false;
    } else if (filterTime === "week") {
      const weekAgo = /* @__PURE__ */ new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (item.timestamp < weekAgo.getTime()) return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return item.preview.toLowerCase().includes(query) || item.platform.toLowerCase().includes(query);
    }
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-inner history-view-root", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "history-filters", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "filter-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "Search history...",
          className: "search-input",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value)
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `filter-chip ${filterPlatform === "all" ? "active" : ""}`,
            onClick: () => setFilterPlatform("all"),
            children: "All Apps"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `filter-chip ${filterPlatform === "current" ? "active" : ""}`,
            onClick: () => setFilterPlatform("current"),
            disabled: !currentPlatform,
            children: "Current Tab"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divider-v" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "filter-select",
            value: filterTime,
            onChange: (e) => setFilterTime(e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "today", children: "Today" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "week", children: "Past Week" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "history-scroll-area", children: filteredHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state", children: "No matching history found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "history-list", children: filteredHistory.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "history-item clickable",
        onClick: () => onSelect(item),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "history-meta", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "history-platform", children: item.platform }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "history-date", children: new Date(item.timestamp).toLocaleDateString(void 0, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "history-preview", children: item.preview }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "history-stats", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "history-badge", children: item.mode === "raw" ? "Original" : item.mode.charAt(0).toUpperCase() + item.mode.slice(1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "history-count", children: [
              item.promptCount,
              " prompt",
              item.promptCount !== 1 ? "s" : ""
            ] })
          ] })
        ]
      },
      item.id
    )) }) })
  ] });
};
const SettingsView = ({ theme, onThemeChange, onClearHistory }) => {
  const themeOptions = ["system", "light", "dark"];
  const nextTheme = () => {
    const currentIndex = themeOptions.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOptions.length;
    onThemeChange(themeOptions[nextIndex]);
  };
  const openSupport = () => {
    chrome.tabs.create({ url: SUPPORT_URL });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-item clickable", onClick: nextTheme, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Theme" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: theme.charAt(0).toUpperCase() + theme.slice(1) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-item", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "App Version" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: APP_VERSION })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-item clickable", onClick: openSupport, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Support" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value link", children: "Get Help" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-item clickable", onClick: onClearHistory, style: { color: "#ef4444" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Clear History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: "➔" })
    ] })
  ] });
};
const ProfileView = ({ user, tier, onSignIn, onSignOut, isAuthLoading }) => {
  const memberSince = user ? (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "-";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "profile-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-avatar", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, alt: "u" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconUser, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-info", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-name", children: (user == null ? void 0 : user.name) || "Guest User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-tier", children: tier })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "usage-stats", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label", children: "Plan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-value", children: tier === "guest" ? "Free" : tier })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label", children: "Member Since" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-value", children: memberSince })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "auth-action-btn",
        onClick: user ? onSignOut : onSignIn,
        disabled: isAuthLoading,
        children: isAuthLoading ? "Please wait..." : user ? "Sign Out" : "Sign In with Google"
      }
    )
  ] });
};
function AshokApp() {
  const [view, setView] = reactExports.useState("home");
  const [configTab, setConfigTab] = reactExports.useState("history");
  const [mode, setMode] = reactExports.useState("raw");
  const [isExpanded, setIsExpanded] = reactExports.useState(false);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [selectedPrompts, setSelectedPrompts] = reactExports.useState(/* @__PURE__ */ new Set());
  const [summary, setSummary] = reactExports.useState(null);
  const [status, setStatus] = reactExports.useState({ supported: false, platform: null });
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [user, setUser] = reactExports.useState(null);
  const [tier, setTier] = reactExports.useState("guest");
  const [history, setHistory] = reactExports.useState([]);
  const [loadingMessage, setLoadingMessage] = reactExports.useState("");
  const [showToast, setShowToast] = reactExports.useState({ visible: false, message: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [isStateLoaded, setIsStateLoaded] = reactExports.useState(false);
  const [theme, setTheme] = reactExports.useState("system");
  const [isAuthLoading, setIsAuthLoading] = reactExports.useState(false);
  const portRef = reactExports.useRef(null);
  const latestResultRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const port = chrome.runtime.connect({ name: "sidepanel" });
    portRef.current = port;
    port.onMessage.addListener((message) => {
      if (message.action === "EXTRACTION_RESULT" || message.action === "EXTRACTION_FROM_PAGE_RESULT") {
        const res = message.result;
        const extractionMode = message.mode || mode;
        setResult(res);
        latestResultRef.current = res;
        if (extractionMode === "summary") {
          setLoading(true);
          setLoadingMessage("Processing content...");
          if (res.prompts.length === 0) {
            setLoading(false);
            setError("No prompts found to summarize.");
            setIsExpanded(true);
            setView("home");
          } else {
            port.postMessage({
              action: "SUMMARIZE_PROMPTS",
              prompts: res.prompts
            });
          }
        } else {
          setLoading(false);
          setSummary(null);
          setIsExpanded(true);
          setView("home");
          autoSaveToHistory(res, "raw");
        }
      } else if (message.action === "SUMMARY_RESULT") {
        if (message.success) {
          setSummary(message.result.summary);
          setLoading(false);
          setIsExpanded(true);
          setView("home");
          if (latestResultRef.current) {
            autoSaveToHistory(latestResultRef.current, "summary", message.result.summary);
          }
          if (message.error) {
            setShowToast({ visible: true, message: "AI unavailable - showing raw prompts" });
            setTimeout(() => setShowToast({ visible: false, message: "" }), 3e3);
          }
        } else {
          setLoading(false);
          setError(message.error || "Summarization failed");
          setIsExpanded(true);
        }
      } else if (message.action === "STATUS_RESULT") {
        setStatus({ supported: message.supported, platform: message.platform });
      } else if (message.action === "ERROR") {
        setLoading(false);
        setError(message.error);
        setIsExpanded(true);
      }
    });
    port.postMessage({ action: "GET_STATUS" });
    chrome.storage.local.get(["promptExtractor_user", "promptExtractor_tier"], (cached) => {
      if (cached.promptExtractor_user) {
        setUser(cached.promptExtractor_user);
      }
      if (cached.promptExtractor_tier) {
        setTier(cached.promptExtractor_tier);
      }
    });
    initializeAuth().then(async (state) => {
      setUser(state.user);
      setTier(state.tier);
      chrome.storage.local.set({ promptExtractor_tier: state.tier });
      if (state.user) {
        try {
          const cloudHistory = await getHistoryFromCloud(state.user.id);
          if (cloudHistory.length > 0) {
            setHistory((prev) => {
              const merged = mergeHistory(prev, cloudHistory);
              chrome.storage.local.set({ extractionHistory: merged });
              return merged;
            });
          }
        } catch (error2) {
          console.error("Cloud sync failed:", error2);
        }
      }
    });
    const unsubscribeAuth = subscribeToAuthChanges(async (newUser) => {
      setUser(newUser);
      if (newUser) {
        const newTier = await getUserTier(newUser);
        setTier(newTier);
        chrome.storage.local.set({ promptExtractor_tier: newTier });
        try {
          const cloudHistory = await getHistoryFromCloud(newUser.id);
          if (cloudHistory.length > 0) {
            setHistory((prev) => {
              const merged = mergeHistory(prev, cloudHistory);
              chrome.storage.local.set({ extractionHistory: merged });
              return merged;
            });
          }
        } catch (error2) {
          console.error("Cloud sync on login failed:", error2);
        }
      } else {
        setTier("guest");
        chrome.storage.local.remove(["promptExtractor_tier"]);
      }
    });
    chrome.storage.local.get(["theme", "extractionHistory", "last_view", "last_config_tab", "last_mode"], (result2) => {
      if (result2.theme) setTheme(result2.theme);
      if (result2.extractionHistory) setHistory(result2.extractionHistory);
      if (result2.last_view === "config" || result2.last_view === "home") {
        setView(result2.last_view);
        if (result2.last_view === "config") {
          setIsExpanded(true);
        }
      }
      if (result2.last_config_tab) {
        setConfigTab(result2.last_config_tab);
      }
      if (result2.last_mode) {
        setMode(result2.last_mode);
      }
      setTimeout(() => {
        setIsStateLoaded(true);
      }, 50);
    });
    return () => {
      port.disconnect();
      unsubscribeAuth();
    };
  }, []);
  reactExports.useEffect(() => {
    if (isStateLoaded) {
      chrome.storage.local.set({ last_view: view });
    }
  }, [view, isStateLoaded]);
  reactExports.useEffect(() => {
    if (isStateLoaded) {
      chrome.storage.local.set({ last_config_tab: configTab });
    }
  }, [configTab, isStateLoaded]);
  reactExports.useEffect(() => {
    if (isStateLoaded) {
      chrome.storage.local.set({ last_mode: mode });
    }
  }, [mode, isStateLoaded]);
  reactExports.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    chrome.storage.local.set({ theme });
  }, [theme]);
  const handleSignIn = async () => {
    setIsAuthLoading(true);
    try {
      const user2 = await signInWithGoogle();
      setUser(user2);
      setShowToast({ visible: true, message: "Signed in successfully" });
      setTimeout(() => setShowToast({ visible: false, message: "" }), 2e3);
    } catch (err) {
      setShowToast({ visible: true, message: "Sign in failed" });
      setTimeout(() => setShowToast({ visible: false, message: "" }), 2e3);
    } finally {
      setIsAuthLoading(false);
    }
  };
  const handleSignOut = async () => {
    setIsAuthLoading(true);
    try {
      await signOut();
      setUser(null);
      setTier("guest");
      setShowToast({ visible: true, message: "Signed out" });
      setTimeout(() => setShowToast({ visible: false, message: "" }), 2e3);
    } catch (err) {
      setShowToast({ visible: true, message: "Sign out failed" });
      setTimeout(() => setShowToast({ visible: false, message: "" }), 2e3);
    } finally {
      setIsAuthLoading(false);
    }
  };
  const autoSaveToHistory = (res, saveMode, sum) => {
    var _a, _b;
    const preview = ((_a = res.prompts[0]) == null ? void 0 : _a.content.slice(0, 60)) + (((_b = res.prompts[0]) == null ? void 0 : _b.content.length) > 60 ? "..." : "") || "No prompts";
    const historyItem = {
      id: Date.now().toString(),
      platform: res.platform,
      promptCount: res.prompts.length,
      mode: saveMode,
      timestamp: Date.now(),
      prompts: res.prompts,
      preview,
      summary: sum
    };
    if (user) {
      saveHistoryToCloud(user.id, historyItem).catch((e) => console.error("Cloud save failed:", e));
    }
    setHistory((prev) => {
      if (prev.length > 0 && prev[0].preview === historyItem.preview && prev[0].platform === historyItem.platform && prev[0].mode === historyItem.mode) {
        return prev;
      }
      const updated = [historyItem, ...prev].slice(0, 50);
      chrome.storage.local.set({ extractionHistory: updated });
      return updated;
    });
  };
  const loadHistoryItem = (item) => {
    setResult({
      prompts: item.prompts,
      platform: item.platform,
      url: "",
      title: "",
      extractedAt: item.timestamp
    });
    setMode(item.mode);
    setSummary(item.summary || null);
    setView("home");
    setIsExpanded(true);
  };
  const handleGenerate = () => {
    setLoading(true);
    setLoadingMessage(mode === "raw" ? "Extracting prompts..." : "Summarizing conversation...");
    setResult(null);
    setError(null);
    setIsExpanded(true);
    setView("home");
    if (portRef.current) {
      portRef.current.postMessage({ action: "EXTRACT_PROMPTS", mode });
    }
  };
  const handleBack = () => {
    if (view === "config") {
      setView("home");
    } else {
      setIsExpanded(false);
      setResult(null);
      setSummary(null);
      setLoading(false);
      setError(null);
      setIsEditing(false);
      setSelectedPrompts(/* @__PURE__ */ new Set());
    }
  };
  const openConfig = (tab) => {
    setIsExpanded(true);
    setView("config");
    setConfigTab(tab);
  };
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setSelectedPrompts(/* @__PURE__ */ new Set());
  };
  const toggleSelection = (idx) => {
    const newSet = new Set(selectedPrompts);
    if (newSet.has(idx)) newSet.delete(idx);
    else newSet.add(idx);
    setSelectedPrompts(newSet);
  };
  const handleDeleteClick = () => {
    if (!result || selectedPrompts.size === 0) return;
    setShowDeleteConfirm(true);
  };
  const handleDeleteConfirm = () => {
    if (!result) return;
    const remainingPrompts = result.prompts.filter((_, i) => !selectedPrompts.has(i));
    setResult({ ...result, prompts: remainingPrompts });
    setSelectedPrompts(/* @__PURE__ */ new Set());
    setShowDeleteConfirm(false);
    if (remainingPrompts.length === 0) {
      setIsEditing(false);
    }
  };
  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      setHistory([]);
      chrome.storage.local.set({ extractionHistory: [] });
      setShowToast({ visible: true, message: "History cleared" });
      setTimeout(() => setShowToast({ visible: false, message: "" }), 2e3);
    }
  };
  const handleCopy = async () => {
    if (!result) return;
    const promptsToCopy = selectedPrompts.size > 0 ? result.prompts.filter((_, i) => selectedPrompts.has(i)) : result.prompts;
    const text = promptsToCopy.map((p) => p.content).join("\n\n");
    await navigator.clipboard.writeText(text);
    setShowToast({ visible: true, message: "Copied to clipboard" });
    setTimeout(() => setShowToast({ visible: false, message: "" }), 2e3);
    if (isEditing) {
      setIsEditing(false);
      setSelectedPrompts(/* @__PURE__ */ new Set());
    }
  };
  const renderToggleRow = () => {
    if (view === "home") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toggle-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `mode-btn ${mode === "raw" ? "active" : ""} ${isEditing ? "disabled" : ""}`,
            onClick: () => {
              if (!loading && !isEditing) setMode("raw");
            },
            disabled: isEditing,
            children: "Extract"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `mode-btn ${mode === "summary" ? "active" : ""} ${isEditing ? "disabled" : ""}`,
            onClick: () => {
              if (!loading && !isEditing) setMode("summary");
            },
            disabled: isEditing,
            children: "Summarize"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `toggle-nav-btn ${isEditing ? "disabled" : ""}`,
            onClick: () => {
              if (!isEditing) {
                setView("config");
                setIsExpanded(true);
              }
            },
            title: "Menu",
            disabled: isEditing,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconGrid, {})
          }
        )
      ] });
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toggle-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "toggle-nav-btn",
            onClick: () => setView("home"),
            title: "Go to Home",
            style: { marginRight: 4 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconHome, {})
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `mode-btn ${configTab === "history" ? "active" : ""}`,
            onClick: () => setConfigTab("history"),
            children: "History"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `mode-btn ${configTab === "settings" ? "active" : ""}`,
            onClick: () => setConfigTab("settings"),
            children: "Settings"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `mode-btn ${configTab === "profile" ? "active" : ""}`,
            onClick: () => setConfigTab("profile"),
            children: "Profile"
          }
        )
      ] });
    }
  };
  const renderContentArea = () => {
    let content;
    if (view === "config") {
      if (configTab === "history") content = /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryView, { history, onSelect: loadHistoryItem, currentPlatform: status.platform });
      else if (configTab === "settings") content = /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsView, { theme, onThemeChange: setTheme, onClearHistory: handleClearHistory });
      else content = /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileView, { user, tier, onSignIn: handleSignIn, onSignOut: handleSignOut, isAuthLoading });
    } else {
      content = /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, { message: loadingMessage }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ErrorState,
        {
          error,
          onRetry: handleGenerate,
          onDismiss: () => setError(null)
        }
      ) : result ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: mode === "summary" && summary ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "summary-content-container", children: summary.split("\n").map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "summary-paragraph", children: line }, i)) }) : result.prompts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `prompt-box 
                                            ${isEditing ? "selectable" : ""} 
                                            ${isEditing && selectedPrompts.has(i) ? "selected" : ""} 
                                            ${isEditing && !selectedPrompts.has(i) && selectedPrompts.size > 0 ? "dimmed" : ""}
                                        `,
          onClick: () => isEditing && toggleSelection(i),
          children: [
            isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "selection-indicator", children: selectedPrompts.has(i) ? "✓" : "" }),
            p.content
          ]
        },
        i
      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-prompt-text", children: status.platform ? `Extract prompts from this ${status.platform} conversation` : "Navigate to a supported AI chat to extract prompts" }) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `view-content-anim 
                ${view === "home" ? "prompts-area" : ""} 
                ${view === "home" && isExpanded ? "visible" : ""}
            `, children: content });
  };
  const islandExpanded = isExpanded || view === "config";
  const showUpgradePill = view === "config" && (configTab === "profile" || configTab === "settings");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: `main-content ${islandExpanded ? "expanded-view" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `action-island ${islandExpanded ? "expanded" : ""} ${showUpgradePill ? "with-upgrade" : ""}`, children: [
        renderToggleRow(),
        view === "home" && isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "controls-row visible", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-btn", onClick: isEditing ? toggleEdit : handleBack, children: isEditing ? "Done" : "Close" }),
          result ? isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectionToolbar,
            {
              selectedCount: selectedPrompts.size,
              totalCount: result.prompts.length,
              onSelectAll: () => setSelectedPrompts(new Set(result.prompts.map((_, i) => i))),
              onClearAll: () => setSelectedPrompts(/* @__PURE__ */ new Set())
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "control-btn",
              onClick: toggleEdit,
              children: "Select prompts"
            }
          ) : null
        ] }),
        islandExpanded && renderContentArea(),
        view === "home" && islandExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "action-buttons-container", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "dual-btn",
              onClick: handleDeleteClick,
              style: { color: "#ef4444", borderColor: "#ef4444" },
              disabled: selectedPrompts.size === 0,
              children: [
                "Delete (",
                selectedPrompts.size,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "dual-btn", onClick: handleCopy, disabled: selectedPrompts.size === 0, children: [
            "Copy (",
            selectedPrompts.size,
            ")"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dual-btn primary", onClick: handleGenerate, children: mode === "raw" ? "Extract Prompts" : "Summarize" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dual-btn", onClick: handleCopy, children: "Copy" })
        ] }) }),
        view === "home" && !islandExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "generate-btn-lg", onClick: handleGenerate, disabled: !status.supported, children: mode === "raw" ? "Extract" : "Summarize" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: "Unlock unlimited extractions and AI summaries", fullWidth: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `upgrade-pill ${showUpgradePill ? "visible" : ""}`, children: "Upgrade" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "app-footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "footer-profile-btn", onClick: () => openConfig("profile"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "footer-avatar-sm", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, alt: "u" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconUser, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer-user-stack", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "footer-name-min", children: (user == null ? void 0 : user.name) || "Guest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "footer-badge-min", children: tier })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "footer-status-area", children: result && isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer-prompt-count", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "footer-count-text", children: [
          result.prompts.length,
          " prompt",
          result.prompts.length !== 1 ? "s" : ""
        ] }),
        status.platform && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "footer-count-platform", children: [
          "from ",
          status.platform
        ] })
      ] }) : status.platform ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: `Connected to ${status.platform}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "status-pill-active", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-dot" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "platform-name", children: status.platform })
      ] }) }) : null })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { visible: showToast.visible, message: showToast.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        visible: showDeleteConfirm,
        title: "Delete prompts?",
        message: `Delete ${selectedPrompts.size} prompt${selectedPrompts.size !== 1 ? "s" : ""}? This cannot be undone.`,
        confirmLabel: "Delete",
        onConfirm: handleDeleteConfirm,
        onCancel: () => setShowDeleteConfirm(false)
      }
    )
  ] });
}
class TelemetryService {
  constructor() {
    __publicField(this, "queue", []);
    __publicField(this, "enabled", false);
    // Default to false for privacy
    __publicField(this, "consentGiven", false);
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get("telemetryConsent", (data) => {
        this.consentGiven = !!data.telemetryConsent;
        this.enabled = this.consentGiven;
      });
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local" && changes.telemetryConsent) {
          this.consentGiven = changes.telemetryConsent.newValue;
          this.enabled = this.consentGiven;
        }
      });
    }
    if (typeof window !== "undefined" || typeof self !== "undefined") {
      setInterval(() => this.flush(), 6e4);
    }
  }
  setConsent(given) {
    this.consentGiven = given;
    this.enabled = given;
    chrome.storage.local.set({ telemetryConsent: given });
    if (!given) {
      this.queue = [];
    }
  }
  track(event, data = {}) {
    if (!this.enabled || !this.consentGiven) return;
    this.queue.push({
      event,
      timestamp: Date.now(),
      data: {
        ...data,
        version: chrome.runtime.getManifest().version
      }
    });
    if (event.includes("error") || event.includes("crash") || event.includes("failure")) {
      this.flush();
    }
  }
  async flush() {
    if (this.queue.length === 0) return;
    if (!this.consentGiven) {
      this.queue = [];
      return;
    }
    const events = [...this.queue];
    this.queue = [];
    try {
      const { collection, addDoc } = await __vitePreload(async () => {
        const { collection: collection2, addDoc: addDoc2 } = await import("./vendor.js").then((n) => n.k);
        return { collection: collection2, addDoc: addDoc2 };
      }, true ? [] : void 0, import.meta.url);
      const { getDb } = await __vitePreload(async () => {
        const { getDb: getDb2 } = await import("./firebase.js").then((n) => n.k);
        return { getDb: getDb2 };
      }, true ? __vite__mapDeps([0,1]) : void 0, import.meta.url);
      const db = await getDb();
      const stored = await chrome.storage.session.get("firebase_current_user_id");
      const userId = stored.firebase_current_user_id || "anonymous";
      const telemetryRef = collection(db, "telemetry");
      await addDoc(telemetryRef, {
        userId,
        // This is now just the ID, no personal info
        events,
        sentAt: Date.now()
      });
    } catch (error) {
      if (events.length < 100) {
        this.queue = [...events, ...this.queue].slice(0, 100);
      }
    }
  }
}
const telemetry = new TelemetryService();
class ErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    __publicField(this, "handleReset", () => {
      this.setState({ hasError: false, error: null });
    });
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    var _a, _b;
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    telemetry.track("ui_crash", {
      error: error.message,
      stack: (_a = error.stack) == null ? void 0 : _a.slice(0, 500),
      component: (_b = errorInfo.componentStack) == null ? void 0 : _b.slice(0, 200)
    });
  }
  render() {
    var _a;
    if (this.state.hasError) {
      return this.props.fallback || /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-boundary-container", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-boundary-content", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-boundary-emoji", children: "😵" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "error-boundary-title", children: "Something went wrong" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "error-boundary-desc", children: ((_a = this.state.error) == null ? void 0 : _a.message) || "An unexpected error occurred" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: this.handleReset,
              className: "btn-primary",
              children: "Try Again"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
            .error-boundary-container {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              padding: 24px;
              text-align: center;
              background: var(--bg-primary);
              color: var(--text-primary);
            }
            .error-boundary-emoji {
              font-size: 48px;
              margin-bottom: 16px;
            }
            .error-boundary-title {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            .error-boundary-desc {
              font-size: 14px;
              color: var(--text-secondary);
              margin-bottom: 24px;
              max-width: 300px;
            }
          ` })
      ] });
    }
    return this.props.children;
  }
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AshokApp, {}) }) })
);
