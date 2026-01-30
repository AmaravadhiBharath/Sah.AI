# Missing Buttons - Implementation Guide

## Quick Summary
You have **7+ major UI elements** with complete logic but no UI rendering. Here's exactly what to add where.

---

## 1️⃣ UPGRADE BUTTONS (Profile Modal) ⭐ HIGH PRIORITY

**File:** `src/sidepanel/App.tsx`
**Lines:** 729-744
**Status:** Buttons render but have NO onClick handlers

### Current Code (BROKEN):
```jsx
{displayTier === 'free' && (
  <button className="popup-btn upgrade">
    Upgrade to Go
  </button>
)}
```

### Fixed Code:
```jsx
{displayTier === 'free' && (
  <button
    className="popup-btn upgrade"
    onClick={() => window.open('https://your-app.com/upgrade?tier=go', '_blank')}
  >
    Upgrade to Go
  </button>
)}

{displayTier === 'go' && (
  <button
    className="popup-btn upgrade"
    onClick={() => window.open('https://your-app.com/upgrade?tier=pro', '_blank')}
  >
    Upgrade to Pro
  </button>
)}

{displayTier === 'pro' && (
  <button
    className="popup-btn upgrade"
    onClick={() => window.open('https://your-app.com/upgrade?tier=infi', '_blank')}
  >
    Upgrade to Infi
  </button>
)}
```

**Action:** Add `onClick` handlers with your pricing page URL

---

## 2️⃣ KEYBOARD HINTS BUTTON ⭐ MEDIUM PRIORITY

**File:** `src/sidepanel/App.tsx`
**Status:** Logic exists (can press `?` to open) but NO visible button

### Current State:
- Keyboard shortcut works: Press `?` to trigger `setShowKeyboardHints(true)`
- But users don't see a button to click
- Modal component exists in UXComponents but never renders

### What to Add (Header):
Add this to the header (around line 556):

```jsx
<div className="header-right">
  {(result || summary) && (
    <button onClick={handleCopy} className="icon-btn has-tooltip" title="Copy All">
      {copied ? <IconCheck /> : <IconCopy />}
    </button>
  )}

  {/* ADD THIS: */}
  <button
    onClick={() => setShowKeyboardHints(true)}
    className="icon-btn has-tooltip"
    title="Keyboard Shortcuts (?)"
  >
    <IconHelp /> {/* You may need to import this */}
  </button>
</div>
```

Or in footer. Or both for accessibility.

---

## 3️⃣ KEYBOARD HINTS MODAL ⭐ MEDIUM PRIORITY

**File:** `src/sidepanel/App.tsx`
**Status:** Component imported but NEVER rendered

### Current Problem:
```jsx
// Line 21 - Component is imported:
import {
  OnboardingModal,
  SuccessCelebration,
  KeyboardHints,  // ← Imported but never used!
  ModeToggle,
} from './UXComponents';

// But in the return statement... it's NOWHERE to be found!
```

### What to Add (Main Render):
Add this to the main return statement after line 701 (before or after floating popups):

```jsx
{/* Floating Popups */}

{showKeyboardHints && (
  <KeyboardHints onClose={() => setShowKeyboardHints(false)} />
)}

{showProfileModal && (
  // ... existing profile modal
)}
```

### Required State:
Add to state declarations at top (line 82ish):
```jsx
const [showKeyboardHints, setShowKeyboardHints] = useState(false);
```

---

## 4️⃣ ONBOARDING MODAL ⭐ MEDIUM PRIORITY

**File:** `src/sidepanel/App.tsx`
**Status:** Component imported, state managed, but NEVER rendered

### Current Problem:
```jsx
// Component is imported but never shows up
// State is managed (referenced in keyboard handler line 476) but never triggered
```

### What to Add:

**1. Add state at top:**
```jsx
const [showOnboarding, setShowOnboarding] = useState(false);
```

**2. Add logic to show on first launch (add after auth effect):**
```jsx
useEffect(() => {
  const checkOnboarding = async () => {
    const { hasSeenOnboarding } = await chrome.storage.local.get(['hasSeenOnboarding']);
    if (!hasSeenOnboarding && !user) {
      setShowOnboarding(true);
    }
  };
  checkOnboarding();
}, [user]);
```

**3. Render the modal (add to main return):**
```jsx
{showOnboarding && (
  <OnboardingModal onClose={() => setShowOnboarding(false)} />
)}
```

---

## 5️⃣ PULSE CHECK / FEEDBACK MODAL ⭐ HIGH PRIORITY

**File:** `src/sidepanel/App.tsx`
**Status:** State exists, trigger button exists (line 918), but modal NEVER renders

### Current Problem:
Line 918 has a button that sets `showPulseCheck = true`, but the modal doesn't exist!
```jsx
<button onClick={() => { setShowPulseCheck(true); setShowSettingsModal(false); }}
  className="popup-setting-link">
  Send feedback
</button>
```

