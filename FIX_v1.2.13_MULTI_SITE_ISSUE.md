# SahAI v1.2.13: Fix for Multi-Site Extraction Error

## Problem

When switching between 2 supported sites and trying to extract prompts, the **Extract button shows "Error"** instead of completing the extraction.

**Root Cause:** The service worker wasn't retrying when the content script wasn't immediately ready on the new tab, and the sidepanel's port connection wasn't robust enough when switching tabs.

---

## Solution

### 1. Service Worker Retry Logic (src/background/service-worker.ts)

**What was wrong:**
- When switching tabs, the content script might not be ready immediately
- Service worker would fail on first attempt and not retry
- Error message sent immediately without checking if content script could load

**What we fixed:**
- Added retry logic with 3 attempts
- Each attempt has a 15-second timeout (total 45 seconds)
- If first attempt fails, automatically retries up to 3 times
- Better error handling with informative messages

**Code Changes:**
```typescript
// BEFORE: Single attempt, fails immediately
chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_PROMPTS', mode }, (response) => {
  if (chrome.runtime.lastError) {
    // Send error immediately
  }
});

// AFTER: Retry logic with 3 attempts
const maxRetries = 3;
const sendMessage = () => {
  messageTimeout = setTimeout(() => {
    if (retryCount < maxRetries) {
      retryCount++;
      sendMessage(); // Retry
    } else {
      // Send error only after all retries exhausted
    }
  }, 15000);

  chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_PROMPTS', mode }, (response) => {
    if (chrome.runtime.lastError) {
      if (retryCount < maxRetries) {
        retryCount++;
        sendMessage(); // Retry on error
      }
    }
  });
};

sendMessage();
```

### 2. Sidepanel Port Reconnection (src/sidepanel/App.tsx)

**What was wrong:**
- Port might disconnect when switching tabs
- Reconnection wasn't always successful
- Message sent immediately even if port wasn't ready

**What we fixed:**
- Always check port connection before sending message
- Wait 100ms after connecting to ensure port is ready
- Better error messages
- Increased timeout from 8s to 50s to match service worker

**Code Changes:**
```typescript
// BEFORE: Send message even if port might not be ready
if (!portRef.current) {
  connectPort();
}
portRef.current?.postMessage({ action: 'EXTRACT_PROMPTS', mode }); // Might fail

// AFTER: Wait for port to be ready
if (!portRef.current) {
  connectPort();
  setTimeout(() => {
    if (portRef.current) {
      portRef.current.postMessage({ action: 'EXTRACT_PROMPTS', mode }); // Now safe
    }
  }, 100);
}
```

### 3. Version Update

- **package.json:** 1.2.12 → 1.2.13
- **public/manifest.json:** 1.2.12 → 1.2.13

---

## What Changed

| Component | Issue | Fix | Result |
|-----------|-------|-----|--------|
| **Service Worker** | Single attempt, fails on busy content script | Added retry logic (3 attempts × 15s) | Automatic recovery when content script isn't ready |
| **Sidepanel** | Port might not be ready | Wait 100ms after reconnecting | Reliable port connection |
| **Timeouts** | 8s too short for extraction | Increased to 50s | Matches service worker timeout |
| **Error Messages** | Vague errors | More descriptive messages | Easier debugging |

---

## How It Works Now

### Scenario: Switching from ChatGPT to Claude

1. **You click Extract on ChatGPT** ✅
   - Extraction completes successfully

2. **You navigate to Claude**
   - Port disconnects (normal)

3. **You click Extract on Claude**
   - Sidepanel: "Port not connected, connecting..."
   - Wait 100ms for port to be ready
   - Sidepanel: "Port connected, sending EXTRACT_PROMPTS"
   - Service Worker receives message
   - Service Worker: "Sending EXTRACT_PROMPTS to tab"
   - Content Script on Claude tab might not be ready yet → No response
   - Service Worker: "No response from tab, retrying... (attempt 1/3)"
   - Service Worker retries → Content script responds ✅
   - Results displayed ✅

---

## Expected Behavior After Fix

### ✅ Working Scenarios
- Extract on one site → Extract on another site (no error)
- Quick succession of extractions (no port issues)
- Tab not fully loaded when extract clicked (retries automatically)
- Switching between multiple sites back and forth

### ✅ Error Messages (when something really fails)
- "No active tab found. Please make sure a chat page is open."
- "Could not connect to the page. Please refresh and try again."
- "Request timed out. Please refresh the page and try again."

---

## Testing Checklist

After building v1.2.13:

- [ ] Build: `npm install && npm run build`
- [ ] Reload extension: Chrome → chrome://extensions → Reload
- [ ] Test on ChatGPT:
  - [ ] Extract prompts ✓ should work
  - [ ] Check console for no errors
- [ ] Switch to Claude:
  - [ ] Extract prompts ✓ should work (no "Error" button)
  - [ ] Should see retry messages in console if needed
- [ ] Switch back to ChatGPT:
  - [ ] Extract prompts ✓ should work
- [ ] Test rapid switching:
  - [ ] ChatGPT → Claude → Gemini → ChatGPT
  - [ ] Extract on each ✓ all should work
- [ ] Open a tab that's not a supported site:
  - [ ] Extract ✓ should show "No active tab found" error
- [ ] Check console for:
  - [ ] `[SahAI] Port not connected, connecting...`
  - [ ] `[SahAI] Port connected, sending EXTRACT_PROMPTS`
  - [ ] `[SahAI] Content script acknowledged extraction`
  - [ ] No cryptic error messages

---

## Technical Details

### Why Retry Logic Works

When you switch tabs:
1. Chrome loads the new page
2. New page's DOM starts rendering
3. Content script waits for DOM to be ready (injects when DOM is ready)
4. Service worker sends message → might fail if content script not injected yet
5. **Retry logic:** Waits and tries again → content script is now ready → Success ✅

### Why 100ms Wait in Sidepanel

- Port creation is instant, but Chrome needs time to set up listeners
- 100ms gives Chrome enough time to establish the connection
- Not so long that user perceives a delay

### Why Increased Timeout to 50s

- Service worker has 45s timeout for extraction (v1.2.11+ uses aggressive scrolling)
- Sidepanel needs 50s buffer to allow service worker + content script to complete
- Before: 8s was too short, extraction would timeout even if it was working

---

## Files Modified

1. **src/background/service-worker.ts**
   - Added retry logic to `EXTRACT_PROMPTS` handler
   - Better error messages
   - Automatic recovery when content script not ready

2. **src/sidepanel/App.tsx**
   - Improved port connection check
   - Wait for port to be ready before sending message
   - Increased timeout from 8s to 50s

3. **package.json**
   - Version: 1.2.12 → 1.2.13

4. **public/manifest.json**
   - Version: 1.2.12 → 1.2.13

---

## Version History

- **v1.2.11** - Lovable aggressive extraction (100% coverage)
- **v1.2.12** - Universal aggressive extraction (all 9 platforms)
- **v1.2.13** - Fix multi-site switching issue + retry logic ← **Current**

---

## Next Steps

1. **Build:** `npm install && npm run build`
2. **Reload:** Chrome → chrome://extensions → Reload SahAI
3. **Test:** Follow testing checklist above
4. **Verify:** No "Error" when switching between sites

---

**Status:** ✅ Ready for build and testing
**Date:** January 29, 2026
**Version:** 1.2.13
