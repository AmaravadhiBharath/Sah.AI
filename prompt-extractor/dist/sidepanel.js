const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./firebase.js","./vendor.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "./index.js";
import { r as reactExports, j as jsxRuntimeExports, c as client, R as React } from "./vendor.js";
import { s as setCurrentUser, a as signOutFromFirebase, b as signInToFirebase, c as saveUserProfile, g as getQuotas, d as checkProStatus, e as getHistoryFromCloud, m as mergeHistory, f as saveHistoryToCloud, _ as __vitePreload } from "./firebase.js";
const STORAGE_KEY = "promptExtractor_user";
let TIER_LIMITS = {
  guest: 3,
  free: 10,
  pro: 100,
  admin: 999
};
async function loadQuotas() {
  try {
    const quotas = await getQuotas();
    TIER_LIMITS = {
      guest: quotas.guest,
      free: quotas.free,
      pro: quotas.pro,
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
    const isPro = await checkProStatus(user.email);
    if (isPro) return "pro";
  } catch (error) {
    console.log("[Auth] Could not check pro status, defaulting to free");
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
function friendlyError(error) {
  if (error.includes("timeout") || error.includes("Timeout")) {
    return "Request took too long. Please try again.";
  }
  if (error.includes("network") || error.includes("Network") || error.includes("Failed to fetch")) {
    return "Connection issue. Check your internet and try again.";
  }
  if (error.includes("temporarily unavailable") || error.includes("Circuit")) {
    return "Service is busy. Please wait a moment and try again.";
  }
  if (error.includes("quota") || error.includes("limit") || error.includes("429")) {
    return "Daily limit reached. Upgrade to Pro for more.";
  }
  if (error.includes("401") || error.includes("403") || error.includes("auth")) {
    return "Session expired. Please sign in again.";
  }
  if (error.includes("empty")) {
    return "No content to process. Start a conversation first.";
  }
  return error.length > 100 ? error.slice(0, 100) + "..." : error;
}
function App() {
  var _a;
  const [view, setView] = reactExports.useState("main");
  const [mode, setMode] = reactExports.useState("raw");
  const [theme, setTheme] = reactExports.useState("system");
  const [status, setStatus] = reactExports.useState({ supported: false, platform: null });
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const [history, setHistory] = reactExports.useState([]);
  const [showHistoryModal, setShowHistoryModal] = reactExports.useState(false);
  const [showSettingsModal, setShowSettingsModal] = reactExports.useState(false);
  const [showProfileModal, setShowProfileModal] = reactExports.useState(false);
  const [showPulseCheck, setShowPulseCheck] = reactExports.useState(false);
  const [currentTimestamp, setCurrentTimestamp] = reactExports.useState(null);
  const [confirmClear, setConfirmClear] = reactExports.useState(false);
  const [signingIn, setSigningIn] = reactExports.useState(false);
  const [user, setUser] = reactExports.useState(null);
  const [tier, setTier] = reactExports.useState("guest");
  const [summary, setSummary] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [loadingMessage, setLoadingMessage] = reactExports.useState("");
  const [quota, setQuota] = reactExports.useState(null);
  const [duration, setDuration] = reactExports.useState(null);
  const startTimeRef = reactExports.useRef(0);
  const portRef = reactExports.useRef(null);
  const [animatedCount, setAnimatedCount] = reactExports.useState({ prompts: 0, words: 0 });
  const [showStats, setShowStats] = reactExports.useState(true);
  const profileRef = reactExports.useRef(null);
  const historyRef = reactExports.useRef(null);
  const settingsRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (showProfileModal && profileRef.current && !profileRef.current.contains(target)) {
        setShowProfileModal(false);
      }
      if (showHistoryModal && historyRef.current && !historyRef.current.contains(target)) {
        setShowHistoryModal(false);
      }
      if (showSettingsModal && settingsRef.current && !settingsRef.current.contains(target)) {
        setShowSettingsModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileModal, showHistoryModal, showSettingsModal]);
  const handleScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 10 && showStats) {
      setShowStats(false);
    } else if (scrollTop <= 10 && !showStats) {
      setShowStats(true);
    }
  };
  reactExports.useEffect(() => {
    if (result) {
      const targetPrompts = result.prompts.length;
      const targetWords = result.prompts.reduce((acc, p) => acc + p.content.split(/\s+/).length, 0);
      setAnimatedCount({ prompts: 0, words: 0 });
      const duration2 = 600;
      const steps = 20;
      const interval = duration2 / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedCount({
          prompts: Math.round(targetPrompts * eased),
          words: Math.round(targetWords * eased)
        });
        if (step >= steps) clearInterval(timer);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [result]);
  const getEffectiveTheme = reactExports.useCallback(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }, [theme]);
  const effectiveTheme = getEffectiveTheme();
  reactExports.useEffect(() => {
    document.documentElement.setAttribute("data-theme", effectiveTheme);
  }, [effectiveTheme]);
  reactExports.useEffect(() => {
    chrome.storage.local.get(["extractionHistory", "theme", "quotaUsed", "quotaLimit"], (data) => {
      if (data.extractionHistory) setHistory(data.extractionHistory);
      if (data.theme) setTheme(data.theme);
      if (data.quotaUsed !== void 0 && data.quotaLimit !== void 0) {
        setQuota({ used: data.quotaUsed, limit: data.quotaLimit });
      }
    });
  }, []);
  reactExports.useEffect(() => {
    initializeAuth().then(async (state) => {
      setUser(state.user);
      setTier(state.tier);
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
          console.error("[App] Cloud sync failed:", error2);
        }
      }
    });
    const unsubscribe = subscribeToAuthChanges(async (newUser) => {
      setUser(newUser);
      if (newUser) {
        const newTier = await getUserTier(newUser);
        setTier(newTier);
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
          console.error("[App] Cloud sync on login failed:", error2);
        }
      } else {
        setTier("guest");
      }
    });
    return unsubscribe;
  }, []);
  const [lastExtractionResult, setLastExtractionResult] = reactExports.useState(null);
  const autoSaveToHistory = reactExports.useCallback((res, saveMode, sum) => {
    var _a2;
    const preview = ((_a2 = res.prompts[0]) == null ? void 0 : _a2.content.slice(0, 50)) || "No prompts";
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
    setHistory((prev) => {
      if (prev.length > 0 && prev[0].preview === historyItem.preview && prev[0].platform === historyItem.platform && prev[0].mode === historyItem.mode) {
        return prev;
      }
      const updated = [historyItem, ...prev].slice(0, 50);
      chrome.storage.local.set({ extractionHistory: updated });
      return updated;
    });
    if (user) {
      saveHistoryToCloud(user.id, historyItem).catch((e) => console.error("[App] Auto-save cloud failed:", e));
    }
  }, [user]);
  const handleExtractionResult = reactExports.useCallback((extractionResult, extractMode) => {
    const endTime = performance.now();
    setDuration((endTime - startTimeRef.current) / 1e3);
    setResult(extractionResult);
    setLastExtractionResult(extractionResult);
    setLoading(false);
    setLoadingMessage("");
    setView("main");
    setSummary(null);
    setError(null);
    setShowStats(true);
    setCurrentTimestamp(null);
    if (extractMode === "raw") {
      autoSaveToHistory(extractionResult, "raw");
    }
  }, [autoSaveToHistory]);
  const modeRef = reactExports.useRef(mode);
  const lastResultRef = reactExports.useRef(lastExtractionResult);
  reactExports.useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  reactExports.useEffect(() => {
    lastResultRef.current = lastExtractionResult;
  }, [lastExtractionResult]);
  const handlePortMessage = reactExports.useCallback((message) => {
    var _a2, _b;
    if (message.action === "EXTRACTION_RESULT" || message.action === "EXTRACTION_FROM_PAGE_RESULT") {
      setError(null);
      const extractMode = message.mode || modeRef.current;
      if (message.mode) setMode(message.mode);
      handleExtractionResult(message.result, extractMode);
      if (extractMode === "summary" && message.result.prompts.length > 0) {
        setLoading(true);
        setLoadingMessage("Consolidating prompts...");
        (_a2 = portRef.current) == null ? void 0 : _a2.postMessage({ action: "SUMMARIZE_PROMPTS", prompts: message.result.prompts });
      }
    } else if (message.action === "STATUS_RESULT") {
      setStatus({ supported: message.supported, platform: message.platform });
    } else if (message.action === "SUMMARY_RESULT") {
      setLoading(false);
      setLoadingMessage("");
      if (message.success && ((_b = message.result) == null ? void 0 : _b.summary)) {
        setSummary(message.result.summary);
        setError(null);
        if (lastResultRef.current) {
          autoSaveToHistory(lastResultRef.current, "summary", message.result.summary);
        }
      } else if (message.error) {
        setError(friendlyError(message.error));
      }
      if (message.quotaUsed !== void 0) {
        setQuota({ used: message.quotaUsed, limit: message.quotaLimit || 10 });
        chrome.storage.local.set({ quotaUsed: message.quotaUsed, quotaLimit: message.quotaLimit || 10 });
      }
    } else if (message.action === "ERROR") {
      setLoading(false);
      setLoadingMessage("");
      setError(friendlyError(message.error));
    } else if (message.action === "PROGRESS") {
      setLoadingMessage(message.message || "Processing...");
    }
  }, [handleExtractionResult, autoSaveToHistory]);
  const connectPort = reactExports.useCallback(() => {
    const port = chrome.runtime.connect({ name: "sidepanel" });
    portRef.current = port;
    port.onMessage.addListener(handlePortMessage);
    port.onDisconnect.addListener(() => {
      console.log("[SahAI] Port disconnected, will reconnect on next action");
      portRef.current = null;
    });
    port.postMessage({ action: "GET_STATUS" });
    return port;
  }, [handlePortMessage]);
  reactExports.useEffect(() => {
    const port = connectPort();
    return () => {
      portRef.current = null;
      port.disconnect();
    };
  }, [connectPort]);
  const handleExtract = reactExports.useCallback(() => {
    var _a2;
    console.log("[SahAI] handleExtract called, mode:", mode);
    if (!portRef.current) {
      console.warn("[SahAI] Port not connected, reconnecting with listeners...");
      connectPort();
    }
    setLoading(true);
    setError(null);
    setDuration(null);
    startTimeRef.current = performance.now();
    setLoadingMessage("Extracting prompts...");
    console.log("[SahAI] Sending EXTRACT_PROMPTS message");
    (_a2 = portRef.current) == null ? void 0 : _a2.postMessage({ action: "EXTRACT_PROMPTS", mode });
    setTimeout(() => {
      setLoading((currentLoading) => {
        if (currentLoading) {
          console.warn("[SahAI] Extraction timed out in sidepanel");
          setError("Request timed out. Please try again.");
          return false;
        }
        return currentLoading;
      });
    }, 8e3);
  }, [mode, connectPort]);
  reactExports.useEffect(() => {
    const handleTriggerExtract = () => handleExtract();
    window.addEventListener("trigger-extract", handleTriggerExtract);
    return () => window.removeEventListener("trigger-extract", handleTriggerExtract);
  }, [handleExtract]);
  const handleCopy = reactExports.useCallback(async () => {
    if (!result) return;
    const content = result.prompts.map((p, i) => `${i + 1}. ${p.content}`).join("\n\n");
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab == null ? void 0 : tab.id) chrome.tabs.sendMessage(tab.id, { action: "CONTENT_COPIED", content });
  }, [result]);
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      var _a2;
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        if (status.supported && !loading) handleExtract();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "c" && result && !((_a2 = window.getSelection()) == null ? void 0 : _a2.toString())) {
        e.preventDefault();
        handleCopy();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status.supported, loading, result, handleExtract, handleCopy]);
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (target.closest(".popup") || target.closest(".bottom-nav")) return;
      if (showHistoryModal || showSettingsModal || showProfileModal || showPulseCheck) {
        setShowHistoryModal(false);
        setShowSettingsModal(false);
        setShowProfileModal(false);
        setShowPulseCheck(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [showHistoryModal, showSettingsModal, showProfileModal]);
  const loadHistoryItem = (item) => {
    setResult({ prompts: item.prompts, platform: item.platform, url: "", title: "", extractedAt: item.timestamp });
    setSummary(item.summary || null);
    setMode(item.mode);
    setView("main");
    setShowHistoryModal(false);
    setCurrentTimestamp(item.timestamp);
  };
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  };
  const handleClearResult = reactExports.useCallback(() => {
    console.log("[SahAI] Clearing result");
    setResult(null);
    setSummary(null);
    setError(null);
    setLastExtractionResult(null);
  }, []);
  const wordCount = (result == null ? void 0 : result.prompts.reduce((acc, p) => acc + p.content.split(/\s+/).length, 0)) || 0;
  const promptCount = (result == null ? void 0 : result.prompts.length) || 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-left", children: view !== "main" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setView("main"), className: "icon-btn has-tooltip", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconArrowLeft, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tooltip-bottom", children: "Back" })
      ] }) : result ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleClearResult, className: "icon-btn has-tooltip", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconArrowLeft, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tooltip-bottom", children: "Clear" })
      ] }) : null }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mode-toggle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setMode("raw"),
            className: `mode-btn ${mode === "raw" ? "active" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconList, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Extract" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setMode("summary"),
            className: `mode-btn ${mode === "summary" ? "active" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconSummary, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Summarize" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-right" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "main", children: view === "main" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "content-area", onScroll: handleScroll, children: error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { error, onRetry: handleExtract }) : loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, { message: loadingMessage }) : mode === "summary" && summary ? /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { summary }) : result && result.prompts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "floating-actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleCopy,
            className: `floating-copy-btn ${copied ? "success" : ""}`,
            title: "Copy all prompts",
            children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(IconCheck, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconCopy, {})
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PromptsList, { prompts: result.prompts })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          supported: status.supported,
          platform: status.platform
        }
      ) }),
      !error && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "action-bar-sticky", children: [
        (result || summary) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `stats-bar ${!showStats ? "hidden" : ""}`, style: { marginBottom: "12px", borderTop: "none", padding: "0" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "stat-badge count-up", children: [
            animatedCount.prompts,
            " prompts"
          ] }, `p-${promptCount}`),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "stat-badge count-up", children: [
            animatedCount.words,
            " words"
          ] }, `w-${wordCount}`),
          currentTimestamp ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "stat-badge count-up", children: [
            new Date(currentTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            " • ",
            new Date(currentTimestamp).toLocaleDateString(void 0, { month: "short", day: "numeric" })
          ] }) : duration !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "stat-badge count-up", children: [
            duration.toFixed(1),
            "s"
          ] }),
          quota && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `stat-badge ${quota.used >= quota.limit ? "warning" : ""}`, children: [
            quota.used,
            "/",
            quota.limit,
            " daily"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `extract-btn-wrapper ${loading ? "pulsing" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleExtract,
            disabled: !status.supported || loading,
            className: `btn-primary ${loading ? "loading" : ""}`,
            style: { marginBottom: 0 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Generate" })
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "bottom-nav", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `nav-profile ${showProfileModal ? "active" : ""}`,
          onClick: () => {
            setShowProfileModal(!showProfileModal);
            setShowHistoryModal(false);
            setShowSettingsModal(false);
            setShowPulseCheck(false);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-profile-avatar", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconUser, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nav-profile-info", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-profile-name", children: ((_a = user == null ? void 0 : user.name) == null ? void 0 : _a.split(" ")[0]) || "Guest" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-profile-tier", children: tier })
            ] }),
            !showProfileModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-tooltip", children: "Profile" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nav-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NavItem,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconHistory, {}),
            label: "History",
            active: showHistoryModal,
            onClick: () => {
              setShowHistoryModal(!showHistoryModal);
              setShowSettingsModal(false);
              setShowProfileModal(false);
              setShowPulseCheck(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NavItem,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconSettings, {}),
            label: "Settings",
            active: showSettingsModal,
            onClick: () => {
              setShowSettingsModal(!showSettingsModal);
              setShowHistoryModal(false);
              setShowProfileModal(false);
              setShowPulseCheck(false);
            }
          }
        )
      ] })
    ] }),
    showProfileModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup popup-left", ref: profileRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "popup-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-title", children: "Profile" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "popup-body", children: user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-user", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "popup-avatar", children: user.picture ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconUser, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-user-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-user-name", children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-user-email", children: user.email })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          signOut();
          setUser(null);
          setTier("guest");
          setShowProfileModal(false);
        }, className: "popup-btn danger", children: "Sign out" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: async () => {
            setSigningIn(true);
            try {
              const u = await signInWithGoogle();
              setUser(u);
              setTier("free");
              setShowProfileModal(false);
            } catch (e) {
              console.error(e);
            } finally {
              setSigningIn(false);
            }
          },
          className: "popup-btn primary",
          disabled: signingIn,
          children: signingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spinner" }),
            "Signing in..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconGoogle, {}),
            "Sign in with Google"
          ] })
        }
      ) })
    ] }),
    showHistoryModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup popup-right popup-history", ref: historyRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-title-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-title", children: "History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "popup-external-link",
              onClick: () => chrome.tabs.create({ url: "history.html" }),
              title: "Open full history",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconExternalLink, {})
            }
          )
        ] }),
        history.length > 0 && !confirmClear && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "popup-clear", onClick: () => setConfirmClear(true), children: "Clear all" }),
        confirmClear && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-confirm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "popup-confirm-btn danger", onClick: () => {
            setHistory([]);
            chrome.storage.local.remove("extractionHistory");
            setConfirmClear(false);
          }, children: "Yes, clear" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "popup-confirm-btn", onClick: () => setConfirmClear(false), children: "Cancel" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "popup-body popup-scroll", children: history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "popup-empty", children: "No extractions yet" }) : history.slice(0, 20).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "popup-history-item", onClick: () => {
        loadHistoryItem(item);
        setShowHistoryModal(false);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformLogo, { platform: item.platform }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-history-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-history-preview", children: item.preview }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "popup-history-meta", children: [
            item.mode === "summary" ? "Summary • " : "",
            item.promptCount,
            " prompts • ",
            new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            " • ",
            new Date(item.timestamp).toLocaleDateString()
          ] })
        ] })
      ] }, item.id)) })
    ] }),
    showSettingsModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup popup-right", ref: settingsRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "popup-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-title", children: "Settings" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-setting", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-setting-label", children: "Theme" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: theme, onChange: (e) => handleThemeChange(e.target.value), className: "popup-select", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "system", children: "System" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "light", children: "Light" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "dark", children: "Dark" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-setting", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-setting-label", children: "Version" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-setting-value", children: "1.0.0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setShowPulseCheck(true);
          setShowSettingsModal(false);
        }, className: "popup-setting-link", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-setting-label", children: "Pulse Check" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconExternalLink, {})
        ] })
      ] })
    ] }),
    showPulseCheck && /* @__PURE__ */ jsxRuntimeExports.jsx(PulseCheckModal, { onClose: () => setShowPulseCheck(false), userEmail: user == null ? void 0 : user.email }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Toast, { visible: copied, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(IconCheck, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Copied to clipboard" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: styles })
  ] });
}
function Toast({ visible, children }) {
  const [shouldRender, setShouldRender] = reactExports.useState(false);
  const [isExiting, setIsExiting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [visible, shouldRender]);
  if (!shouldRender) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `toast ${isExiting ? "toast-exit" : ""}`, children });
}
function NavItem({ icon, label, active, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: `nav-item ${active ? "active" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-icon", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-label", children: label }),
    !active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-tooltip", children: label })
  ] });
}
function PromptsList({ prompts }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prompts-list stagger-children", children: prompts.map((prompt, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(PromptCard, { prompt, index }, index)) });
}
function PromptCard({ prompt, index }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const cardRef = reactExports.useRef(null);
  const isLong = prompt.content.length > 200;
  const text = isLong && !expanded ? prompt.content.slice(0, 200) + "..." : prompt.content;
  reactExports.useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-card", ref: cardRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prompt-index", children: index + 1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "prompt-text", children: text }),
      isLong && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          },
          className: "expand-btn",
          children: expanded ? "Show less" : "Show more"
        }
      )
    ] })
  ] });
}
function SummaryCard({ summary }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "summary-card animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "summary-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(IconSummary, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Summary" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "summary-text", children: summary })
  ] });
}
function EmptyState({ supported, platform }) {
  const platforms = [
    { name: "ChatGPT", url: "https://chatgpt.com", logo: /* @__PURE__ */ jsxRuntimeExports.jsx(LogoChatGPT, {}) },
    { name: "Claude", url: "https://claude.ai", logo: /* @__PURE__ */ jsxRuntimeExports.jsx(LogoClaude, {}) },
    { name: "Gemini", url: "https://gemini.google.com", logo: /* @__PURE__ */ jsxRuntimeExports.jsx(LogoGemini, {}) },
    { name: "Perplexity", url: "https://perplexity.ai", logo: /* @__PURE__ */ jsxRuntimeExports.jsx(LogoPerplexity, {}) },
    { name: "DeepSeek", url: "https://chat.deepseek.com", logo: /* @__PURE__ */ jsxRuntimeExports.jsx(LogoDeepseek, {}) }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconList, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: supported ? `Ready to extract from ${platform}` : "Open an AI platform to start" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-desc", children: supported ? "Click Generate to capture all prompts from this conversation." : "Navigate to one of the supported platforms below to begin extracting your prompts." }),
    !supported && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "platform-launchpad", children: platforms.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: p.url, target: "_blank", rel: "noopener noreferrer", className: "platform-link", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "platform-link-logo", children: p.logo }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.name })
    ] }, p.name)) })
  ] });
}
function LoadingState({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loading-state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "simple-spinner" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading-text", children: message || "Processing..." })
  ] });
}
function ErrorState({ error, onRetry }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconError, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "error-title", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "error-desc", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onRetry, className: "error-action", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(IconRefresh, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Try again" })
    ] })
  ] });
}
function PlatformLogo({ platform }) {
  const p = platform.toLowerCase();
  if (p.includes("chatgpt") || p.includes("openai")) return /* @__PURE__ */ jsxRuntimeExports.jsx(LogoChatGPT, {});
  if (p.includes("claude") || p.includes("anthropic")) return /* @__PURE__ */ jsxRuntimeExports.jsx(LogoClaude, {});
  if (p.includes("gemini") || p.includes("google")) return /* @__PURE__ */ jsxRuntimeExports.jsx(LogoGemini, {});
  if (p.includes("perplexity")) return /* @__PURE__ */ jsxRuntimeExports.jsx(LogoPerplexity, {});
  if (p.includes("deepseek")) return /* @__PURE__ */ jsxRuntimeExports.jsx(LogoDeepseek, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LogoGeneric, {});
}
const IconArrowLeft = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 12H5M12 19l-7-7 7-7" }) });
const IconHistory = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "12 6 12 12 16 14" })
] });
const IconSettings = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
] });
const IconList = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
] });
const IconSummary = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "14 2 14 8 20 8" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" })
] });
const IconRefresh = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "23 4 23 10 17 10" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" })
] });
const IconCopy = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
] });
const IconCheck = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "20 6 9 17 4 12" }) });
const IconCheckAnimated = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "var(--highlight)", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: "check-animated", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "20 6 9 17 4 12", strokeDasharray: "24", strokeDashoffset: "0", style: { animation: "checkmark 0.3s ease-out" } }) });
const IconError = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "15", y1: "9", x2: "9", y2: "15" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "9", y1: "9", x2: "15", y2: "15" })
] });
const IconUser = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "7", r: "4" })
] });
const IconGoogle = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
] });
const LogoChatGPT = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" }) });
const LogoClaude = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" }) });
const LogoGemini = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" }) });
const LogoPerplexity = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 6v6l4 2" })
] });
const LogoDeepseek = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" }) });
const LogoGeneric = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 12h8M12 8v8" })
] });
const IconExternalLink = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 3 21 3 21 9" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "10", y1: "14", x2: "21", y2: "3" })
] });
function PulseCheckModal({ onClose, userEmail }) {
  const [step, setStep] = reactExports.useState(1);
  const [sentiment, setSentiment] = reactExports.useState(null);
  const [answers, setAnswers] = reactExports.useState({});
  const [submitting, setSubmitting] = reactExports.useState(false);
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVYHShkNF4yPbMf5rGnVfLg2oLq9cZxMpa_GQ3jwPEVWl-TQyTSE8WTz7b7P_GuA4NAg/exec";
  const handleRating = (rating) => {
    let s = "neutral";
    if (rating === "Game Changer" || rating === "Useful") s = "happy";
    if (rating === "Not helpful") s = "sad";
    setSentiment(s);
    setAnswers((prev) => ({ ...prev, rating }));
    setStep(2);
  };
  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        type: "pulse_check",
        timestamp: (/* @__PURE__ */ new Date()).toLocaleString(),
        email: userEmail || "anonymous",
        sentiment,
        ...answers
      };
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
      setStep(3);
    } catch (error) {
      console.error("Feedback error:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup popup-center pulse-check-popup", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-title", children: "Pulse Check" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "popup-close", children: "×" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-body", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pulse-step-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "pulse-question", children: "How is your experience?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sentiment-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleRating("Game Changer"), className: "sentiment-btn group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sentiment-emoji", children: "🤩" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sentiment-label", children: "Game Changer" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleRating("Useful"), className: "sentiment-btn group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sentiment-emoji", children: "🙂" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sentiment-label", children: "Useful" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleRating("Okay"), className: "sentiment-btn group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sentiment-emoji", children: "😐" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sentiment-label", children: "Okay" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleRating("Not helpful"), className: "sentiment-btn group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sentiment-emoji", children: "🙁" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sentiment-label", children: "Not helpful" })
          ] })
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pulse-step-2 animate-fade-in", children: [
        sentiment === "happy" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pulse-form", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Should I invest more time into this?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toggle-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `toggle-btn ${answers.investTime === true ? "active" : ""}`,
                  onClick: () => handleAnswerChange("investTime", true),
                  children: "Yes"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `toggle-btn ${answers.investTime === false ? "active" : ""}`,
                  onClick: () => handleAnswerChange("investTime", false),
                  children: "No"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Did you wish for this tool before?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toggle-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `toggle-btn ${answers.wishedBefore === true ? "active" : ""}`,
                  onClick: () => handleAnswerChange("wishedBefore", true),
                  children: "Yes"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `toggle-btn ${answers.wishedBefore === false ? "active" : ""}`,
                  onClick: () => handleAnswerChange("wishedBefore", false),
                  children: "No"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Share more thoughts? (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                placeholder: "What was your impression?",
                rows: 2,
                onChange: (e) => handleAnswerChange("feedbackText", e.target.value)
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pulse-form", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "What went wrong?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "options-list", children: ["Buggy", "Confusing", "Didn't solve problem"].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `option-btn ${answers.whatWentWrong === opt ? "active" : ""}`,
                onClick: () => handleAnswerChange("whatWentWrong", opt),
                children: opt
              },
              opt
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "One thing to fix?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                placeholder: "Tell us what to improve...",
                rows: 2,
                onChange: (e) => handleAnswerChange("feedbackText", e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "btn-primary pulse-submit",
            disabled: submitting,
            onClick: handleSubmit,
            children: submitting ? "Sending..." : "Submit Feedback"
          }
        )
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pulse-success animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "success-icon-wrapper", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconCheckAnimated, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Thank You!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your feedback helps us build better." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "btn-secondary pulse-close", children: "Close" })
      ] })
    ] })
  ] });
}
const styles = `
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-sans);
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light);
    background: var(--surface-primary);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .logo-text {
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .logo-text .highlight {
    color: var(--accent);
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .icon-btn:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
  }

  /* Avatar & User Menu */
  .user-menu-container {
    position: relative;
  }

  .avatar-btn {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-default);
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    background: var(--surface-secondary);
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-secondary);
  }

  .menu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 240px;
    background: var(--surface-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    z-index: 50;
    animation: fadeInDown 0.15s var(--ease-out);
  }

  .menu-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
  }

  .menu-avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .menu-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .menu-user-info {
    display: flex;
    flex-direction: column;
  }

  .menu-name {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .menu-email {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  .menu-divider {
    height: 1px;
    background: var(--border-light);
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    background: transparent;
    border: none;
    font-size: var(--text-sm);
    color: var(--text-primary);
    cursor: pointer;
    text-align: left;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .menu-item:hover {
    background: var(--surface-hover);
  }

  .menu-item svg {
    color: var(--text-tertiary);
  }

  /* Main */
  .main {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  /* Mode Toggle */
  .mode-toggle {
    display: inline-flex;
    padding: 3px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-lg);
  }

  .mode-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .mode-btn:hover {
    color: var(--text-secondary);
  }

  .mode-btn.active {
    background: var(--surface-primary);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  .content-area {
    flex: 1;
    overflow: auto;
    padding: 12px 16px; /* Reduced top padding */
    position: relative;
  }

  /* Prompts */
  .prompts-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 16px;
  }

  .prompt-card {
    display: flex;
    gap: 12px;
    padding: 14px;
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .prompt-card:hover {
    border-color: var(--border-default);
  }

  .prompt-index {
    width: 22px;
    height: 22px;
    border-radius: var(--radius-full);
    background: var(--grey-900);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    flex-shrink: 0;
  }

  [data-theme="dark"] .prompt-index {
    background: var(--grey-100);
    color: var(--grey-900);
  }

  .prompt-body {
    flex: 1;
    min-width: 0;
  }

  .prompt-text {
    margin: 0;
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--text-primary);
    word-break: break-word;
  }

  .prompt-card.placeholder {
    border-style: dashed;
    background: transparent;
    opacity: 0.8;
  }

  .prompt-card.placeholder.opacity-50 {
    opacity: 0.6;
  }

  .placeholder-text {
    color: var(--text-secondary);
    font-style: italic;
  }

  .placeholder-line {
    height: 10px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-sm);
    margin-bottom: 8px;
  }

  .w-3\\/4 { width: 75%; }
  .w-1\\/2 { width: 50%; }

  .empty-state-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .expand-btn {
    margin-top: 8px;
    padding: 0;
    background: transparent;
    border: none;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--highlight);
    cursor: pointer;
  }

  .expand-btn:hover {
    text-decoration: underline;
  }

  /* Summary */
  .summary-card {
    padding: 16px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
  }

  .summary-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .summary-text {
    margin: 0;
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--text-primary);
    white-space: pre-line;
    text-align: justify;
  }

  /* Stats Bar */
  .stats-bar {
    display: flex;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-light);
    transition: all 0.3s var(--ease-out);
    height: auto;
    opacity: 1;
    overflow: hidden;
  }

  .stats-bar.hidden {
    height: 0;
    padding: 0;
    opacity: 0;
    border-top: none;
  }

  .stat-badge {
    padding: 4px 10px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--text-secondary);
  }

  .stat-badge.warning {
    background: var(--error-surface);
    color: var(--error);
  }

  /* Action Bar */
  .action-bar {
    padding: 16px;
    border-top: 1px solid var(--border-light);
    background: var(--surface-primary);
  }

  .btn-primary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--grey-900);
    color: var(--white);
    border: none;
    border-radius: var(--radius-full);
    font-size: var(--text-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
  }

  [data-theme="dark"] .btn-primary {
    background: var(--white);
    color: var(--grey-900);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-primary.loading {
    pointer-events: none;
  }

  .btn-spinner {
    position: relative;
    width: 18px;
    height: 18px;
  }

  .spinner-ring {
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .secondary-actions {
    display: flex;
    gap: 8px;
  }

  .btn-secondary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 14px;
    background: var(--surface-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .btn-secondary:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .btn-secondary.success {
    border-color: var(--highlight);
    color: var(--highlight);
    background: var(--highlight-surface);
  }

  /* Bottom Navigation */
  .bottom-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 8px;
    border-top: 1px solid var(--border-light);
    background: var(--surface-primary);
  }

  .nav-right {
    display: flex;
    gap: 4px;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    padding: 4px 10px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--duration-fast) var(--ease-out);
    min-width: 0;
  }

  .nav-item:hover {
    color: var(--text-secondary);
  }

  .nav-item:active {
    transform: scale(0.95);
  }

  .nav-item.active {
    color: var(--text-primary);
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  .nav-profile {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .nav-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, -8px);
    background: #000000;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: var(--radius-md);
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: all 0.2s var(--ease-out);
    z-index: 1000;
    box-shadow: var(--shadow-md);
  }

  .has-tooltip {
    position: relative;
  }

  .tooltip-bottom {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 8px);
    background: #000000;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: var(--radius-md);
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: all 0.2s var(--ease-out);
    z-index: 1000;
    box-shadow: var(--shadow-md);
  }

  [data-theme="dark"] .tooltip-bottom {
    background: #000000;
    color: #ffffff;
    border: 1px solid var(--grey-800);
  }

  .has-tooltip:hover .tooltip-bottom {
    opacity: 1;
    transform: translate(-50%, 4px);
  }

  [data-theme="dark"] .nav-tooltip {
    background: #000000;
    color: #ffffff;
    border: 1px solid var(--grey-800);
  }

  .nav-item:hover .nav-tooltip,
  .nav-profile:hover .nav-tooltip {
    opacity: 1;
    transform: translate(-50%, -4px);
  }

  /* Note: .nav-item is already defined above - adding position: relative here */
  .nav-item {
    position: relative;
  }

  .nav-profile:hover {
    background: var(--surface-hover);
  }

  .nav-profile:active {
    transform: scale(0.97);
  }

  .nav-profile.active {
    background: var(--surface-secondary);
  }

  .nav-profile-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-secondary);
    color: var(--text-muted);
  }

  .nav-profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .nav-profile-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .nav-profile-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.2;
  }

  .nav-profile-tier {
    font-size: 10px;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* Floating Popups */

  .popup {
    position: fixed;
    bottom: 80px;
    min-width: 180px;
    max-width: calc(100% - 32px);
    background: var(--surface-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    z-index: 100;
    animation: popupIn 0.15s ease-out;
    display: flex;
    flex-direction: column;
  }

  .popup-left {
    left: 16px;
  }

  .popup-right {
    right: 16px;
  }

  .popup-history {
    width: 280px;
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  @keyframes popupIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light);
  }

  .popup-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .popup-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .popup-external-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
  }

  .popup-external-link:hover {
    color: var(--text-primary);
    background: var(--surface-hover);
  }

  .popup-clear {
    font-size: var(--text-xs);
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
  }

  .popup-clear:hover {
    color: var(--accent);
  }

  .popup-confirm {
    display: flex;
    gap: 6px;
  }

  .popup-confirm-btn {
    padding: 4px 8px;
    font-size: var(--text-xs);
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
    background: var(--surface-secondary);
    color: var(--text-secondary);
  }

  .popup-confirm-btn.danger {
    background: #ef4444;
    color: white;
  }

  .popup-body {
    padding: 12px 16px;
  }

  .popup-scroll {
    overflow-y: auto;
    max-height: 260px;
  }

  .popup-empty {
    color: var(--text-muted);
    font-size: var(--text-sm);
    text-align: center;
    padding: 20px 0;
  }

  .popup-user {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .popup-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--surface-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }

  .popup-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .popup-user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .popup-user-name {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .popup-user-email {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .popup-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    min-height: 40px;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .popup-btn.primary {
    background: var(--surface-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-default);
  }

  .popup-btn.primary:hover {
    background: var(--surface-hover);
  }

  .popup-btn.primary:active {
    transform: scale(0.98);
    background: var(--surface-secondary);
  }

  .popup-btn.primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .popup-btn.danger {
    background: transparent;
    color: #ef4444;
  }

  .popup-btn.danger:hover {
    background: #fef2f2;
  }

  [data-theme="dark"] .popup-btn.danger:hover {
    background: #450a0a;
  }

  .popup-history-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 0;
    background: none;
    border: none;
    border-bottom: 1px solid var(--border-light);
    cursor: pointer;
    text-align: left;
  }

  .popup-history-item:last-child {
    border-bottom: none;
  }

  .popup-history-item:hover {
    background: var(--surface-hover);
    margin: 0 -16px;
    padding: 10px 16px;
    width: calc(100% + 32px);
  }

  .popup-history-item:active {
    background: var(--surface-secondary);
    transform: scale(0.98);
  }

  .popup-history-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .popup-history-preview {
    font-size: var(--text-sm);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .popup-history-meta {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .popup-setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  .popup-setting-label {
    font-size: var(--text-sm);
    color: var(--text-primary);
  }

  .popup-setting-value {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .popup-select {
    padding: 6px 10px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-primary);
    cursor: pointer;
  }

  /* Empty State */
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    text-align: center;
  }

  .empty-illustration {
    margin-bottom: 20px;
    color: var(--text-muted);
  }

  .empty-title {
    margin: 0 0 6px;
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .empty-desc {
    margin: 0 0 20px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    max-width: 240px;
    line-height: var(--leading-relaxed);
  }

  .empty-action {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: var(--grey-900);
    color: var(--white);
    border: none;
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  [data-theme="dark"] .empty-action {
    background: var(--white);
    color: var(--grey-900);
  }

  .empty-action:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  /* Loading State */
  .loading-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .simple-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--surface-tertiary);
    border-top-color: var(--text-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  /* Error State */
  .error-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    text-align: center;
  }

  .error-icon {
    width: 52px;
    height: 52px;
    border-radius: var(--radius-2xl);
    background: var(--error-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: var(--error);
  }

  .error-title {
    margin: 0 0 6px;
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .error-desc {
    margin: 0 0 20px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    max-width: 240px;
    line-height: var(--leading-relaxed);
  }

  .error-action {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: var(--grey-900);
    color: var(--white);
    border: none;
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
  }

  [data-theme="dark"] .error-action {
    background: var(--white);
    color: var(--grey-900);
  }

  /* History */
  .history-container {
    padding: 16px;
  }

  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .history-title {
    margin: 0;
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
  }

  .clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--error);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .clear-btn:hover {
    background: var(--error-surface);
  }

  .history-group {
    margin-bottom: 20px;
  }

  .history-date {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
    padding-left: 2px;
  }

  .history-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px;
    margin-bottom: 6px;
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    text-align: left;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .history-item:hover {
    border-color: var(--border-default);
    background: var(--surface-hover);
  }

  .history-badge {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--surface-tertiary);
    color: var(--text-secondary);
  }

  .history-content {
    flex: 1;
    min-width: 0;
  }

  .history-preview {
    display: block;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .history-meta {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* Settings */
  .settings-container {
    padding: 16px;
  }

  .settings-section {
    margin-bottom: 24px;
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 8px 2px;
  }

  .settings-card {
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .account-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
  }

  .account-avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: var(--text-tertiary);
  }

  .account-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .account-info {
    flex: 1;
    min-width: 0;
  }

  .account-name {
    display: block;
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
  }

  .account-email {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .tier-badge {
    padding: 4px 8px;
    background: var(--grey-900);
    color: var(--white);
    border-radius: var(--radius-sm);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  [data-theme="dark"] .tier-badge {
    background: var(--white);
    color: var(--grey-900);
  }

  .setting-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
  }

  .setting-icon {
    width: 20px;
    height: 20px;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .setting-content {
    flex: 1;
    min-width: 0;
  }

  .setting-title {
    display: block;
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
  }

  .setting-title .highlight {
    color: var(--accent);
  }

  .setting-subtitle {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-tertiary);
  }

  .setting-select {
    padding: 6px 10px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-primary);
    cursor: pointer;
  }

  .toast.success {
    border: 1px solid var(--highlight);
    color: var(--highlight);
    background: var(--highlight-surface);
  }

  /* Toast */
  .toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--grey-900);
    color: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    font-size: var(--text-sm);
    font-weight: 500;
    z-index: 100;
    animation: toastFadeInUp 0.2s var(--ease-out);
  }

  @keyframes toastFadeInUp {
    from {
      opacity: 0;
      transform: translate(-50%, 8px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  @keyframes toastFadeOutDown {
    from {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    to {
      opacity: 0;
      transform: translate(-50%, 8px);
    }
  }

  .toast-exit {
    animation: toastFadeOutDown 0.2s var(--ease-out) forwards;
  }

  [data-theme="dark"] .toast {
    background: var(--white);
    color: var(--grey-900);
  }

  /* Animated checkmark */
  .check-animated polyline {
    stroke-dasharray: 24;
    stroke-dashoffset: 0;
    animation: checkmark 0.3s ease-out;
  }

  @keyframes checkmark {
    from { stroke-dashoffset: 24; }
    to { stroke-dashoffset: 0; }
  }

  /* Nav Avatar */
  .nav-avatar {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full);
    object-fit: cover;
  }

  /* Profile View */
  .profile-container {
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 32px;
  }

  .profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 16px;
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-secondary);
  }

  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-name {
    margin: 0 0 4px;
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
  }

  .profile-email {
    margin: 0 0 12px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .profile-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .profile-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .profile-action-btn:hover {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .profile-action-btn.upgrade {
    background: var(--grey-900);
    border-color: var(--grey-900);
    color: var(--white);
  }

  [data-theme="dark"] .profile-action-btn.upgrade {
    background: var(--white);
    border-color: var(--white);
    color: var(--grey-900);
  }

  .profile-action-btn.signout {
    color: var(--error);
  }

  .profile-action-btn.signout:hover {
    background: var(--error-surface);
  }

  .profile-guest {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px;
  }

  .profile-guest-icon {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-full);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: var(--text-muted);
  }

  .profile-guest-title {
    margin: 0 0 8px;
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .profile-guest-desc {
    margin: 0 0 24px;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    max-width: 240px;
    line-height: var(--leading-relaxed);
  }

  .profile-signin-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    background: var(--surface-primary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .profile-signin-btn:hover {
    background: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .profile-signin-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .profile-signin-btn.loading {
    background: var(--surface-secondary);
  }

  .profile-signin-btn.success {
    background: #10b981;
    border-color: #10b981;
    color: white;
  }

  .profile-signin-btn.error {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-default);
    border-top-color: var(--accent, var(--highlight));
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .login-error {
    margin-bottom: 12px;
    padding: 10px 14px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: var(--radius-md);
    color: #dc2626;
    font-size: var(--text-sm);
    text-align: center;
  }

  [data-theme="dark"] .login-error {
    background: #450a0a;
    border-color: #7f1d1d;
    color: #fca5a5;
  }

  /* Extract Button Pulse Rings */
  .extract-btn-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }

  .extract-btn-wrapper .btn-primary {
    margin-bottom: 0;
  }

  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border: 2px solid var(--grey-400);
    border-radius: var(--radius-xl);
    transform: translate(-50%, -50%);
    opacity: 0;
    pointer-events: none;
  }

  .extract-btn-wrapper.pulsing .pulse-ring {
    animation: pulseRing 2s ease-out infinite;
  }

  .pulse-ring.pulse-1 { animation-delay: 0s; }
  .pulse-ring.pulse-2 { animation-delay: 0.4s; }
  .pulse-ring.pulse-3 { animation-delay: 0.8s; }

  @keyframes pulseRing {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.15);
      opacity: 0;
    }
  }

  /* Sparkles */
  .sparkles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sparkle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--grey-400);
    border-radius: 50%;
    animation: sparkleAnim 0.8s ease-out forwards;
  }

  .sparkle.s1 { top: 30%; left: 35%; animation-delay: 0s; }
  .sparkle.s2 { top: 25%; left: 55%; animation-delay: 0.1s; }
  .sparkle.s3 { top: 40%; left: 65%; animation-delay: 0.15s; }
  .sparkle.s4 { top: 55%; left: 60%; animation-delay: 0.2s; }
  .sparkle.s5 { top: 60%; left: 40%; animation-delay: 0.1s; }
  .sparkle.s6 { top: 45%; left: 30%; animation-delay: 0.05s; }

  @keyframes sparkleAnim {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: scale(1.5) rotate(180deg);
      opacity: 1;
    }
    100% {
      transform: scale(0) rotate(360deg) translateY(-30px);
      opacity: 0;
    }
  }

  /* Platform Logo in History */
  .history-platform {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    background: var(--surface-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--text-secondary);
  }

  .history-content-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .history-mode-tag {
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    flex-shrink: 0;
  }

  .history-mode-tag.raw {
    background: var(--surface-tertiary);
    color: var(--text-secondary);
  }

  .history-mode-tag.summary {
    background: var(--highlight-surface);
    color: var(--highlight);
  }

  /* Pulse Check Styles */
  .pulse-check-popup {
    width: 320px;
  }
  
  .pulse-question {
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-primary);
  }
  
  .sentiment-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .sentiment-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    background: var(--surface-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .sentiment-btn:hover {
    background: var(--surface-tertiary);
    border-color: var(--text-primary);
    transform: translateY(-1px);
  }
  
  .sentiment-emoji {
    font-size: 24px;
    margin-bottom: 4px;
    transition: transform 0.2s;
  }
  
  .sentiment-btn:hover .sentiment-emoji {
    transform: scale(1.1);
  }
  
  .sentiment-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  .sentiment-btn:hover .sentiment-label {
    color: var(--text-primary);
  }
  
  .pulse-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .form-group label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--text-primary);
  }
  
  .toggle-group {
    display: flex;
    gap: 8px;
  }
  
  .toggle-btn {
    flex: 1;
    padding: 6px;
    font-size: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    background: var(--surface-primary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .toggle-btn:hover {
    background: var(--surface-secondary);
  }
  
  .toggle-btn.active {
    background: var(--text-primary);
    color: var(--surface-primary);
    border-color: var(--text-primary);
  }
  
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .option-btn {
    text-align: left;
    padding: 8px 12px;
    font-size: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    background: var(--surface-primary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .option-btn:hover {
    background: var(--surface-secondary);
  }
  
  .option-btn.active {
    background: var(--surface-secondary);
    border-color: var(--text-primary);
    color: var(--text-primary);
    font-weight: 500;
  }
  
  .pulse-form textarea {
    width: 100%;
    padding: 8px;
    font-size: 12px;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    background: var(--surface-secondary);
    color: var(--text-primary);
    resize: none;
    outline: none;
  }
  
  .pulse-form textarea:focus {
    border-color: var(--text-primary);
    background: var(--surface-primary);
  }
  
  .pulse-submit {
    width: 100%;
    margin-top: 8px;
  }
  
  .pulse-success {
    text-align: center;
    padding: 20px 0;
  }
  
  .success-icon-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
    color: var(--success);
  }
  
  .pulse-success h3 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .pulse-success p {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
  
  .pulse-close {
    width: 100%;
  }

  /* Floating Actions */
  .floating-actions {
    position: sticky;
    top: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    height: 0; /* Don't take up space */
    z-index: 100;
    pointer-events: none;
  }

  .floating-copy-btn {
    pointer-events: auto;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition: all 0.2s;
    margin-top: 4px; /* Slight offset from top */
  }

  .floating-copy-btn:hover {
    border-color: var(--text-primary);
    color: var(--text-primary);
    transform: scale(1.05);
  }

  .floating-copy-btn.success {
    background: var(--highlight);
    border-color: var(--highlight);
    color: var(--white);
  }

  /* Platform Launchpad */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px 20px;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
    background: var(--surface-secondary);
    border-radius: var(--radius-2xl);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-tertiary);
    margin-bottom: 20px;
  }

  .empty-state h2 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .empty-desc {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 32px;
    max-width: 280px;
  }

  .platform-launchpad {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 320px;
  }

  .platform-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: var(--surface-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-xl);
    text-decoration: none;
    color: var(--text-primary);
    transition: all 0.2s;
  }

  .platform-link:hover {
    border-color: var(--text-primary);
    background: var(--surface-hover);
    transform: translateY(-2px);
  }

  .platform-link-logo {
    color: var(--text-secondary);
  }

  .platform-link span {
    font-size: 12px;
    font-weight: 600;
  }

  .empty-action {
    margin-top: 20px;
  }

  /* Sticky Action Bar */
  .action-bar-sticky {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 16px 16px;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-light);
    z-index: 100;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);
  }
`;
class TelemetryService {
  constructor() {
    __publicField(this, "queue", []);
    __publicField(this, "enabled", true);
    if (typeof window !== "undefined" || typeof self !== "undefined") {
      setInterval(() => this.flush(), 6e4);
    }
  }
  track(event, data = {}) {
    if (!this.enabled) return;
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
    const events = [...this.queue];
    this.queue = [];
    try {
      const { collection, addDoc } = await __vitePreload(async () => {
        const { collection: collection2, addDoc: addDoc2 } = await import("./vendor.js").then((n) => n.h);
        return { collection: collection2, addDoc: addDoc2 };
      }, true ? [] : void 0, import.meta.url);
      const { getDb } = await __vitePreload(async () => {
        const { getDb: getDb2 } = await import("./firebase.js").then((n) => n.l);
        return { getDb: getDb2 };
      }, true ? __vite__mapDeps([0,1]) : void 0, import.meta.url);
      const db = await getDb();
      const stored = await chrome.storage.session.get("firebase_current_user_id");
      const userId = stored.firebase_current_user_id || "anonymous";
      const telemetryRef = collection(db, "telemetry");
      await addDoc(telemetryRef, {
        userId,
        events,
        sentAt: Date.now()
      });
    } catch (error) {
      if (events.length < 100) {
        this.queue = [...events, ...this.queue].slice(0, 100);
      }
    }
  }
  setEnabled(enabled) {
    this.enabled = enabled;
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
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
);