But there's nowhere for the modal to appear.

### What to Add:

**1. Check if PulseCheckModal exists:**
Open `UXComponents.tsx` and search for "PulseCheckModal" or "Pulse"
- If it exists → skip to step 3
- If it doesn't → you need to create it OR rename existing feedback component

**2. If it needs to be created** (add to UXComponents.tsx):
```jsx
interface PulseCheckModalProps {
  onClose: () => void;
}

export function PulseCheckModal({ onClose }: PulseCheckModalProps) {
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    if (rating) {
      // Send to your backend
      console.log('Feedback:', { rating, feedback });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>How are we doing?</h2>
        <div className="rating-buttons">
          {['😍 Love it', '👍 Good', '😐 OK', '👎 Not good'].map(option => (
            <button
              key={option}
              onClick={() => setRating(option)}
              className={rating === option ? 'active' : ''}
            >
              {option}
            </button>
          ))}
        </div>
        <textarea
          placeholder="Tell us more..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose}>Skip</button>
          <button onClick={handleSubmit} className="primary">Submit</button>
        </div>
      </div>
    </div>
  );
}
```

**3. Render the modal (add to main return):**
```jsx
{showPulseCheck && (
  <PulseCheckModal onClose={() => setShowPulseCheck(false)} />
)}
```

---

## 6️⃣ BATCH ACTION BUTTONS ⭐ MEDIUM PRIORITY

**File:** `src/sidepanel/App.tsx`
**Lines:** 580-592 (PromptsList)
**Status:** Selection logic exists but NO action buttons

### Current Code:
```jsx
<PromptsList
  prompts={result.prompts}
  selectedPrompts={selectedPrompts}
  onTogglePrompt={(idx) => {
    // ... toggle logic works fine
  }}
/>
```

### What's Missing:
Users can select prompts but nothing happens!

### What to Add (After PromptsList):
```jsx
{selectedPrompts.size > 0 && (
  <div className="batch-actions-toolbar">
    <span className="selection-count">
      {selectedPrompts.size} selected
    </span>
    <button
      className="batch-action-btn copy"
      onClick={() => {
        const selected = result.prompts
          .filter((_, i) => selectedPrompts.has(i))
          .map(p => p.content)
          .join('\n\n');
        navigator.clipboard.writeText(selected);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      Copy Selected
    </button>
    <button
      className="batch-action-btn delete"
      onClick={() => {
        const newPrompts = result.prompts.filter((_, i) => !selectedPrompts.has(i));
        setResult(prev => prev ? { ...prev, prompts: newPrompts } : null);
        setSelectedPrompts(new Set());
      }}
    >
      Delete Selected
    </button>
  </div>
)}
```

---

## 7️⃣ CLOUD SYNC BUTTON (Bonus)

**File:** `src/sidepanel/App.tsx`
**Status:** Logic exists (`saveHistoryToCloud()`, `getHistoryFromCloud()`) but NO button

### What to Add (History Modal):
Add button in history modal header (around line 821):

```jsx
<button
  className="popup-sync-btn"
  onClick={async () => {
    if (user) {
      const cloud = await getHistoryFromCloud(user.email);
      const merged = mergeHistory(history, cloud || []);
      setHistory(merged);
      chrome.storage.local.set({ extractionHistory: merged });
    }
  }}
  title="Sync with cloud"
>
  ☁️ Sync
</button>
```

---

## 📋 Implementation Checklist

- [ ] Add `onClick` to upgrade buttons (lines 729-744)
- [ ] Add help button to header with `setShowKeyboardHints`
- [ ] Render `<KeyboardHints>` component in main return
- [ ] Add `showKeyboardHints` state declaration
- [ ] Add `showOnboarding` state declaration
- [ ] Add first-launch check for onboarding
- [ ] Render `<OnboardingModal>` component
- [ ] Check if PulseCheckModal exists in UXComponents
- [ ] Create PulseCheckModal if missing
- [ ] Render `<PulseCheckModal>` component
- [ ] Add batch action toolbar after PromptsList
- [ ] Add cloud sync button (optional)

---

## 🔍 Testing Checklist

After implementing:
1. Test each upgrade button opens the correct URL
2. Press `?` to verify keyboard hints work
3. Verify onboarding shows on first launch (or clear storage)
4. Send feedback and verify PulseCheckModal appears
5. Select prompts and test copy/delete buttons
6. Check that all buttons close properly with Esc key

---

## Related Files

- `src/sidepanel/UXComponents.tsx` - Component definitions
- `src/sidepanel/App.tsx` - Main rendering logic
- `src/sidepanel/design-tokens.css` - Styling
- `src/sidepanel/ux-enhancements.css` - Modal styles
