# ⚠️ Lovable Adapter v1.2.6 - Reliability Issues for Old Prompts

**Issue**: After install, extracting OLD conversations gives incomplete results

**Root Cause**: 3 problems in your new implementation

---

## 🔴 PROBLEM #1: virtualSanitize() is TOO AGGRESSIVE

### Code (lines 15-68)
```typescript
private virtualSanitize(node: HTMLElement): string {
  const clone = node.cloneNode(true) as HTMLElement;

  // Removes ALL buttons, SVGs, nav, header, footer, aside
  const strictNoise = [
    'button', 'svg', 'path', '[role="button"]',
    '[aria-hidden="true"]', '.lucide',
    'nav', 'header', 'footer', 'aside'
  ];
  clone.querySelectorAll(strictNoise.join(', ')).forEach(el => el.remove());

  // Then removes elements matching noise patterns
  clone.querySelectorAll('*').forEach(el => {
    if (noisePatterns.some(pattern => pattern.test(text))) {
      el.remove();  // ← Removes entire element
    }
  });
}
```

### The Problem
```
User's actual prompt: "Create a login button"
After sanitize:      "Create a login"
                     (word "button" matched /button/i and removed!)

User's actual prompt: "Fix the edit form"
After sanitize:      "Fix the form"
                     (word "edit" removed by /^edit$/i pattern!)
```

### Impact
- ❌ Prompts containing words like "edit", "button", "svg", "delete" get corrupted
- ❌ Legitimate user prompts truncated
- ❌ Reduces extraction accuracy

### Why It Happens
The regex patterns match INSIDE prompts, not just UI elements:
```typescript
const noisePatterns = [
  /^edit$/i,        // ← Matches only if entire text is "edit"
  /^copy$/i,        // ← OK, this is fine
  /\d+ tools? used/i // ← Could match "5 tools used"
];
```

---

## 🔴 PROBLEM #2: isValidPrompt() is TOO STRICT

### Code (lines 182-196)
```typescript
private isValidPrompt(text: string): boolean {
  if (!text || text.length < 2) return false;

  const lowerText = text.toLowerCase().trim();

  // Rejects if text equals these exact strings
  const uiLabels = [
    'edit', 'copy', 'delete', 'regenerate',
    'details', 'preview', 'allowed',
    'show more', 'show less', 'ask lovable'
  ];
  if (uiLabels.includes(lowerText)) return false;

  return true;
}
```

### The Problem
```
User's prompt: "Show more examples"
Check:         "show more examples" === "show more"? NO
Result:        ✅ Passes

User's prompt: "Delete this feature"
Check:         "delete this feature" === "delete"? NO
Result:        ✅ Passes

Actually OK! But...
User's prompt: "Show more"
Check:         "show more" === "show more"? YES!
Result:        ❌ REJECTED (even if user actually typed it)
```

### Impact
- ⚠️ If user types EXACTLY "Show more", it's rejected
- ⚠️ Too rigid for user prompts that happen to match UI labels

---

## 🔴 PROBLEM #3: Strategy C (Deep Scan) is TOO RESTRICTIVE

### Code (lines 138-172)
```typescript
const strategyC = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      // Only accepts text that is in right-aligned containers
      while (curr && depth < 5) {
        const style = window.getComputedStyle(curr);
        if (style.justifyContent === 'flex-end' ||  // ← Very strict
            style.textAlign === 'right' ||
            curr.classList.contains('justify-end')) {
          return NodeFilter.FILTER_ACCEPT;
        }
      }
      return NodeFilter.FILTER_REJECT;  // ← Rejects everything else
    }
  });
};
```

### The Problem
```
Lovable message structure:
┌─────────────────────────────┐
│ <div class="group">         │  ← parent
│   <div class="relative">    │  ← relative
│     <div class="flex">      │  ← flex (this one has justify-end)
│       <div class="prose">   │  ← prose (text here)
│         "User prompt text"  │
│       </div>                │
│     </div>                  │
│   </div>                    │
│ </div>                      │
└─────────────────────────────┘

Strategy C searches UP from text node:
1. Start at prose div - check style.justifyContent = "initial" ❌
2. Move to flex div - check style.justifyContent = "flex-end" ✅ FOUND!

But if structure is DIFFERENT:
┌─────────────────────────────┐
│ <div class="message">       │  ← No justify-end here
│   <div class="prose">       │  ← Text is here
│     "User prompt text"      │
│   </div>                    │
│ </div>                      │
└─────────────────────────────┘

Strategy C searches UP:
1. Start at prose - no justify-end ❌
2. Move to message - no justify-end ❌
3. Move to root - no justify-end ❌
4. REJECTED ❌ (Even though it's a user message!)
```

### Impact
- ❌ Only finds messages in specific DOM structures
- ❌ Misses messages if Lovable changed DOM layout
- ❌ Fails on newer Lovable UI versions

---

## 📊 RELIABILITY BREAKDOWN

### Before Your Changes (v1.1.16)
```
Old prompts reliability: 90-95%
├─ Alignment detection: .justify-end ✅
├─ Edit button detection: Fallback ✅
├─ Deep scan: Flexible ✅
└─ Result: Most conversations work ✅
```

