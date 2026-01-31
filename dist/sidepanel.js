const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./firebase.js","./vendor.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "./index.js";
import { j as jsxRuntimeExports, r as reactExports, c as client, R as React } from "./vendor.js";
import { s as setCurrentUser, a as signInToFirebase, b as saveUserProfile, g as getQuotas, _ as __vitePreload, c as signOutFromFirebase, d as saveHistoryToCloud, e as getHistoryFromCloud, m as mergeHistory } from "./firebase.js";
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
const IconHome = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" }) });
const IconHistory = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) });
const IconSettings = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" })
] });
const IconUser = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "7", r: "4" })
] });
const IconBack = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 12H5M12 19l-7-7 7-7" }) });
function SeviApp() {
  const [activeTab, setActiveTab] = reactExports.useState("home");
  const [user, setUser] = reactExports.useState(null);
  const [tier, setTier] = reactExports.useState("FREE");
  const [history, setHistory] = reactExports.useState([]);
  const [mode, setMode] = reactExports.useState("raw");
  const [extractionResult, setExtractionResult] = reactExports.useState(null);
  const [summary, setSummary] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [status, setStatus] = reactExports.useState({ supported: false, platform: null });
  const [historySearchQuery, setHistorySearchQuery] = reactExports.useState("");
  const [historyFilter, setHistoryFilter] = reactExports.useState("all");
  const portRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const port = chrome.runtime.connect({ name: "sidepanel" });
    portRef.current = port;
    port.onMessage.addListener((msg) => {
      var _a;
      if (msg.action === "STATUS_RESULT") {
        setStatus({ supported: msg.supported, platform: msg.platform });
        if (msg.supported && !extractionResult) {
          setLoading(true);
          port.postMessage({ action: "EXTRACT_PROMPTS", mode: "raw" });
        }
      } else if (msg.action === "EXTRACTION_RESULT") {
        setExtractionResult(msg.result);
        setLoading(false);
        setError(null);
        setMode("raw");
        setSummary(null);
        const newItem = {
          id: Date.now().toString(),
          platform: msg.result.platform,
          promptCount: msg.result.prompts.length,
          mode: "raw",
          timestamp: Date.now(),
          prompts: msg.result.prompts,
          preview: ((_a = msg.result.prompts[0]) == null ? void 0 : _a.content.slice(0, 100)) || ""
        };
        if (user) {
          saveHistoryToCloud(user.id, newItem).catch((e) => console.error("Cloud save failed:", e));
        }
        setHistory((prev) => [newItem, ...prev].slice(0, 50));
      } else if (msg.action === "SUMMARY_RESULT") {
        if (msg.success) {
          setSummary(msg.result.summary);
          setMode("summary");
        } else {
          setError(msg.error);
        }
        setLoading(false);
      } else if (msg.action === "ERROR") {
        setError(msg.error);
        setLoading(false);
      }
    });
    port.postMessage({ action: "GET_STATUS" });
    initializeAuth().then((state) => {
      var _a;
      setUser(state.user);
      setTier(((_a = state.tier) == null ? void 0 : _a.toUpperCase()) || "FREE");
    });
    const unsubscribe = subscribeToAuthChanges(async (newUser) => {
      setUser(newUser);
      if (newUser) {
        const newTier = await getUserTier(newUser);
        setTier(newTier.toUpperCase());
      } else {
        setTier("FREE");
      }
    });
    chrome.storage.local.get(["extractionHistory"], async (res) => {
      if (res.extractionHistory) setHistory(res.extractionHistory);
      if (user) {
        try {
          const cloudHistory = await getHistoryFromCloud(user.id);
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
    return () => {
      port.disconnect();
      unsubscribe();
    };
  }, []);
  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setTier("FREE");
  };
  const handleExtraction = () => {
    setLoading(true);
    setError(null);
    if (portRef.current) {
      portRef.current.postMessage({ action: "EXTRACT_PROMPTS", mode: "raw" });
    }
  };
  const handleSummarize = () => {
    if (!extractionResult) return;
    setLoading(true);
    setError(null);
    if (portRef.current) {
      portRef.current.postMessage({
        action: "SUMMARIZE_PROMPTS",
        prompts: extractionResult.prompts
      });
    }
  };
  const handleCopy = async () => {
    const text = summary || (extractionResult == null ? void 0 : extractionResult.prompts.map((p) => p.content).join("\n\n"));
    if (text) {
      await navigator.clipboard.writeText(text);
    }
  };
  const renderBottomNav = () => {
    var _a;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-footer-layout", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "profile-pill", onClick: () => setActiveTab("profile"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "profile-pill-avatar", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, alt: "u" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconUser, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "profile-pill-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "profile-pill-name", children: ((_a = user == null ? void 0 : user.name) == null ? void 0 : _a.split(" ")[0]) || "Guest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "profile-pill-badge", children: tier })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "nav-pill", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `nav-item ${activeTab === "home" ? "active" : ""}`, onClick: () => setActiveTab("home"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconHome, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `nav-item ${activeTab === "history" ? "active" : ""}`, onClick: () => setActiveTab("history"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconHistory, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `nav-item ${activeTab === "settings" ? "active" : ""}`, onClick: () => setActiveTab("settings"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconSettings, {}) })
      ] })
    ] });
  };
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-animate", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sevi-card profile-main-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "profile-avatar-lg", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, alt: "u" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconUser, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "profile-details", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "profile-name", children: (user == null ? void 0 : user.name) || "Guest User" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "profile-tier-badge", children: tier })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid-stats", style: { marginTop: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-box", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: "Plan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-value", children: tier })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-box", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: "Since" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-value", children: "Jan 2026" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "sign-out-btn", onClick: user ? handleSignOut : signInWithGoogle, children: user ? "Sign Out" : "Sign In" })
        ] });
      case "settings":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-animate", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sevi-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: 16, marginBottom: 16 }, children: "Preferences" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-item", style: { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--outline)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Theme" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: "System" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-item", style: { display: "flex", justifyContent: "space-between", padding: "12px 0" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto-Sync" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, color: "var(--accent)" }, children: "Enabled" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sevi-card", style: { marginTop: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: 16, marginBottom: 16 }, children: "Support" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13, opacity: 0.7, marginBottom: 12 }, children: "Need help or have a suggestion?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "overlay-btn", style: { width: "100%", background: "var(--surface-variant)" }, children: "Contact Support" })
          ] })
        ] });
      case "history":
        const filteredHistory = history.filter((item) => {
          const matchesSearch = item.preview.toLowerCase().includes(historySearchQuery.toLowerCase()) || item.platform.toLowerCase().includes(historySearchQuery.toLowerCase());
          const matchesTab = historyFilter === "all" || status.platform && item.platform.toLowerCase() === status.platform.toLowerCase();
          return matchesSearch && matchesTab;
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-animate", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-bar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", style: { opacity: 0.5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 21l-4.35-4.35" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Search history...",
                value: historySearchQuery,
                onChange: (e) => setHistorySearchQuery(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter-chips", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `chip ${historyFilter === "all" ? "active" : ""}`,
                onClick: () => setHistoryFilter("all"),
                children: "All Apps"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `chip ${historyFilter === "tab" ? "active" : ""}`,
                onClick: () => setHistoryFilter("tab"),
                disabled: !status.platform,
                children: "Current Tab"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "chip", children: "All Time" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "history-list", style: { marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }, children: filteredHistory.length > 0 ? filteredHistory.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sevi-card", style: { padding: 16 }, onClick: () => {
            setExtractionResult({ prompts: item.prompts, platform: item.platform, url: "", title: "", extractedAt: item.timestamp });
            setSummary(item.summary || null);
            setMode(item.mode);
            setActiveTab("home");
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11, fontWeight: 700, opacity: 0.7 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { textTransform: "uppercase" }, children: item.platform }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13, lineHeight: 1.5, marginBottom: 12 }, children: item.preview }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "profile-tier-badge", style: { fontSize: 9, padding: "2px 8px" }, children: item.mode }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, opacity: 0.6 }, children: [
                item.promptCount,
                " prompts"
              ] })
            ] })
          ] }, item.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: 40, opacity: 0.5 }, children: "No history found." }) })
        ] });
      case "home":
      default:
        if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "view-animate", style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, { message: "Processing content..." }) });
        if (!extractionResult) {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "view-animate", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sevi-card full-height", style: { background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontWeight: 600 }, children: "Ready to extract" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 12 }, children: status.platform ? `Connected to ${status.platform}` : "Navigate to a supported AI chat" })
          ] }) }) });
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-animate", children: [
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sevi-card", style: { borderColor: "#FCA5A5", background: "#FEF2F2", color: "#B91C1C", fontSize: 13, marginBottom: 16 }, children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sevi-card full-height", style: { background: "white" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--outline)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700, textTransform: "uppercase", opacity: 0.6 }, children: extractionResult.platform }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn-sm", onClick: handleCopy, title: "Copy All", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prompts-list-container", children: mode === "summary" && summary ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 12, background: "var(--accent-soft)", borderRadius: 12, fontSize: 14, lineHeight: 1.6 }, children: summary }) : extractionResult.prompts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prompt-box", children: p.content }, i)) })
          ] }),
          extractionResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, marginTop: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "overlay-btn", style: { background: "white", border: "1px solid var(--outline)" }, onClick: handleExtraction, children: "Re-extract" }),
            mode === "raw" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "overlay-btn", style: { background: "white", border: "1px solid var(--outline)" }, onClick: handleSummarize, children: "Summarize" })
          ] })
        ] });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sevi-app", children: [
    activeTab !== "home" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "top-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: () => setActiveTab("home"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconBack, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, fontSize: 14, textTransform: "capitalize" }, children: activeTab }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 24 } })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "top-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: () => setActiveTab("home"), style: { opacity: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconBack, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, fontSize: 14 }, children: "Ashok" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: () => {
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 20h9" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "content-area", children: renderContent() }),
    renderBottomNav()
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
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeviApp, {}) }) })
);
