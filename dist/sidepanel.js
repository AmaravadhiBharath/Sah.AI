const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./firebase.js","./vendor.js"])))=>i.map(i=>d[i]);
import "./modulepreload-polyfill.js";
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
  if (error.includes("timeout")) return "Request took too long. Please try again.";
  if (error.includes("empty")) return "No content to process. Start a conversation first.";
  if (error.includes("quota") || error.includes("limit")) return "Daily limit reached. Upgrade for more.";
  return error.length > 100 ? error.slice(0, 100) + "..." : error;
}
function App() {
  const [mode, setMode] = reactExports.useState("raw");
  const [appState, setAppState] = reactExports.useState("empty");
  const [prompts, setPrompts] = reactExports.useState([]);
  const [summary, setSummary] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [stats, setStats] = reactExports.useState({ prompts: 0, characters: 0, elapsed: 0 });
  const [platform, setPlatform] = reactExports.useState(null);
  const [isSupported, setIsSupported] = reactExports.useState(false);
  const [selectedPrompts, setSelectedPrompts] = reactExports.useState(/* @__PURE__ */ new Set());
  const [user, setUser] = reactExports.useState(null);
  const [tier, setTier] = reactExports.useState("guest");
  const portRef = reactExports.useRef(null);
  const modeRef = reactExports.useRef(mode);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  const handlePortMessage = reactExports.useCallback((message) => {
    var _a, _b;
    console.log("[AppMaterial] Received message:", message.action);
    switch (message.action) {
      case "STATUS_RESULT":
        setIsSupported(message.supported);
        setPlatform(message.platform);
        break;
      case "EXTRACTION_RESULT":
      case "EXTRACTION_FROM_PAGE_RESULT":
        const res = message.result;
        setPrompts(res.prompts);
        if (modeRef.current === "summary" && res.prompts.length > 0) {
          (_a = portRef.current) == null ? void 0 : _a.postMessage({ action: "SUMMARIZE_PROMPTS", prompts: res.prompts });
        } else {
          setAppState("results");
          if (timerRef.current) clearInterval(timerRef.current);
        }
        break;
      case "SUMMARY_RESULT":
        if (message.success && ((_b = message.result) == null ? void 0 : _b.summary)) {
          setSummary(message.result.summary);
        } else {
          setError(friendlyError(message.error || "Summary failed"));
        }
        setAppState("results");
        if (timerRef.current) clearInterval(timerRef.current);
        break;
      case "ERROR":
        setError(friendlyError(message.error));
        setAppState("empty");
        if (timerRef.current) clearInterval(timerRef.current);
        break;
    }
  }, []);
  reactExports.useEffect(() => {
    initializeAuth().then((state) => {
      setUser(state.user);
      setTier(state.tier);
    });
    const unsubAuth = subscribeToAuthChanges((newUser) => {
      setUser(newUser);
    });
    const port = chrome.runtime.connect({ name: "sidepanel" });
    portRef.current = port;
    port.onMessage.addListener(handlePortMessage);
    port.postMessage({ action: "GET_STATUS" });
    return () => {
      unsubAuth();
      port.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handlePortMessage]);
  const handleGenerate = () => {
    var _a;
    if (!isSupported) {
      setError("Please navigate to ChatGPT, Claude, or Gemini to extract prompts.");
      return;
    }
    setAppState("loading");
    setError(null);
    setSummary(null);
    setPrompts([]);
    const startTime = Date.now();
    setStats({ prompts: 0, characters: 0, elapsed: 0 });
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1e3;
      setStats((prev) => ({
        ...prev,
        elapsed
      }));
    }, 100);
    (_a = portRef.current) == null ? void 0 : _a.postMessage({
      action: "EXTRACT_PROMPTS",
      mode
    });
  };
  const handleBack = () => {
    setAppState("empty");
    setPrompts([]);
    setSummary(null);
    setError(null);
    setSelectedPrompts(/* @__PURE__ */ new Set());
  };
  const handleCopy = () => {
    const textToCopy = summary || prompts.map((p) => p.content).join("\n\n");
    navigator.clipboard.writeText(textToCopy);
  };
  const togglePromptSelection = (index) => {
    const newSelected = new Set(selectedPrompts);
    if (newSelected.has(index)) newSelected.delete(index);
    else newSelected.add(index);
    setSelectedPrompts(newSelected);
  };
  const getPlatformName = (p) => {
    if (!p) return null;
    if (p === "chatgpt") return "ChatGPT";
    if (p === "claude") return "Claude";
    if (p === "gemini") return "Gemini";
    return p.charAt(0).toUpperCase() + p.slice(1);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-container", children: [
    appState === "empty" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-flex-column md-flex-center md-gap-2xl md-animate-fade-in", style: { flex: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-segmented-button", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `md-segment ${mode === "raw" ? "active" : ""}`, onClick: () => setMode("raw"), children: "Extract" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `md-segment ${mode === "summary" ? "active" : ""}`, onClick: () => setMode("summary"), children: "summarize" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md-filled-button", onClick: handleGenerate, disabled: !isSupported, children: "Generate" }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md-caption md-mt-md", style: { color: "var(--md-error)" }, children: error })
    ] }),
    appState === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-flex-column md-gap-3xl md-animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md-flex-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-segmented-button", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `md-segment ${mode === "raw" ? "active" : ""}`, children: "Extract" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `md-segment ${mode === "summary" ? "active" : ""}`, children: "summarize" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-flex-column md-gap-md md-text-center", style: { marginTop: "80px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md-body", children: "loading..." }),
        platform && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-label", children: [
          getPlatformName(platform),
          " detected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-flex-column md-gap-xs md-mt-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-body", children: [
            stats.prompts,
            " Prompts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-body", children: [
            Math.floor(stats.elapsed * 700),
            " char"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-body", children: [
            stats.elapsed.toFixed(1),
            "sec.."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md-flex-center md-mt-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md-filled-button", disabled: true, children: "Generating" }) })
    ] }),
    appState === "results" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-flex-column md-gap-2xl md-animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md-flex-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-segmented-button", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `md-segment ${mode === "raw" ? "active" : ""}`, children: "Extract" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `md-segment ${mode === "summary" ? "active" : ""}`, children: "summarize" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md-text-button", onClick: handleBack, children: "Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md-text-button", children: "Edit" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md-flex-column md-gap-md", children: (summary ? [{ content: summary, index: 1 }] : prompts).map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-number", children: i + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "card-checkbox-label", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md-caption", children: "checkbox" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedPrompts.has(i), onChange: () => togglePromptSelection(i) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md-body", style: { paddingRight: "20px" }, children: p.content })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-flex-center md-gap-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md-outlined-button", onClick: handleGenerate, children: "Re-Generate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md-outlined-button", onClick: handleCopy, children: "copy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md-filled-button md-mt-lg", style: { background: "var(--md-surface-variant)", color: "var(--md-on-surface-variant)", boxShadow: "none" }, children: "upgrade" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "md-footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-footer-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md-avatar", children: (user == null ? void 0 : user.picture) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.picture, alt: "", style: { width: "100%", height: "100%", borderRadius: "50%" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "20px" }, children: "👤" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-footer-profile", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md-footer-name", children: ((user == null ? void 0 : user.name) || "Bharath Amaravadi").toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md-footer-badge", children: (tier || "Admin").charAt(0).toUpperCase() + (tier || "Admin").slice(1) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md-footer-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md-icon-button", title: "Settings", children: "⚙️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md-icon-button", title: "History", children: "🕒" })
      ] })
    ] })
  ] });
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
