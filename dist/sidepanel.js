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
const IconHome = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 22 9 12 15 12 15 22" })
] });
const IconSettings = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" })
] });
const IconUser = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "7", r: "4" })
] });
const HistoryView = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-inner", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", children: "Past Extractions" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state", children: "No history available yet." })
] });
const SettingsView = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-inner", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", children: "Settings" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-item", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Theme" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: "System" })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-item", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "App Version" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: "3.1.2" })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-item", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Support" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value link", children: "Get Help" })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-item", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "value", children: "Active" })
  ] })
] });
const ProfileView = ({ user, tier }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-inner", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", children: "Account Detail" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "profile-hero", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-avatar", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, alt: "u" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconUser, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-info", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-name", children: (user == null ? void 0 : user.name) || "Guest User" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hero-tier", children: tier })
    ] })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "usage-stats", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label", children: "Daily Usage" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-value", children: "24 / 50" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label", children: "Member Since" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-value", children: "Jan 2026" })
    ] })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "auth-action-btn", children: user ? "Sign Out" : "Sign In with Google" })
] });
function AshokApp() {
  const [view, setView] = reactExports.useState("home");
  const [configTab, setConfigTab] = reactExports.useState("history");
  const [mode, setMode] = reactExports.useState("raw");
  const [isExpanded, setIsExpanded] = reactExports.useState(false);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [selectedPrompts, setSelectedPrompts] = reactExports.useState(/* @__PURE__ */ new Set());
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
        setView("home");
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
  const handleDelete = () => {
    if (!result) return;
    if (selectedPrompts.size === 0) return;
    const remainingPrompts = result.prompts.filter((_, i) => !selectedPrompts.has(i));
    setResult({ ...result, prompts: remainingPrompts });
    setSelectedPrompts(/* @__PURE__ */ new Set());
  };
  const handleCopy = async () => {
    if (!result) return;
    const promptsToCopy = selectedPrompts.size > 0 ? result.prompts.filter((_, i) => selectedPrompts.has(i)) : result.prompts;
    const text = promptsToCopy.map((p) => p.content).join("\n\n");
    await navigator.clipboard.writeText(text);
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
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "toggle-nav-btn",
            onClick: () => openConfig("history"),
            title: "Go to Config",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconSettings, {})
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
      if (configTab === "history") content = /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryView, {});
      else if (configTab === "settings") content = /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsView, {});
      else content = /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileView, { user, tier });
    } else {
      content = /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loader-minimal" }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 20, textAlign: "center", color: "red" }, children: error }) : result ? result.prompts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
      )) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 20, textAlign: "center", opacity: 0.5 }, children: "..." }) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `view-content-anim 
                ${view === "home" ? "prompts-area" : ""} 
                ${view === "home" && isExpanded ? "visible" : ""}
            `, children: content });
  };
  const islandExpanded = isExpanded || view === "config";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: `main-content ${islandExpanded ? "expanded-view" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `action-island ${islandExpanded ? "expanded" : ""}`, children: [
        renderToggleRow(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `controls-row ${islandExpanded ? "visible" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-btn", onClick: handleBack, children: "Back" }),
          view === "home" && result ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `control-btn ${isEditing ? "primary" : ""}`,
              onClick: toggleEdit,
              children: isEditing ? "Done" : "Edit"
            }
          ) : view === "config" ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-btn primary", onClick: handleBack, children: "Save" }) : null
        ] }),
        islandExpanded && renderContentArea(),
        view === "home" && islandExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "action-buttons-container", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "dual-btn",
              onClick: isEditing ? handleDelete : handleGenerate,
              style: isEditing ? { color: "#ef4444", borderColor: "#ef4444" } : {},
              children: isEditing ? `Delete (${selectedPrompts.size})` : "Re-Generate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dual-btn", onClick: handleCopy, children: isEditing ? `Copy (${selectedPrompts.size})` : "Copy" })
        ] }),
        view === "home" && !islandExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "generate-btn-lg", onClick: handleGenerate, disabled: !status.supported, children: "Generate" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `upgrade-pill ${islandExpanded ? "visible" : ""}`, children: "Upgrade" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "app-footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "footer-profile-btn", onClick: () => openConfig("profile"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "footer-avatar-sm", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, alt: "u" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconUser, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer-user-stack", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "footer-name-min", children: (user == null ? void 0 : user.name) || "Guest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "footer-badge-min", children: tier })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "footer-status-area", children: status.platform && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "status-pill-active", title: `Connected to ${status.platform}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-dot" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "platform-name", children: status.platform })
      ] }) })
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
