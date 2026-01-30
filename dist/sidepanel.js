const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./firebase.js","./vendor.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "./index.js";
import { r as reactExports, j as jsxRuntimeExports, c as client, R as React } from "./vendor.js";
import { g as getQuotas, _ as __vitePreload } from "./firebase.js";
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
      const { checkUserTier: checkUserTier2 } = await import("./firebase.js").then((n) => n.f);
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
const IconUser = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "7", r: "4" })
] });
const IconHistory = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) });
const IconSettings = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" })
] });
function AshokApp() {
  const [mode, setMode] = reactExports.useState("raw");
  const [isExpanded, setIsExpanded] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState({ supported: false, platform: null });
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [user, setUser] = reactExports.useState(null);
  const [tier, setTier] = reactExports.useState("guest");
  const portRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const port = chrome.runtime.connect({ name: "sidepanel" });
    portRef.current = port;
    port.onMessage.addListener((message) => {
      if (message.action === "EXTRACTION_RESULT" || message.action === "EXTRACTION_FROM_PAGE_RESULT") {
        const res = message.result;
        setResult(res);
        setLoading(false);
        setIsExpanded(true);
      } else if (message.action === "STATUS_RESULT") {
        setStatus({ supported: message.supported, platform: message.platform });
      } else if (message.action === "ERROR") {
        setLoading(false);
        setError(message.error);
        setIsExpanded(true);
      }
    });
    port.postMessage({ action: "GET_STATUS" });
    initializeAuth().then((state) => {
      setUser(state.user);
      setTier(state.tier);
    });
    return () => {
      port.disconnect();
    };
  }, []);
  const handleGenerate = () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setIsExpanded(true);
    if (portRef.current) {
      portRef.current.postMessage({ action: "EXTRACT_PROMPTS", mode });
    }
  };
  const handleBack = () => {
    setIsExpanded(false);
    setResult(null);
    setLoading(false);
    setError(null);
  };
  const handleCopy = async () => {
    if (!result) return;
    const text = result.prompts.map((p) => p.content).join("\n\n");
    await navigator.clipboard.writeText(text);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "main-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `action-island ${isExpanded ? "expanded" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toggle-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `mode-btn ${mode === "raw" ? "active" : ""}`,
              onClick: () => {
                if (!loading) setMode("raw");
              },
              children: "Extract"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `mode-btn ${mode === "summary" ? "active" : ""}`,
              onClick: () => {
                if (!loading) setMode("summary");
              },
              children: "summarize"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `controls-row ${isExpanded ? "visible" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-btn", onClick: handleBack, children: "Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-btn", children: "Edit" })
        ] }),
        isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `prompts-area ${isExpanded ? "visible" : ""}`, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loader-minimal" }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 20, textAlign: "center", color: "red" }, children: error }) : result ? result.prompts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prompt-box", children: p.content }, i)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 20, textAlign: "center", opacity: 0.5 }, children: "..." }) }),
        isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "action-buttons-container", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dual-btn", onClick: handleGenerate, children: "Re-Generate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dual-btn", onClick: handleCopy, children: "Copy" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "generate-btn-lg",
            onClick: handleGenerate,
            disabled: !status.supported,
            children: "Generate"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `upgrade-pill ${isExpanded ? "visible" : ""}`, children: "Upgrade" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "app-footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer-profile-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "footer-avatar", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, alt: "u" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconUser, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer-user-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "footer-name", children: (user == null ? void 0 : user.name) || "Guest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "footer-badge", children: tier })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "footer-icon-btn", title: "History", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconHistory, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "footer-icon-btn", title: "Settings", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconSettings, {}) })
      ] })
    ] })
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
        const { getDb: getDb2 } = await import("./firebase.js").then((n) => n.f);
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
