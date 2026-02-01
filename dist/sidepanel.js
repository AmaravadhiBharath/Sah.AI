const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./firebase.js","./vendor.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "./modulepreload-polyfill.js";
import { r as reactExports, j as jsxRuntimeExports, c as client } from "./vendor.js";
import { _ as __vitePreload, s as setCurrentUser, a as signInToFirebase, b as saveUserProfile, c as signOutFromFirebase, g as getQuotas, d as getHistoryFromCloud, m as mergeHistory, e as saveHistoryToCloud } from "./firebase.js";
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
  const user = await getStoredUser();
  const used = await getUsageCount();
  loadQuotas().catch(console.error);
  return {
    user,
    tier: "free",
    // Default safe tier until verified
    usage: { used, limit: 10 },
    isLoading: false
  };
}
function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (seconds < 60) return "Extracted just now";
  if (minutes < 60) return `Extracted ${minutes}m ago`;
  if (hours < 24) return `Extracted ${hours}h ago`;
  const date = new Date(timestamp);
  const today = /* @__PURE__ */ new Date();
  const yesterday = /* @__PURE__ */ new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Extracted yesterday";
  return `Extracted ${date.toLocaleDateString(void 0, { month: "short", day: "numeric" })}`;
}
function KaboomApp() {
  const [user, setUser] = reactExports.useState(null);
  const [extractionResult, setExtractionResult] = reactExports.useState(null);
  const [summary, setSummary] = reactExports.useState(null);
  const [mode, setMode] = reactExports.useState("raw");
  const [loading, setLoading] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState({ supported: false, platform: null });
  const [selectedPrompts, setSelectedPrompts] = reactExports.useState([]);
  const [copyStatus, setCopyStatus] = reactExports.useState("idle");
  const portRef = reactExports.useRef(null);
  const [extractionTime, setExtractionTime] = reactExports.useState(null);
  const [liveTime, setLiveTime] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(0);
  const timerRef = reactExports.useRef(null);
  const [currentPlatformIndex, setCurrentPlatformIndex] = reactExports.useState(0);
  const platforms = ["ChatGPT", "Claude", "Gemini", "Perplexity", "DeepSeek", "Lovable", "Bolt.new", "Cursor", "Meta AI"];
  const [viewingHistory, setViewingHistory] = reactExports.useState(false);
  const [isHistoryDetail, setIsHistoryDetail] = reactExports.useState(false);
  const [historyItems, setHistoryItems] = reactExports.useState([]);
  const [progressMessage, setProgressMessage] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlatformIndex((prev) => (prev + 1) % platforms.length);
    }, 1e3);
    return () => clearInterval(interval);
  }, []);
  const [showPopup, setShowPopup] = reactExports.useState(false);
  reactExports.useEffect(() => {
    initializeAuth().then((state) => {
      setUser(state.user);
    });
    const unsubscribe = subscribeToAuthChanges(async (newUser) => {
      setUser(newUser);
      if (newUser) {
        setShowPopup(false);
        try {
          const cloudHistory = await getHistoryFromCloud(newUser.id);
          chrome.storage.local.get(["extractionHistory"], (result) => {
            const localHistory = result.extractionHistory || [];
            const merged = mergeHistory(localHistory, cloudHistory);
            chrome.storage.local.set({ extractionHistory: merged });
            setHistoryItems(merged);
          });
        } catch (e) {
          console.error("Initial cloud sync failed:", e);
        }
      }
    });
    chrome.storage.local.get(["extractionHistory"], async (result) => {
      let localHistory = result.extractionHistory || [];
      if (result.extractionHistory) {
        const sorted = result.extractionHistory.sort((a, b) => b.timestamp - a.timestamp);
        setHistoryItems(sorted);
      }
      const authState = await initializeAuth();
      if (authState.user) {
        try {
          const cloudHistory = await getHistoryFromCloud(authState.user.id);
          const merged = mergeHistory(localHistory, cloudHistory);
          chrome.storage.local.set({ extractionHistory: merged });
          setHistoryItems(merged);
        } catch (e) {
          console.error("Background cloud sync failed:", e);
        }
      }
    });
    const port = chrome.runtime.connect({ name: "sidepanel" });
    portRef.current = port;
    const messageListener = (msg) => {
      var _a;
      if (msg.action === "STATUS_RESULT") {
        setStatus({ supported: msg.supported, platform: msg.platform });
      } else if (msg.action === "EXTRACTION_RESULT" || msg.action === "EXTRACTION_FROM_PAGE_RESULT") {
        setExtractionResult(msg.result);
        setSelectedPrompts(msg.result.prompts.map((_, i) => i));
        setLoading(false);
        setProgressMessage(null);
        setMode(msg.mode || "raw");
        setSummary(null);
        if (msg.mode === "summary") {
          setLoading(true);
          setProgressMessage("Summarizing with AI...");
          port.postMessage({
            action: "SUMMARIZE_PROMPTS",
            prompts: msg.result.prompts
          });
        }
        if (startTimeRef.current && msg.mode !== "summary") {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          const duration = (Date.now() - startTimeRef.current) / 1e3;
          setExtractionTime(parseFloat(duration.toFixed(1)));
        }
        const newItem = {
          id: Date.now().toString(),
          platform: msg.result.platform,
          promptCount: msg.result.prompts.length,
          mode: msg.mode || "raw",
          timestamp: Date.now(),
          prompts: msg.result.prompts,
          preview: ((_a = msg.result.prompts[0]) == null ? void 0 : _a.content.slice(0, 100)) || ""
        };
        chrome.storage.local.get(["extractionHistory"], (result) => {
          const existingHistory = result.extractionHistory || [];
          const updatedHistory = [newItem, ...existingHistory].slice(0, 100);
          chrome.storage.local.set({ extractionHistory: updatedHistory });
          setHistoryItems(updatedHistory);
          if (user) {
            saveHistoryToCloud(user.id, newItem).catch((e) => console.error("Cloud save failed:", e));
          }
        });
      } else if (msg.action === "SUMMARY_RESULT") {
        if (msg.success) {
          if (startTimeRef.current && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            const duration = (Date.now() - startTimeRef.current) / 1e3;
            setExtractionTime(parseFloat(duration.toFixed(1)));
          }
          setSummary(msg.result.summary);
          setMode("summary");
          chrome.storage.local.get(["extractionHistory"], (result) => {
            const existingHistory = [...result.extractionHistory || []];
            if (existingHistory.length > 0) {
              existingHistory[0].summary = msg.result.summary;
              existingHistory[0].mode = "summary";
              chrome.storage.local.set({ extractionHistory: existingHistory });
              setHistoryItems(existingHistory);
              if (user) {
                saveHistoryToCloud(user.id, existingHistory[0]).catch((e) => console.error("Cloud save failed:", e));
              }
            }
          });
        } else {
          alert("Summarization failed: " + (msg.error || "Unknown error"));
          setMode("raw");
        }
        setLoading(false);
        setProgressMessage(null);
      } else if (msg.action === "EXTRACT_TRIGERED_FROM_PAGE") {
        setLoading(true);
        setProgressMessage(null);
        setMode(msg.mode || "raw");
        setSummary(null);
        startTimeRef.current = Date.now();
        setExtractionTime(null);
        setLiveTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          const d = (Date.now() - startTimeRef.current) / 1e3;
          setLiveTime(parseFloat(d.toFixed(1)));
        }, 100);
      } else if (msg.action === "PROGRESS") {
        setProgressMessage(msg.message);
      } else if (msg.action === "ERROR") {
        setLoading(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        alert(msg.error || "Extraction failed");
      }
    };
    port.onMessage.addListener(messageListener);
    port.postMessage({ action: "GET_STATUS" });
    return () => {
      port.onMessage.removeListener(messageListener);
      port.disconnect();
      unsubscribe();
    };
  }, []);
  const handleCopy = async () => {
    const text = extractionResult == null ? void 0 : extractionResult.prompts.filter((_, i) => selectedPrompts.includes(i)).map((p) => p.content).join("\n\n");
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab == null ? void 0 : activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, {
            action: "CONTENT_COPIED",
            content: text
          });
        }
      });
      setTimeout(() => setCopyStatus("idle"), 2e3);
    }
  };
  const togglePromptSelection = (index) => {
    setSelectedPrompts(
      (prev) => prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const handleExtract = (m = "raw") => {
    var _a;
    if (!status.supported) return;
    setLoading(true);
    setProgressMessage(null);
    setViewingHistory(false);
    setIsHistoryDetail(false);
    setMode(m);
    setSummary(null);
    setExtractionResult(null);
    startTimeRef.current = Date.now();
    setExtractionTime(null);
    setLiveTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const d = (Date.now() - startTimeRef.current) / 1e3;
      setLiveTime(parseFloat(d.toFixed(1)));
    }, 100);
    (_a = portRef.current) == null ? void 0 : _a.postMessage({ action: "EXTRACT_PROMPTS", mode: m });
  };
  const loadHistory = () => {
    chrome.storage.local.get(["extractionHistory"], (result) => {
      if (result.extractionHistory) {
        const sorted = result.extractionHistory.sort((a, b) => b.timestamp - a.timestamp);
        setHistoryItems(sorted);
      }
      setViewingHistory(true);
      setIsHistoryDetail(false);
      setExtractionResult(null);
    });
  };
  const openHistoryItem = (item) => {
    const result = {
      platform: item.platform,
      url: "",
      // Not stored in history item usually, or retrieval needed
      title: item.preview,
      // Using preview as title fallback
      prompts: item.prompts,
      extractedAt: item.timestamp
    };
    setExtractionResult(result);
    setSummary(null);
    setMode(item.mode || "raw");
    setSelectedPrompts(item.prompts.map((_, i) => i));
    setViewingHistory(false);
    setIsHistoryDetail(true);
  };
  const handleEarlyAccess = () => {
    if (!user) {
      alert("Please login with Google to request early access.");
      setShowPopup(false);
      return;
    }
    alert("Your request for early access has been recorded!");
    setShowPopup(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-app", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-main-card kb-animate", onClick: () => showPopup && setShowPopup(false), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-top-actions", onClick: (e) => e.stopPropagation(), children: [
        (extractionResult || viewingHistory) && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "kb-back-btn",
            onClick: () => {
              if (isHistoryDetail) {
                setViewingHistory(true);
                setIsHistoryDetail(false);
                setExtractionResult(null);
                setExtractionTime(null);
              } else {
                setViewingHistory(false);
                setIsHistoryDetail(false);
                setExtractionResult(null);
                setExtractionTime(null);
              }
            },
            title: "Back",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 12H5M12 19l-7-7 7-7" }) })
          }
        ),
        extractionTime !== null && !loading && !viewingHistory && !isHistoryDetail && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
          marginRight: "auto",
          /* Pushes everything else (profile) to the right */
          fontSize: 11,
          fontWeight: 500,
          color: "#86868b",
          display: "flex",
          alignItems: "center"
        }, children: [
          "Extracted in ",
          extractionTime,
          "s"
        ] }),
        isHistoryDetail && extractionResult && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          marginRight: "auto",
          fontSize: 11,
          fontWeight: 500,
          color: "#86868b",
          display: "flex",
          alignItems: "center"
        }, children: formatRelativeTime(extractionResult.extractedAt) }),
        viewingHistory && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          marginRight: "auto",
          fontSize: 11,
          fontWeight: 500,
          color: "#86868b",
          display: "flex",
          alignItems: "center"
        }, children: "History" }),
        user && !viewingHistory && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "kb-profile-btn",
            style: { marginRight: 8 },
            onClick: loadHistory,
            title: "History",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "12 6 12 12 16 14" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "kb-profile-btn", onClick: () => setShowPopup(!showPopup), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "7", r: "4" })
        ] }) }),
        showPopup && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999
              },
              onClick: () => setShowPopup(false)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-profile-popup", children: [
            user && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 12px 8px 12px", borderBottom: "1px solid #f0f0f0", marginBottom: 4 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 2 }, children: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#666", overflow: "hidden", textOverflow: "ellipsis" }, children: user.email })
            ] }),
            !user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "kb-popup-item", onClick: signInWithGoogle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" }) }),
              "Login with Google"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "kb-popup-item logout", onClick: () => {
              signOut();
              setShowPopup(false);
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" }) }),
              "Logout"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-popup-divider" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "kb-popup-item", onClick: handleEarlyAccess, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "22 4 12 14.01 9 11.01" })
              ] }),
              "Request Early Access"
            ] })
          ] })
        ] })
      ] }),
      !user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-login-container", style: { flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-login-logo", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "kb-login-title", children: "SahAI v1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "kb-login-sub", children: "Extract prompts from AI tools instantly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "kb-btn-pill", onClick: signInWithGoogle, style: { padding: "10px 32px" }, children: "Continue with Google" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-content", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "kb-spinner", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", style: { color: "#000" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", strokeOpacity: "0.1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2a10 10 0 0 1 10 10", strokeLinecap: "round" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: 13, color: "#999", fontVariantNumeric: "tabular-nums" }, children: [
          (progressMessage == null ? void 0 : progressMessage.includes("Summarizing")) ? "Summarizing.." : "Extracting..",
          liveTime.toFixed(1),
          " sec"
        ] }),
        progressMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
          fontSize: 12,
          color: "#000",
          fontWeight: 500,
          marginTop: 4,
          maxWidth: 200,
          textAlign: "center",
          lineHeight: 1.4,
          animation: "kb-fade-in 0.3s ease"
        }, children: progressMessage }),
        liveTime > 10 && !progressMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
          fontSize: 11,
          color: "#86868b",
          marginTop: -4,
          maxWidth: 180,
          textAlign: "center",
          lineHeight: 1.4,
          animation: "kb-fade-in 0.3s ease"
        }, children: "Lengthy conversation take bit longer" })
      ] }) : summary || extractionResult ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        mode === "summary" && summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-prompt-card selected", style: { background: "#f8f8f8", border: "1px solid #e0e0e0", color: "#000" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 700, color: "#86868b", marginBottom: 8, textTransform: "uppercase" }, children: "AI Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { whiteSpace: "pre-wrap", lineHeight: 1.5 }, children: summary })
        ] }),
        mode === "summary" && extractionResult && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 16, marginBottom: 8, fontSize: 11, fontWeight: 700, color: "#86868b", textTransform: "uppercase", textAlign: "center" }, children: "Raw Prompts" }),
        extractionResult && extractionResult.prompts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `kb-prompt-card ${selectedPrompts.includes(i) ? "selected" : ""}`,
            onClick: () => togglePromptSelection(i),
            children: [
              p.content,
              p.source === "keylog" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                fontSize: 9,
                fontWeight: 800,
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: 4,
                background: "#FEEED4",
                color: "#BC6C25"
              }, children: "Captured" }) })
            ]
          },
          i
        ))
      ] }) : viewingHistory ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-hist-list-container", style: { marginTop: 1 }, children: historyItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13, color: "#999", textAlign: "center", marginTop: 40 }, children: "No history yet." }) : historyItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-history-card", onClick: () => openHistoryItem(item), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-h-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-h-platform", children: item.platform }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-h-date", children: new Date(item.timestamp).toLocaleDateString(void 0, { month: "short", day: "numeric" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-h-preview", children: item.preview }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "kb-h-count", children: [
          item.promptCount,
          " prompts"
        ] })
      ] }, item.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 20 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13, color: "#999", lineHeight: 1.5, maxWidth: 220 }, children: status.supported ? `SahAI is connected to ${status.platform}.` : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Navigate to an AI chat like" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-fade-text", style: { color: "#000", fontSize: "1.2em" }, children: platforms[currentPlatformIndex] }, currentPlatformIndex)
        ] }) }),
        status.supported && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "kb-btn-pill", onClick: () => handleExtract("raw"), children: "Extract" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "kb-btn-pill", onClick: () => handleExtract("summary"), style: { background: "#fff", color: "#000", border: "1px solid #e0e0e0" }, children: "Summarize" })
        ] })
      ] }) }),
      user && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-card-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "kb-btn-pill",
          onClick: handleCopy,
          disabled: !extractionResult || selectedPrompts.length === 0,
          style: { opacity: !extractionResult || selectedPrompts.length === 0 ? 0.3 : 1 },
          children: copyStatus === "copied" ? "copied!" : "copy"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-app-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "kb-footer-text", children: "SahAI extracts and summarizes your conversations. Please double check outputs." }) })
  ] });
}
const root = client.createRoot(document.getElementById("root"));
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(KaboomApp, {}) })
);