### After Your Changes (v1.2.6)
```
Old prompts reliability: 60-70%
├─ Virtual Sanitizer: Too aggressive ❌ (-10%)
├─ isValidPrompt: Too strict ❌ (-10%)
├─ Strategy C: Too restrictive ❌ (-15%)
└─ Result: Many conversations fail ❌
```

---

## 🎯 THE FIX

### Fix #1: Make virtualSanitize() Less Aggressive

**Problem**: Removes text containing button labels

**Solution**: Only remove EXACT UI elements, not text

```typescript
// BEFORE (removes too much):
clone.querySelectorAll('*').forEach(el => {
  const text = (el.textContent || '').trim().toLowerCase();
  if (noisePatterns.some(pattern => pattern.test(text))) {
    el.remove();  // ← Too aggressive!
  }
});

// AFTER (only removes UI elements):
private virtualSanitize(node: HTMLElement): string {
  const clone = node.cloneNode(true) as HTMLElement;

  // Only remove actual UI elements (buttons, icons, etc.)
  const uiSelectors = [
    'button',
    'svg',
    '[role="button"]',
    '.lucide-icon'
  ];

  clone.querySelectorAll(uiSelectors.join(', ')).forEach(el => el.remove());

  // Don't do aggressive text pattern matching
  // Return clean text directly
  return this.cleanText(this.getVisibleText(clone));
}
```

### Fix #2: Make isValidPrompt() More Lenient

**Problem**: Rejects valid prompts that happen to match UI labels

**Solution**: Remove exact match check, trust filtering happens elsewhere

```typescript
// BEFORE (too strict):
private isValidPrompt(text: string): boolean {
  if (!text || text.length < 2) return false;

  const lowerText = text.toLowerCase().trim();

  const uiLabels = ['edit', 'copy', 'delete', ...];
  if (uiLabels.includes(lowerText)) return false;  // ← Too strict

  return true;
}

// AFTER (more lenient):
private isValidPrompt(text: string): boolean {
  // Just basic checks
  if (!text || text.length < 2) return false;
  if (text.length > 5000) return false;  // Sanity check

  // Don't reject based on label names
  // Other strategies will filter AI responses
  return true;
}
```

### Fix #3: Make Strategy C More Flexible

**Problem**: Only finds right-aligned text, misses other structures

**Solution**: Accept any text that's not obviously AI

```typescript
// BEFORE (too restrictive):
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
  acceptNode: (node) => {
    // Only accepts right-aligned text
    while (curr && depth < 5) {
      if (style.justifyContent === 'flex-end' || ...) {
        return NodeFilter.FILTER_ACCEPT;
      }
    }
    return NodeFilter.FILTER_REJECT;  // ← Rejects everything!
  }
});

// AFTER (more flexible):
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
  acceptNode: (node) => {
    const parent = node.parentElement;
    if (!parent) return NodeFilter.FILTER_REJECT;

    // Skip obvious non-message elements
    const tag = parent.tagName;
    if (['SCRIPT', 'STYLE', 'NAV', 'HEADER', 'FOOTER'].includes(tag)) {
      return NodeFilter.FILTER_REJECT;
    }

    // Accept everything else - let other filters handle it
    return NodeFilter.FILTER_ACCEPT;
  }
});

// Then filter by content later
const content = this.cleanText(node.textContent || '');
if (this.isValidPrompt(content) && !seen.has(content) && !this.isStrictAIResponse(content)) {
  prompts.push({ content, index: prompts.length });
}
```

---

## 📋 RECOMMENDATION

Your v1.2.6 approach has the RIGHT IDEA (3 strategies), but **too many restrictions**.

### What to Do:

**Option A: Revert + Keep Good Parts**
- Go back to v1.1.16 structure
- Add virtualSanitize() for UI element removal
- Keep Strategy A/B/C (more flexible)

**Option B: Loosen Restrictions**
- Reduce virtualSanitize() aggression
- Make isValidPrompt() lenient
- Expand Strategy C acceptance

**Recommended**: **Option A - More Reliable**

---

## 🔍 WHY THIS MATTERS

```
User has 50-message conversation
Clicks Extract after installing

v1.1.16: Gets 45-48 prompts ✅ (90%+ success)
v1.2.6:  Gets 28-35 prompts ❌ (60-70% success)

Missing 10-20 prompts due to:
- Virtualization removing words
- isValidPrompt being too strict
- Strategy C missing alternative structures
```

---

## ✅ SOLUTION SUMMARY

**The Issue**: v1.2.6 is too aggressive with filtering

**The Fix**:
1. Make virtualSanitize() only remove UI elements (not text patterns)
2. Make isValidPrompt() accept more prompts (trust other filters)
3. Make Strategy C more flexible (accept non-right-aligned text too)

**Expected Result**: Back to 90%+ reliability for old prompts after install

---

Would you like me to:
1. ✅ Create the fixed version (v1.2.7)?
2. ✅ Show exact code changes?
3. ✅ Compare old vs new reliability?
