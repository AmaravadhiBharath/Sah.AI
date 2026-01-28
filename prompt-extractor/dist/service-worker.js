const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./firebase.js","./vendor.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a;
import { _ as __vitePreload, h as getCurrentUserId, i as getDb, j as saveKeylogsToCloud } from "./firebase.js";
import { d as doc, i as increment } from "./vendor.js";
class CircuitBreaker {
  constructor(config) {
    __publicField(this, "state", "CLOSED");
    __publicField(this, "failures", 0);
    __publicField(this, "lastFailureTime", 0);
    __publicField(this, "successCount", 0);
    __publicField(this, "config");
    this.config = config;
  }
  async execute(fn) {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeout) {
        this.state = "HALF_OPEN";
        console.log("[CircuitBreaker] Attempting recovery (HALF_OPEN)");
      } else {
        throw new Error("Service temporarily unavailable - please try again");
      }
    }
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  onSuccess() {
    this.failures = 0;
    if (this.state === "HALF_OPEN") {
      this.successCount++;
      if (this.successCount >= 2) {
        this.state = "CLOSED";
        this.successCount = 0;
        console.log("[CircuitBreaker] Service recovered (CLOSED)");
      }
    }
  }
  onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    this.successCount = 0;
    if (this.failures >= this.config.failureThreshold) {
      this.state = "OPEN";
      console.error(`[CircuitBreaker] Circuit OPEN after ${this.failures} failures`);
    }
  }
  isHealthy() {
    return this.state === "CLOSED";
  }
}
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1e3,
  maxDelay: 1e4,
  backoffMultiplier: 2
};
const DEFAULT_CIRCUIT_CONFIG = {
  failureThreshold: 5,
  resetTimeout: 6e4
};
const backendCircuit = new CircuitBreaker(DEFAULT_CIRCUIT_CONFIG);
async function retryWithBackoff(fn, config = DEFAULT_RETRY_CONFIG, attempt = 1) {
  try {
    return await fn();
  } catch (error) {
    if (error.status === 429 || error.status === 401 || error.status === 403) {
      throw error;
    }
    if (attempt >= config.maxRetries) {
      console.error(`[Retry] All ${config.maxRetries} attempts failed`);
      throw error;
    }
    const delay = Math.min(
      config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1),
      config.maxDelay
    );
    console.warn(`[Retry] Attempt ${attempt}/${config.maxRetries} - waiting ${delay}ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, config, attempt + 1);
  }
}
async function fetchWithTimeout(url, options = {}, timeout = 3e4) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout / 1e3}s`);
    }
    throw error;
  }
}
async function resilientFetch(url, options = {}) {
  return backendCircuit.execute(async () => {
    return retryWithBackoff(async () => {
      const response = await fetchWithTimeout(url, options);
      if (!response.ok && response.status >= 500) {
        const error = new Error(`Server error: ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return response;
    });
  });
}
const BACKEND_URL = "https://tai-backend.amaravadhibharath.workers.dev";
const CONSOLIDATION_RULES = `[INTENT COMPILATION PROTOCOL v4.0 - ENTERPRISE]

CORE DIRECTIVE: Compile user intent into an actionable specification.
PHILOSOPHY: Include everything. Assume nothing. Resolve confusion.

═══════════════════════════════════════════════════════════════════════════════
SECTION A: OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════════════════

A1. FINAL STATE ONLY
- Output the resolved state of all requirements
- No temporal language: "initially", "later", "then", "changed to"
- No conversation narration
✗ "User first wanted blue, then green"
✓ "Color: green"

A2. SPECIFICATION FORMAT
- Output reads as a product specification
- Self-contained: executable by another person/AI
- No conversation references: "as discussed", "user said"

A3. STRUCTURAL COHERENCE
- Reads as if written once, not stitched
- Logical grouping by topic
- Professional, neutral language

═══════════════════════════════════════════════════════════════════════════════
SECTION B: ZERO INFORMATION LOSS (CRITICAL)
═══════════════════════════════════════════════════════════════════════════════

B1. INCLUDE EVERYTHING
- Every noun, constraint, requirement mentioned ONCE must appear
- Single mentions are equally important as repeated ones
- When in doubt: INCLUDE

B2. MULTIPLE OPTIONS = INCLUDE ALL
- "Make it blue" + "also consider green" = BOTH colors
- Never pick one when multiple are mentioned
- Never assume which is preferred
✓ "Colors: blue, green (both mentioned)"

B3. DEDUPLICATION
- Identical statements → merge into ONE complete version
- Keep the most complete/specific version
- Never shorten at cost of meaning

B4. NEGATIVE CONSTRAINTS
- Preserve exactly: "no", "don't", "never", "avoid", "without"
✓ "No gradients", "Avoid localStorage", "Don't use third-party"

B5. PRIORITY INDICATORS
- Preserve: "critical", "important", "must", "essential", "priority"
✓ "Performance is critical"

═══════════════════════════════════════════════════════════════════════════════
SECTION C: CONFLICT RESOLUTION
═══════════════════════════════════════════════════════════════════════════════

C1. TRUE CONFLICTS ONLY
- Same attribute, mutually exclusive values = conflict
- "Make blue" → "Make green" (can't be both) = latest wins
- "Make blue" → "add green accents" (can coexist) = include both

C2. LATEST WINS (FOR TRUE CONFLICTS)
- Latest explicit instruction takes precedence
- Remove earlier conflicting instruction completely

C3. SPECIFICITY OVERRIDE
- Specific overrides generic
- "Make colorful" → "Use blue and white only" = "Blue and white only"

C4. USER OVER AI
- User instructions override AI suggestions

═══════════════════════════════════════════════════════════════════════════════
SECTION D: INTERPRETATION
═══════════════════════════════════════════════════════════════════════════════

D1. IMPLICIT ACCEPTANCE
- Continued work without rejection = acceptance
- "yes", "ok", "do that" = confirmation

D2. INFORMAL TO FORMAL
- Convert casual language to specifications
✗ "The kid is class 5 I think"
✓ "Class level: 5"

D3. FILLER REMOVAL
- Remove: "I think", "maybe", "let's try"
- KEEP the intent within
✗ "I think we need auth" → remove entirely
✓ "I think we need auth" → "Authentication required"

D4. NO INFERENCE
- Never add information not stated
- If not mentioned, do not include

═══════════════════════════════════════════════════════════════════════════════
SECTION E: EDGE CASES
═══════════════════════════════════════════════════════════════════════════════

E1. HYPOTHETICALS → INCLUDE
- "What if we add X?" = Include X as requirement
- User mentioned it = it's relevant
✓ "What if we add dark mode?" → "Dark mode"

E2. RHETORICAL QUESTIONS → EXCLUDE
- "Why would anyone need that?" = NOT a requirement
- Rhetorical = exclude from output

E3. CODE BLOCKS → PRESERVE EXACTLY
- Content in \`\`\` or \` = preserve verbatim
- No summarization of code
- No modification of code
✓ Keep exactly as written

E4. DOUBLE NEGATIVES → RESOLVE
- Resolve to clear positive/negative
- "Don't avoid images" → "Use images"
- "Not without auth" → "Requires authentication"

E5. EXTERNAL REFERENCES → FLAG
- "Like that doc I shared" = reference outside context
- Flag: [EXTERNAL: referenced content not available]
- Do not infer content

E6. INCOMPLETE INFO → INCLUDE AS-IS
- "Add payment" (no provider specified)
✓ "Payment integration"
✗ "Payment via Stripe" (never mentioned)

E7. ENUMERATED LISTS → PRESERVE ALL
- Keep list structure
- Keep ALL items
- Only dedupe within list

═══════════════════════════════════════════════════════════════════════════════
SECTION F: VALIDATION
═══════════════════════════════════════════════════════════════════════════════

□ Every unique requirement preserved?
□ All negative constraints included?
□ Multiple options = all included?
□ Code blocks preserved exactly?
□ No assumptions made?
□ Executable by another person/AI?

═══════════════════════════════════════════════════════════════════════════════

SummarAI compiles intent. It does not summarize conversations.

[END PROTOCOL v4.0]
`;
const FILLER_PATTERNS = [
  /^(ok|okay|yes|no|sure|thanks|thank you|got it|alright|right|yep|nope|cool|great|perfect|nice|good|fine|understood)\.?$/i,
  /^(please|pls|plz)$/i,
  /^(hi|hello|hey|hii)\.?$/i
];
function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, " ").replace(/[^\w\s]/g, "");
}
function similarity(a, b) {
  const normA = normalize(a);
  const normB = normalize(b);
  if (normA === normB) return 1;
  if (normA.length === 0 || normB.length === 0) return 0;
  if (normA.includes(normB) || normB.includes(normA)) {
    const shorter = Math.min(normA.length, normB.length);
    const longer = Math.max(normA.length, normB.length);
    return shorter / longer;
  }
  const wordsA = new Set(normA.split(" ").filter((w) => w.length > 2));
  const wordsB = new Set(normB.split(" ").filter((w) => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let overlap = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) overlap++;
  });
  return overlap / Math.max(wordsA.size, wordsB.size);
}
function isFillerOnly(text) {
  const trimmed = text.trim();
  if (trimmed.length > 50) return false;
  return FILLER_PATTERNS.some((pattern) => pattern.test(trimmed));
}
function cleanText(text) {
  return text.trim().replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ").replace(/^\s*\n/gm, "");
}
function filterPrompts(prompts) {
  if (prompts.length === 0) return [];
  if (prompts.length === 1) {
    return [{ content: cleanText(prompts[0].content), originalIndex: 0 }];
  }
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  const usedIndices = /* @__PURE__ */ new Set();
  const dedupedWithIndex = [];
  for (let i2 = 0; i2 < prompts.length; i2++) {
    const normalized = normalize(prompts[i2].content);
    if (!seen.has(normalized) && prompts[i2].content.trim().length > 0) {
      seen.add(normalized);
      dedupedWithIndex.push({ prompt: prompts[i2], index: i2 });
    }
  }
  const uniquePrompts = [];
  for (const item of dedupedWithIndex) {
    let isDuplicate = false;
    for (const existing of uniquePrompts) {
      if (similarity(item.prompt.content, existing.prompt.content) > 0.85) {
        if (item.prompt.content.length > existing.prompt.content.length) {
          const existingIdx = uniquePrompts.indexOf(existing);
          uniquePrompts[existingIdx] = item;
        }
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      uniquePrompts.push(item);
    }
  }
  const substantialCount = uniquePrompts.filter(
    (p) => !isFillerOnly(p.prompt.content) && p.prompt.content.length > 20
  ).length;
  for (const item of uniquePrompts) {
    const isFiller = isFillerOnly(item.prompt.content);
    if (isFiller && substantialCount > 3 && item.prompt.content.length < 20) {
      continue;
    }
    if (!usedIndices.has(item.index)) {
      usedIndices.add(item.index);
      result.push({
        content: cleanText(item.prompt.content),
        originalIndex: item.index
      });
    }
  }
  const merged = [];
  let i = 0;
  while (i < result.length) {
    const current = result[i];
    const mergedIndices = [current.originalIndex];
    let mergedContent = current.content;
    let j = i + 1;
    while (j < result.length) {
      const next = result[j];
      const sim = similarity(current.content, next.content);
      if (sim > 0.6 && sim < 0.95 && next.content.length > current.content.length * 0.3) {
        const currentWords = new Set(normalize(mergedContent).split(" "));
        const nextWords = normalize(next.content).split(" ");
        const uniqueWords = nextWords.filter((w) => !currentWords.has(w) && w.length > 2);
        if (uniqueWords.length > 0) {
          mergedContent = mergedContent + " [Update: " + next.content + "]";
          mergedIndices.push(next.originalIndex);
        }
        j++;
      } else {
        break;
      }
    }
    merged.push({
      content: mergedContent,
      originalIndex: current.originalIndex,
      merged: mergedIndices.length > 1 ? mergedIndices : void 0
    });
    i = j > i + 1 ? j : i + 1;
  }
  console.log(`[Filter] ${prompts.length} → ${merged.length} prompts (${Math.round((1 - merged.length / prompts.length) * 100)}% reduction)`);
  return merged;
}
class AISummarizer {
  async summarize(prompts, options = {}) {
    try {
      const filtered = filterPrompts(prompts);
      const content = filtered.map((p, i) => `${i + 1}. ${p.content}`).join("\n\n");
      console.log(`[AISummarizer] Sending ${content.length} chars (from ${prompts.length} prompts, filtered to ${filtered.length})`);
      const response = await resilientFetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          additionalInfo: CONSOLIDATION_RULES,
          provider: "auto",
          options: {
            format: options.format || "paragraph",
            tone: options.tone || "normal",
            includeAI: options.includeAI || false,
            mode: "consolidate"
          }
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Worker Error: ${response.status}`);
      }
      const data = await response.json();
      if (!data.summary || data.summary.trim().length === 0) {
        throw new Error("AI returned an empty summary.");
      }
      return {
        original: prompts,
        // Keep original for user display
        summary: data.summary,
        promptCount: {
          before: prompts.length,
          after: filtered.length
        }
      };
    } catch (error) {
      console.error("[AISummarizer] Error:", error);
      throw error;
    }
  }
}
const aiSummarizer = new AISummarizer();
async function initializeAISummarizer() {
  console.log("[AISummarizer] Using Cloudflare Worker backend with smart filtering");
}
const DEFAULT_CONFIG = {
  version: 1,
  platforms: {
    chatgpt: {
      userSelectors: ['[data-message-author-role="user"]', ".user-message"],
      buttonSelectors: ['button[data-testid="send-button"]'],
      inputSelectors: ["#prompt-textarea"]
    },
    claude: {
      userSelectors: [".font-user-message", '[data-test-id="user-message"]'],
      buttonSelectors: ['button[aria-label="Send Message"]'],
      inputSelectors: ['div[contenteditable="true"]']
    }
    // Add other platforms as needed
  }
};
const STORAGE_KEY = "remote_selector_config";
const CACHE_TTL = 24 * 60 * 60 * 1e3;
const LAST_FETCH_KEY = "remote_config_last_fetch";
const _RemoteConfigService = class _RemoteConfigService {
  constructor() {
    __publicField(this, "config", DEFAULT_CONFIG);
  }
  static getInstance() {
    if (!_RemoteConfigService.instance) {
      _RemoteConfigService.instance = new _RemoteConfigService();
    }
    return _RemoteConfigService.instance;
  }
  async initialize() {
    const stored = await chrome.storage.local.get([STORAGE_KEY, LAST_FETCH_KEY]);
    if (stored[STORAGE_KEY]) {
      this.config = { ...DEFAULT_CONFIG, ...stored[STORAGE_KEY] };
    }
  }
  // Removed fetchUpdates to prevent bundling Firebase in content scripts
  // Updates are now handled by the background script via remote-config-fetcher.ts
  getSelectors(platform) {
    return this.config.platforms[platform] || null;
  }
};
__publicField(_RemoteConfigService, "instance");
let RemoteConfigService = _RemoteConfigService;
async function fetchRemoteConfigUpdates(currentVersion) {
  try {
    const { doc: doc2, getDoc } = await __vitePreload(async () => {
      const { doc: doc3, getDoc: getDoc2 } = await import("./vendor.js").then((n) => n.h);
      return { doc: doc3, getDoc: getDoc2 };
    }, true ? [] : void 0, import.meta.url);
    const { getDb: getDb2 } = await __vitePreload(async () => {
      const { getDb: getDb3 } = await import("./firebase.js").then((n) => n.k);
      return { getDb: getDb3 };
    }, true ? __vite__mapDeps([0,1]) : void 0, import.meta.url);
    const db = await getDb2();
    const docRef = doc2(db, "config", "selectors");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const remoteData = snapshot.data();
      if (remoteData && remoteData.version && remoteData.version > currentVersion) {
        console.log("[RemoteConfig] New version found:", remoteData.version);
        await chrome.storage.local.set({ [STORAGE_KEY]: remoteData });
      }
    }
    await chrome.storage.local.set({ [LAST_FETCH_KEY]: Date.now() });
  } catch (error) {
    console.warn("[RemoteConfig] Firestore update failed, using cached config:", error);
  }
}
console.log("[SahAI] Service worker started");
initializeAISummarizer();
try {
  RemoteConfigService.getInstance().initialize().then(async () => {
    try {
      const stored = await chrome.storage.local.get([LAST_FETCH_KEY]);
      const lastFetch = stored[LAST_FETCH_KEY] || 0;
      if (Date.now() - lastFetch > CACHE_TTL) {
        const config = RemoteConfigService.getInstance().config;
        fetchRemoteConfigUpdates((config == null ? void 0 : config.version) || 0).catch((err) => {
          console.error("[SahAI] Remote config update failed:", err);
        });
      }
    } catch (innerErr) {
      console.error("[SahAI] Error checking remote config cache:", innerErr);
    }
  }).catch((err) => {
    console.error("[SahAI] Remote config initialization failed:", err);
  });
} catch (err) {
  console.error("[SahAI] Critical error initializing remote config:", err);
}
self.addEventListener("unhandledrejection", (event) => {
  console.error("[SahAI] Unhandled rejection in service worker:", event.reason);
  event.preventDefault();
});
const sidePanelPorts = /* @__PURE__ */ new Set();
let lastExtractionResult = null;
if (chrome.sidePanel) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((err) => console.warn("[SahAI] SidePanel setup failed:", err));
} else {
  console.warn("[SahAI] SidePanel API not available, falling back to popup");
  chrome.action.setPopup({ popup: "sidepanel.html" });
}
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel") {
    console.log("[SahAI] Side panel connected");
    sidePanelPorts.add(port);
    if (lastExtractionResult) {
      port.postMessage({
        action: "EXTRACTION_RESULT",
        result: lastExtractionResult
      });
    }
    port.onMessage.addListener((message) => {
      handleSidePanelMessage(message);
    });
    port.onDisconnect.addListener(() => {
      console.log("[SahAI] Side panel disconnected");
      sidePanelPorts.delete(port);
    });
  }
});
let pendingExtraction = null;
let pendingKeylogs = [];
let batchTimer = null;
async function flushKeylogs() {
  if (pendingKeylogs.length === 0) return;
  const toWrite = [...pendingKeylogs];
  pendingKeylogs = [];
  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }
  const groups = /* @__PURE__ */ new Map();
  for (const item of toWrite) {
    const key = `${item.userId}|${item.platform}`;
    const existing = groups.get(key) || [];
    groups.set(key, [...existing, ...item.prompts]);
  }
  for (const [key, prompts] of groups.entries()) {
    const [userId, platform] = key.split("|");
    await saveKeylogsToCloud(userId, platform, prompts);
  }
}
function queueKeylogWrite(userId, platform, prompts) {
  pendingKeylogs.push({ userId, platform, prompts });
  if (pendingKeylogs.length >= 5) {
    flushKeylogs();
  } else if (!batchTimer) {
    batchTimer = setTimeout(flushKeylogs, 3e4);
  }
}
async function trackDailyMetrics(promptCount) {
  try {
    const db = await getDb();
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const metricsRef = doc(db, "metrics", today);
    const { setDoc } = await __vitePreload(async () => {
      const { setDoc: setDoc2 } = await import("./vendor.js").then((n) => n.h);
      return { setDoc: setDoc2 };
    }, true ? [] : void 0, import.meta.url);
    await setDoc(metricsRef, {
      activeUsers: increment(1),
      totalPrompts: increment(promptCount),
      lastUpdated: Date.now()
    }, { merge: true });
  } catch (e) {
  }
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  var _a2;
  console.log("[SahAI] Received message:", message.action);
  switch (message.action) {
    case "EXTRACTION_FROM_PAGE": {
      const { result, mode } = message;
      lastExtractionResult = result;
      pendingExtraction = { result, mode };
      const windowId = (_a2 = sender.tab) == null ? void 0 : _a2.windowId;
      if (windowId) {
        chrome.sidePanel.open({ windowId }).then(() => {
          console.log("[SahAI] Side panel opened");
          const deliverResult = (attempt = 1) => {
            if (!pendingExtraction) return;
            if (sidePanelPorts.size > 0) {
              broadcastToSidePanels({
                action: "EXTRACTION_FROM_PAGE_RESULT",
                result: pendingExtraction.result,
                mode: pendingExtraction.mode
              });
              pendingExtraction = null;
              console.log(`[SahAI] Result delivered on attempt ${attempt}`);
            } else if (attempt < 5) {
              const delay = attempt * 150;
              setTimeout(() => deliverResult(attempt + 1), delay);
            } else {
              console.warn("[SahAI] Could not deliver result - sidepanel never connected");
              pendingExtraction = null;
            }
          };
          deliverResult();
        }).catch((err) => {
          console.error("[SahAI] Error opening side panel:", err);
        });
      }
      sendResponse({ success: true });
      break;
    }
    case "EXTRACTION_RESULT": {
      const result = message.result;
      lastExtractionResult = result;
      broadcastToSidePanels({
        action: "EXTRACTION_RESULT",
        result
      });
      sendResponse({ success: true });
      break;
    }
    case "STATUS_RESULT": {
      broadcastToSidePanels(message);
      sendResponse({ success: true });
      break;
    }
    case "SAVE_SESSION_PROMPTS": {
      const { prompts, platform, conversationId } = message;
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const key = conversationId ? `keylog_${platform}_${conversationId}_${today}` : `keylog_${platform}_${today}`;
      chrome.storage.local.get([key], (result) => {
        const existing = result[key] || [];
        const merged = [...existing];
        const existingContent = new Set(
          existing.map((p) => normalizeContent(p.content))
        );
        for (const prompt of prompts) {
          const normalized = normalizeContent(prompt.content);
          if (!existingContent.has(normalized)) {
            merged.push({
              ...prompt,
              conversationId: conversationId || prompt.conversationId,
              savedAt: Date.now()
            });
            existingContent.add(normalized);
          }
        }
        chrome.storage.local.set({ [key]: merged });
        getCurrentUserId().then((userId) => {
          if (userId && conversationId) {
            const cloudPrompts = prompts.map((p) => ({
              content: p.content,
              timestamp: p.timestamp,
              conversationId,
              platform
            }));
            queueKeylogWrite(userId, platform, cloudPrompts);
            trackDailyMetrics(prompts.length);
          }
        });
      });
      sendResponse({ success: true });
      break;
    }
    case "GET_CONVERSATION_LOGS": {
      const { platform, conversationId } = message;
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const specificKey = `keylog_${platform}_${conversationId}_${today}`;
      const generalKey = `keylog_${platform}_${today}`;
      chrome.storage.local.get([specificKey, generalKey], (result) => {
        let conversationLogs = result[specificKey] || [];
        if (conversationLogs.length === 0 && result[generalKey]) {
          conversationLogs = result[generalKey].filter(
            (log) => log.conversationId === conversationId
          );
        }
        sendResponse({
          success: true,
          prompts: conversationLogs
        });
      });
      return true;
    }
    default:
      sendResponse({ success: false, error: "Unknown action" });
  }
  return true;
});
async function withKeepAlive(operation) {
  let port = chrome.runtime.connect({ name: "keep-alive" });
  const keepAlive = setInterval(() => {
    if (port) {
      port.postMessage({ action: "ping" });
    } else {
      port = chrome.runtime.connect({ name: "keep-alive" });
    }
  }, 25e3);
  port.onDisconnect.addListener(() => {
    port = null;
  });
  try {
    return await operation();
  } finally {
    clearInterval(keepAlive);
    if (port) port.disconnect();
  }
}
const injectedTabs = /* @__PURE__ */ new Set();
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});
(_a = chrome.webNavigation) == null ? void 0 : _a.onHistoryStateUpdated.addListener(async (details) => {
  if (details.frameId !== 0) return;
  const platform = detectPlatformFromUrl(details.url);
  if (!platform) return;
  if (injectedTabs.has(details.tabId)) {
    try {
      chrome.tabs.sendMessage(details.tabId, {
        action: "URL_CHANGED",
        url: details.url
      });
      console.log(`[SahAI] Notified content script of URL change for ${platform}`);
    } catch (err) {
      injectedTabs.delete(details.tabId);
    }
    return;
  }
  try {
    await chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ["content.js"]
    });
    injectedTabs.add(details.tabId);
    console.log(`[SahAI] Injected content script for ${platform}`);
  } catch (err) {
    console.warn(`[SahAI] Could not inject content script:`, err);
  }
});
async function handleSidePanelMessage(message) {
  console.log("[SahAI] Side panel message:", message.action);
  switch (message.action) {
    case "EXTRACT_PROMPTS": {
      const mode = message.mode;
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab == null ? void 0 : tab.id) {
        console.log("[SahAI] Sending EXTRACT_PROMPTS to tab:", tab.id);
        const messageTimeout = setTimeout(() => {
          broadcastToSidePanels({
            action: "ERROR",
            error: "Content script not responding. Please refresh the page."
          });
        }, 5e3);
        chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_PROMPTS", mode }, (response) => {
          clearTimeout(messageTimeout);
          if (chrome.runtime.lastError) {
            console.error("[SahAI] Error sending to tab:", chrome.runtime.lastError);
            broadcastToSidePanels({
              action: "ERROR",
              error: "Could not connect to the page. Please refresh and try again."
            });
          } else {
            console.log("[SahAI] Content script acknowledged extraction:", response);
          }
        });
      } else {
        broadcastToSidePanels({
          action: "ERROR",
          error: "No active tab found."
        });
      }
      break;
    }
    case "GET_STATUS": {
      checkActiveTabStatus();
      break;
    }
    case "SUMMARIZE_PROMPTS": {
      const prompts = message.prompts;
      try {
        const result = await withKeepAlive(async () => {
          return await aiSummarizer.summarize(prompts);
        });
        broadcastToSidePanels({
          action: "SUMMARY_RESULT",
          result,
          success: true
        });
      } catch (error) {
        console.error("[SahAI] Summarization error:", error);
        broadcastToSidePanels({
          action: "SUMMARY_RESULT",
          result: {
            original: prompts,
            summary: prompts.map((p) => p.content).join("\n\n---\n\n"),
            promptCount: { before: prompts.length, after: prompts.length }
          },
          success: false,
          error: error instanceof Error ? error.message : "Summarization failed"
        });
      }
      break;
    }
  }
}
function broadcastToSidePanels(message) {
  sidePanelPorts.forEach((port) => {
    try {
      port.postMessage(message);
    } catch (e) {
      console.error("[SahAI] Error sending to side panel:", e);
      sidePanelPorts.delete(port);
    }
  });
}
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("[SahAI] Extension installed:", details.reason);
  if (details.reason === "install") {
    const { hasSeenWelcome } = await chrome.storage.local.get("hasSeenWelcome");
    if (!hasSeenWelcome) {
      chrome.tabs.create({ url: "welcome.html" });
      chrome.storage.local.set({ hasSeenWelcome: true });
    }
  }
});
chrome.tabs.onActivated.addListener(() => {
  checkActiveTabStatus();
});
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    checkActiveTabStatus();
  }
});
async function checkActiveTabStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!(tab == null ? void 0 : tab.id)) return;
    if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("about:")) {
      broadcastToSidePanels({
        action: "STATUS_RESULT",
        supported: false,
        platform: null
      });
      return;
    }
    const platform = detectPlatformFromUrl(tab.url);
    if (platform) {
      broadcastToSidePanels({
        action: "STATUS_RESULT",
        supported: true,
        platform
      });
    }
    chrome.tabs.sendMessage(tab.id, { action: "GET_STATUS" }, (response) => {
      if (chrome.runtime.lastError) {
        if (!platform) {
          broadcastToSidePanels({
            action: "STATUS_RESULT",
            supported: false,
            platform: null
          });
        }
      } else if (response) {
        broadcastToSidePanels(response);
      }
    });
  } catch (e) {
    console.error("[SahAI] Error checking tab status:", e);
  }
}
function detectPlatformFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    if (hostname.includes("chatgpt.com") || hostname.includes("openai.com")) return "chatgpt";
    if (hostname.includes("claude.ai")) return "claude";
    if (hostname.includes("gemini.google.com")) return "gemini";
    if (hostname.includes("perplexity.ai")) return "perplexity";
    if (hostname.includes("deepseek.com")) return "deepseek";
    if (hostname.includes("lovable.dev")) return "lovable";
    if (hostname.includes("bolt.new")) return "bolt";
    if (hostname.includes("cursor.sh") || hostname.includes("cursor.com")) return "cursor";
    if (hostname.includes("meta.ai")) return "meta-ai";
    return null;
  } catch (e) {
    return null;
  }
}
function normalizeContent(text) {
  return text.toLowerCase().trim().replace(/\s+/g, " ").slice(0, 200);
}
