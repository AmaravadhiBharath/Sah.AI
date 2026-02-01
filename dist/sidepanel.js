const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./firebase.js","./vendor.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "./modulepreload-polyfill.js";
import { r as reactExports, j as jsxRuntimeExports, c as client } from "./vendor.js";
import { _ as __vitePreload, s as setCurrentUser, a as signOutFromFirebase, b as signInToFirebase, c as saveUserProfile, g as getQuotas, d as saveHistoryToCloud, e as getHistoryFromCloud, m as mergeHistory } from "./firebase.js";
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
const IconClock = ({ active }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: `kb-nav-icon ${active ? "active" : ""}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "12 6 12 12 16 14" })
] });
const IconSettings = ({ active }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: `kb-nav-icon ${active ? "active" : ""}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" })
] });
const IconBack = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 12H5M12 19l-7-7 7-7" }) });
const IconCopy = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
] });
function KaboomApp() {
  const [activeTab, setActiveTab] = reactExports.useState("home");
  const [user, setUser] = reactExports.useState(null);
  const [tier, setTier] = reactExports.useState("FREE");
  const [history, setHistory] = reactExports.useState([]);
  const [mode, setMode] = reactExports.useState("raw");
  const [extractionResult, setExtractionResult] = reactExports.useState(null);
  const [summary, setSummary] = reactExports.useState(null);
  const [, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [status, setStatus] = reactExports.useState({ supported: false, platform: null });
  const [historySearchQuery, setHistorySearchQuery] = reactExports.useState("");
  const [extractionStep, setExtractionStep] = reactExports.useState(1);
  const portRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const port = chrome.runtime.connect({ name: "sidepanel" });
    portRef.current = port;
    port.onMessage.addListener((msg) => {
      var _a;
      if (msg.action === "STATUS_RESULT") {
        setStatus({ supported: msg.supported, platform: msg.platform });
        if (msg.supported && !extractionResult && activeTab === "home") {
          handleStartExtraction();
        }
      } else if (msg.action === "EXTRACTION_RESULT") {
        setExtractionResult(msg.result);
        setLoading(false);
        setActiveTab("home");
        setExtractionStep(3);
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
        setActiveTab("home");
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
  }, [user, extractionResult]);
  const handleStartExtraction = () => {
    setActiveTab("processing");
    setExtractionStep(1);
    setLoading(true);
    setError(null);
    setTimeout(() => setExtractionStep(2), 800);
    setTimeout(() => setExtractionStep(3), 1600);
    if (portRef.current) {
      portRef.current.postMessage({ action: "EXTRACT_PROMPTS", mode: "raw" });
    }
  };
  const handleSummarize = () => {
    if (!extractionResult) return;
    setLoading(true);
    if (portRef.current) {
      portRef.current.postMessage({
        action: "SUMMARIZE_PROMPTS",
        prompts: extractionResult.prompts
      });
    }
  };
  const handleCopy = async () => {
    const text = summary || (extractionResult == null ? void 0 : extractionResult.prompts.map((p) => p.content).join("\n\n"));
    if (text) await navigator.clipboard.writeText(text);
  };
  const renderProcessing = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-content kb-animate kb-extract-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-extract-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "16 18 22 12 16 6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "8 6 2 12 8 18" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "kb-extract-title", children: "Extracting prompts" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "kb-extract-sub", children: "Analyzing conversation structure and tokenizing content." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-stats-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-stat-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-stat-label", children: "Elapsed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-stat-value", children: [
          "0.8",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, fontWeight: 500 }, children: "s" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-stat-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-stat-label", children: "Source" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-stat-value", children: status.platform || "Auto" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-stat-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-stat-label", children: "Found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-stat-value", style: { color: "#3A82F6" }, children: "--" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-step-list", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `kb-step-item ${extractionStep >= 1 ? "active" : ""} ${extractionStep > 1 ? "done" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-step-dot", children: extractionStep === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-step-dot-inner" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Detecting page" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `kb-step-item ${extractionStep >= 2 ? "active" : ""} ${extractionStep > 2 ? "done" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-step-dot", children: extractionStep === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-step-dot-inner" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reading conversation" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `kb-step-item ${extractionStep >= 3 ? "active" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-step-dot", children: extractionStep === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-step-dot-inner" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Processing content" }),
          extractionStep === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#3A82F6", fontWeight: 700 }, children: "IN PROGRESS" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "kb-btn-secondary", style: { marginTop: "auto" }, onClick: () => {
      setActiveTab("home");
      setLoading(false);
    }, children: "Stop Processing" })
  ] });
  const renderAccount = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-content kb-animate", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "kb-view-title", children: "Account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 24 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 100, height: 100, borderRadius: "50%", background: "#F9F9F9", border: "1px solid #EAEAEA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 500, color: "#999", overflow: "hidden" }, children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, style: { width: "100%" } }) : (user == null ? void 0 : user.name) ? user.name.split(" ").map((n) => n[0]).join("") : "JD" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 600 }, children: (user == null ? void 0 : user.email) || "email@example.com" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 700, color: "#3A82F6", textTransform: "uppercase", letterSpacing: 1, marginTop: 8 }, children: tier === "PRO" ? "PRO MEMBER" : "PREMIUM MEMBER" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-group-card", style: { marginTop: 32 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-list-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-list-label", children: "Manage Subscription" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: "rotate(180deg)", opacity: 0.3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconBack, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-list-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-list-label", children: "Billing History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: "rotate(180deg)", opacity: 0.3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconBack, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "kb-btn-primary", style: { marginTop: "auto" }, onClick: user ? signOut : signInWithGoogle, children: user ? "Log Out" : "Sign In" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginTop: 16 }, children: "Version 3.1.0" })
  ] });
  const renderSettings = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-content kb-animate", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "kb-view-title", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700, color: "#3A82F6", cursor: "pointer" }, children: "UPGRADE" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-section-label", children: "Preferences" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-section-label", style: { marginBottom: 8 }, children: "Theme" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-group-card", children: ["Light", "Dark", "System Default"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-list-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-list-label", children: t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 20, height: 20, borderRadius: "50%", border: "2px solid #EAEAEA", position: "relative" }, children: t === "Light" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 10, height: 10, borderRadius: "50%", background: "#3A82F6", position: "absolute", top: 3, left: 3 } }) })
      ] }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-section-label", style: { marginBottom: 8 }, children: "Automation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-group-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-list-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-list-label", children: "Auto-extract" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "#999" }, children: "On page load" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 40, height: 22, borderRadius: 100, background: "#EAEAEA", position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 2, left: 2, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" } }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "kb-btn-secondary", style: { marginTop: "auto" }, onClick: user ? signOut : void 0, children: "Sign Out" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginTop: 16 }, children: "Version 3.1.0" })
  ] });
  const renderHistory = () => {
    const filteredHistory = history.filter((item) => {
      const matchesSearch = item.preview.toLowerCase().includes(historySearchQuery.toLowerCase()) || item.platform.toLowerCase().includes(historySearchQuery.toLowerCase());
      return matchesSearch;
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-content kb-animate", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "kb-view-title", children: "History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-group-card", style: { display: "flex", alignItems: "center", padding: "0 12px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#999", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 21l-4.35-4.35" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search history...",
            style: { flex: 1, border: "none", padding: "16px 12px", fontSize: 15, outline: "none" },
            value: historySearchQuery,
            onChange: (e) => setHistorySearchQuery(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-section-label", children: "Recent Explorations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-group-card", children: filteredHistory.length > 0 ? filteredHistory.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-list-item", onClick: () => {
        setExtractionResult({ prompts: item.prompts, platform: item.platform, url: "", title: "", extractedAt: item.timestamp });
        setMode(item.mode);
        setSummary(item.summary || null);
        setActiveTab("home");
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-list-label", children: item.platform }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 12, color: "#999", marginTop: 4 }, children: [
            item.preview.slice(0, 50),
            "..."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "#999" }, children: new Date(item.timestamp).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-badge", style: { fontSize: 8, padding: "2px 6px" }, children: item.mode })
        ] })
      ] }, item.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 40, textAlign: "center", color: "#999" }, children: "No history items found." }) })
    ] });
  };
  const renderResult = () => {
    var _a;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-app kb-animate", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-top-bar", style: { borderBottom: "1px solid #F5F5F5" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "kb-back-btn", onClick: () => {
          setExtractionResult(null);
          setActiveTab("home");
          setSummary(null);
          setMode("raw");
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconBack, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-top-title", style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }, children: (extractionResult == null ? void 0 : extractionResult.title) || `Analysis of ${extractionResult == null ? void 0 : extractionResult.platform}...` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-content", style: { background: "#F9F9F9" }, children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 12, background: "#FEE2E2", color: "#B91C1C", borderRadius: 8, fontSize: 13, marginBottom: 16 }, children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-result-meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-badge-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-badge", style: { background: mode === "summary" ? "#FEEED4" : "white" }, children: mode === "summary" ? "Summary" : "Extract" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-badge", style: { color: "black" }, children: (extractionResult == null ? void 0 : extractionResult.platform) || "ChatGPT" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-date-label", children: (extractionResult == null ? void 0 : extractionResult.extractedAt) ? new Date(extractionResult.extractedAt).toLocaleDateString([], { month: "short", day: "numeric" }) : "Today" })
        ] }),
        mode === "raw" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "4px 12px 16px", background: "white", border: "1px solid var(--kb-outline)", borderRadius: 12, marginBottom: 16, display: "flex", justifyContent: "center", position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: -10, right: 10, background: "#3A82F6", color: "white", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 4 }, children: "PRO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSummarize, style: { background: "none", border: "none", color: "#666", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, paddingTop: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) }),
            "Summarize Extract"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: mode === "summary" && summary ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-prompt-card", style: { borderLeft: "4px solid #3A82F6" }, children: summary }) : extractionResult == null ? void 0 : extractionResult.prompts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-prompt-card", children: p.content }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 80 } }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "kb-btn-primary", onClick: handleCopy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconCopy, {}),
          "Copy"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-nav-user", onClick: () => setActiveTab("profile"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-nav-avatar", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, style: { width: "100%" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700 }, children: (user == null ? void 0 : user.name) ? user.name[0] : "AD" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-nav-name", children: ((_a = user == null ? void 0 : user.name) == null ? void 0 : _a.split(" ")[0]) || "Alex D." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-nav-links", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => setActiveTab("history"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconClock, { active: activeTab === "history" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => setActiveTab("settings"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconSettings, { active: activeTab === "settings" }) })
        ] })
      ] })
    ] });
  };
  const renderMainLayout = (content) => {
    var _a;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-app", children: [
      content,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-nav-user", onClick: () => setActiveTab("profile"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-nav-avatar", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, style: { width: "100%" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700 }, children: (user == null ? void 0 : user.name) ? user.name[0] : "AD" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-nav-name", children: ((_a = user == null ? void 0 : user.name) == null ? void 0 : _a.split(" ")[0]) || "Alex D." }),
            tier === "PRO" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, fontWeight: 700, color: "#3A82F6" }, children: "PREMIUM" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-nav-links", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => setActiveTab("history"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconClock, { active: activeTab === "history" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => setActiveTab("settings"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconSettings, { active: activeTab === "settings" }) })
        ] })
      ] })
    ] });
  };
  if (activeTab === "processing") return renderProcessing();
  if (activeTab === "profile") return renderMainLayout(renderAccount());
  if (activeTab === "settings") return renderMainLayout(renderSettings());
  if (activeTab === "history") return renderMainLayout(renderHistory());
  if (extractionResult && activeTab === "home") return renderResult();
  return renderMainLayout(
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-content kb-animate", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-group-card", style: { padding: 40, textAlign: "center", background: "white" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-extract-icon", style: { margin: "0 auto 24px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2v10m0 0l-3-3m3 3l3-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 18v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 20, fontWeight: 700, marginBottom: 8 }, children: "Ready to Extract" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 14, color: "#999", marginBottom: 24 }, children: "Navigate to a supported AI chat to begin." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "kb-btn-primary", onClick: handleStartExtraction, disabled: !status.supported, children: status.supported ? "Start Extraction" : "Unsupported Page" }),
        !status.supported && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#999", marginTop: 12 }, children: "Visit ChatGPT, Claude, or Gemini to use SahAI." })
      ] }),
      history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-section-label", children: "Recent Explorations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "kb-group-card", children: history.slice(0, 3).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kb-list-item", onClick: () => {
          setExtractionResult({ prompts: item.prompts, platform: item.platform, url: "", title: "", extractedAt: item.timestamp });
          setMode(item.mode);
          setSummary(item.summary || null);
          setActiveTab("home");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kb-list-label", children: item.platform }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 12, color: "#999", marginTop: 4 }, children: [
              item.preview.slice(0, 40),
              "..."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "#999" }, children: new Date(item.timestamp).toLocaleDateString([], { month: "short", day: "numeric" }) })
        ] }, item.id)) })
      ] })
    ] })
  );
}
const root = client.createRoot(document.getElementById("root"));
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(KaboomApp, {}) })
);
