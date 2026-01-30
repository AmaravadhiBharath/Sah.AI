# 🎯 SahAI - Comprehensive UI/UX Screen Generation Prompt

## Application Brain/Logic Analysis

### **Core Purpose**
**SahAI** is a Chrome extension that intelligently extracts user prompts from AI conversation platforms and transforms them into organized, actionable data. It serves as a "Prompt Archive & Intelligence System" that captures conversation history, organizes it, and optionally summarizes it.

---

## 1. SYSTEM ARCHITECTURE & DATA FLOW

### **Core Components**

#### **A. Extraction Engine (Content Script)**
- **What it does**: Detects which AI platform user is on and extracts prompts in real-time
- **Platforms supported**: Lovable, ChatGPT, Claude, Gemini, Perplexity, DeepSeek, MetaAI, Cursor, Bolt
- **Extraction methods**:
  - Real-time capture: Hooks into send button clicks and keyboard submits
  - DOM scraping: Reads conversation HTML to find user messages
  - Virtual scroll handling: Loads old messages by scrolling through conversation
  - Multi-position extraction: Captures from 5 different scroll positions for complete coverage

#### **B. Platform Adapters (Detection & Parsing)**
- Each AI platform has unique HTML structure and message formatting
- Adapters detect platform by analyzing DOM elements, URLs, and CSS classes
- Each adapter implements: `detect()`, `scrapePrompts()`, `getScrollContainer()`
- Smart filtering: Removes AI responses, system messages, UI elements

#### **C. Side Panel UI (React)**
- User interface where extracted data is displayed and managed
- Real-time status: Shows which platform is detected
- Data visualization: Displays extracted prompts with counts
- User authentication: Google Sign-in for cloud storage
- Multi-view navigation: Main view, History view, Settings view, Profile view

#### **D. Background Service Worker**
- Persistent message handler between content scripts and side panel
- Cloud synchronization: Syncs extraction history with Firebase
- Authentication management: Manages user sessions and tier tracking
- Error handling and logging

#### **E. Cloud Storage (Firebase)**
- Stores extraction history for each user
- Syncs data across browser instances
- Tracks user tier (guest, pro, enterprise)
- Manages daily quotas

---

## 2. USER JOURNEYS & WORKFLOWS

### **Journey 1: Extract Prompts from Current Conversation**

**User Flow**:
1. User opens AI conversation (e.g., lovable.dev, chatgpt.com)
2. User opens SahAI side panel (clicks extension icon)
3. Extension detects platform and shows support status
4. User sees "Extract Prompts" button
5. User clicks button
6. System scrolls through entire conversation, captures all user prompts
7. Results display with:
   - Prompt count summary
   - List of all extracted prompts with indices
   - Word count statistics
   - Extraction duration
8. User can copy, view, or save results

**Data Flow**:
```
Content Script (Detection)
  → Adapter (Platform-specific parsing)
  → DOM Scraping (Virtual scroll + multi-position extraction)
  → Filtering (User prompts only, no AI responses)
  → Deduplication (Remove duplicates)
  → Message Service Worker
  → Side Panel Display
  → Cloud Storage (if logged in)
```

### **Journey 2: View Extraction History**

**User Flow**:
1. User clicks "History" in side panel
2. System fetches all past extractions from cloud
3. Displays chronological list of:
   - Platform name
   - Extraction timestamp
   - Prompt count
   - Preview of first prompt
   - Summarized version (if available)
4. User can click any item to view full extraction
5. User can copy, delete, or re-extract

**Data Structure**:
```
HistoryItem {
  id: unique identifier
  platform: "lovable" | "chatgpt" | "claude" | ...
  promptCount: number
  timestamp: when extracted
  prompts: array of ScrapedPrompt
  preview: first 100 chars
  summary: optional AI-generated summary
}
```

### **Journey 3: Summarize Prompts (Pro Feature)**

**User Flow**:
1. User extracts prompts OR selects from history
2. User clicks "Summarize" button
3. System checks user tier and daily quota
4. If quota available: Sends prompts to AI summarization service
5. Returns concise summary of conversation topics
6. User sees summary alongside original prompts
7. Can copy summary or save for later

**Logic**:
- Guest: 3 summaries/day (limited)
- Pro: Unlimited summaries
- Quota tracking per user per day
- Error handling for API failures

### **Journey 4: User Authentication & Cloud Sync**

**User Flow**:
1. User clicks profile icon in side panel
2. Anonymous: See "Sign in with Google" button
3. User clicks sign-in
4. Opens Google OAuth flow
5. After auth:
   - User profile displayed
   - Tier information shown
   - Usage statistics visible
   - Can toggle telemetry
   - Extraction history syncs from cloud
6. User can sign out anytime

**Data Managed**:
- User UID, email (from Google)
- Tier level (guest, pro, enterprise)
- Extraction history (synced to cloud)
- Daily quota usage
- Preferences (theme, telemetry)

---

## 3. STATE MANAGEMENT & DATA STRUCTURES

### **Primary State Objects**

#### **ExtractionResult**
```
{
  platform: string (e.g., "lovable")
  url: string (conversation URL)
  title: string (conversation title if available)
  prompts: ScrapedPrompt[] (array of extracted prompts)
  extractedAt: number (timestamp)
  conversationId?: string (platform-specific ID)
}
```

#### **ScrapedPrompt**
```
{
  content: string (user's actual prompt text)
  index: number (position in conversation)
  timestamp?: number (when prompt was sent)
  conversationId?: string (for history linking)
}
```

#### **HistoryItem** (Local + Cloud)
```
{
  id: unique ID
  platform: string
  promptCount: number
  mode: "raw" | "summary"
  timestamp: number
  prompts: ScrapedPrompt[]
  preview: string
  summary?: string
}
```

#### **User State**
```
{
  uid: string (Google UID)
  email: string
  tier: "guest" | "pro" | "enterprise"
  authToken: string
  subscriptionActive: boolean
}
```

#### **Quota State**
```
{
  used: number (summaries used today)
  limit: number (daily limit based on tier)
  resetAt: number (timestamp when quota resets)
}
```

### **View States**
- **Main View**: Extraction interface
- **History View**: Past extractions list
- **Settings View**: Preferences, telemetry, theme
- **Profile View**: User info, tier, logout

---

## 4. KEY FEATURES & BEHAVIORS

### **Feature 1: Smart Platform Detection**

**Logic**:
- Runs on page load and every 1 second
- Checks multiple identifiers:
  - URL patterns (lovable.dev, chatgpt.com, etc.)
  - Specific DOM elements per platform
  - CSS class names and structure
  - Page title text
- Returns supported/unsupported status
- Shows platform name in UI

**UI Feedback**:
- ✅ "Lovable detected - Ready to extract"
- ❌ "Unsupported platform - Cannot extract"
- ⏳ "Detecting..." (on page load)

### **Feature 2: Real-time Prompt Capture**

**Logic**:
- Hooks into send button click events
- Hooks into keyboard submit (Enter key)
- Immediately captures typed text before sending
- Stores in `sessionPrompts` array
- Persists to Chrome storage for resumption
- Deduplicates on merge with scraped data

**Why Important**: Captures new prompts even if user navigates away before extraction

### **Feature 3: Scroll-based Message Loading**

**For Lovable Platform** (most complex):
- Lovable uses "virtual scrolling" - only renders visible messages
- Solution: Aggressive scrolling to force re-rendering of old messages
- Process:
  1. Scroll to bottom (discover all message heights)
  2. Scroll to top (load oldest messages)
  3. Extract from 5 positions (0%, 25%, 50%, 75%, 100%)
  4. Wait for DOM re-render between scrolls
  5. Merge results and deduplicate

**Timing**:
- Bottom scroll: 30 iterations × 400ms = ~12 seconds
- Top scroll: 50 iterations × 500ms = ~25 seconds
- Parallel extraction: 5 positions × 1000ms = ~5 seconds
- **Total**: 30-35 seconds for complete extraction

### **Feature 4: Three-Layer Prompt Filtering**

**Challenge**: Distinguish user prompts from AI responses in HTML
**Solution - Three strategies**:

1. **Primary (CSS Classes)**: 99% accuracy
   - User prompts have: `whitespace-normal`, `justify-end` (right-aligned)
   - AI responses have: `prose-h1:mb-2`, `prose` classes (left-aligned)

2. **Secondary (DOM Position)**: 90% accuracy
   - User messages: Right side of container
   - AI messages: Left side of container

3. **Tertiary (Fallback)**: Last resort
   - Text analysis and pattern matching
   - Conservative: Skip if unclear

**Result**: Pure user prompts, <1% false positives

### **Feature 5: Deduplication**

**Logic**:
- Tracks seen content in Set
- Compares normalized text (lowercase, trimmed)
- Removes duplicates from:
  - Real-time captures vs DOM scrapes
  - Multiple scroll positions
  - History merges

**Result**: Each prompt appears exactly once

### **Feature 6: Error Recovery**

**Scenarios & Handling**:

| Error | Cause | Recovery |
|-------|-------|----------|
| Timeout | Slow extraction | User clicks retry |
| Network failure | Internet loss | Queues for retry |
| Session expired | Auth token expired | Redirects to sign-in |
| Platform changed | Unsupported platform | Shows "unsupported" message |
| DOM structure changed | Platform update | Tries alternative selectors |
| Quota exceeded | Daily limit reached | Upsell to Pro tier |

---

## 5. USER INTERFACE ELEMENTS & INTERACTIONS

### **Main View Components**

#### **Header**
- Extension name/logo
- Platform detection badge
- Settings icon (top-right)

#### **Primary CTA Section**
- Large "Extract Prompts" button
- Loading animation during extraction
- Error message display area (red)
- Success message with stats

#### **Results Display**
- Prompt count (animated counter)
- Word count (total words extracted)
- Extraction duration
- Timestamp of extraction

#### **Prompt List**
- Scrollable list of extracted prompts
- Each prompt shows:
  - Index number (e.g., "1", "2", "45")
  - Prompt text (truncated if long)
  - Expand on hover/click
- Copyable (each prompt has copy button)

#### **Action Buttons**
- Copy all (copies all prompts as list)
- Copy as markdown (formatted)
- Save to history (manual save)
- Summarize (if Pro tier and quota available)
- Clear (removes current results)

#### **Bottom Navigation**
- History icon (view past extractions)
- Settings icon (preferences)
- Profile icon (user info / sign-in)

### **History View Components**

#### **History List**
- Shows all past extractions
- Chronological order (newest first)
- Each item displays:
  - Platform name
  - Extraction date/time
  - Prompt count
  - Preview text
  - "View full" link

#### **History Actions**
- Click item to view full extraction
- Delete button (remove from history)
- Copy button (copy prompts)
- Re-extract button (extract same conversation again)

### **Settings View Components**

#### **Preferences**
- Theme selector: System / Light / Dark
- Copy format: Plain text / Markdown
- Show statistics: Toggle on/off

#### **Advanced**
- Telemetry: Toggle data collection
- Clear all history: Destructive action

### **Profile View Components**

#### **Logged-in User**
- Google profile picture
- User email
- Current tier level
- Usage stats (summaries used today)
- Sign out button

#### **Guest User**
- "Sign in with Google" button
- Benefits of signing in:
  - Cloud history sync
  - Daily quota tracking
  - Tier upgrades available

---

## 6. VISUAL FEEDBACK & STATES

### **Loading States**
- Spinner animation during extraction
- Progress messages: "Scrolling...", "Extracting...", "Processing..."
- Estimated time remaining (if possible)

### **Success States**
- Green checkmark icon
- "✅ Successfully extracted X prompts"
- Results immediately display

### **Error States**
- Red error banner with icon
- Friendly error message (translated from technical errors)
- Retry button (if applicable)
- Support/help link (if critical error)

### **Empty States**
- "No prompts found" message
- Suggestions (scroll conversation first, try again)
- Help link

### **Disabled States**
- "Extract Prompts" button disabled if platform unsupported
- "Summarize" button disabled if quota exhausted
- "Summarize" button disabled if guest tier

---

## 7. BUSINESS LOGIC & CONSTRAINTS

### **Tier-based Feature Access**

#### **Guest Tier**
- ✅ Extract prompts (unlimited)
- ✅ View history (cloud sync with limit)
- ✅ Copy results
- ⚠️ Summarize: 3/day limit
- ❌ Advanced filters
- ❌ API access

#### **Pro Tier**
- ✅ All Guest features
- ✅ Unlimited summaries
- ✅ Extended history (1 year)
- ✅ Priority support
- ⚠️ Summarize: 100/day limit
- ❌ API access

#### **Enterprise Tier**
- ✅ All Pro features
- ✅ Unlimited everything
- ✅ Team management
- ✅ API access
- ✅ Custom integrations

### **Quota Management**

**Daily Reset Logic**:
- UTC midnight
- Per-user tracking
- Counts summaries only (extraction is unlimited)
- Quota display: "2/3 summaries used today"
- Pro tier shows: "45/100 summaries used"

### **Cloud Sync Logic**

**When to sync**:
- After successful extraction
- On sign-in (download all history)
- Every 10 seconds (if online)
- On sign-out (upload any pending)

**Merge strategy**:
- Server version is source of truth
- Local version merges with server
- Timestamps determine conflicts
- Duplicates removed during merge

### **Error Handling Strategy**

**Network errors**:
- Retry 3 times with exponential backoff
- Queue for retry if offline
- Fall back to local cache

**Auth errors**:
- Redirect to sign-in
- Clear local token
- Show friendly message

**Platform errors**:
- Log to console
- Try alternative detection methods
- Show "unsupported" if all fail

---

## 8. PERFORMANCE & UX CONSIDERATIONS

### **Performance Targets**
- Extraction: 30-35 seconds (complete coverage)
- Display: <500ms (instant results shown)
- History load: <2 seconds
- Sign-in: <3 seconds
- Summary generation: 5-15 seconds (API dependent)

### **UX Principles**
1. **Transparency**: Always show what's happening (loading messages)
2. **Feedback**: Immediate response to user actions
3. **Recovery**: Clear error messages + recovery paths
4. **Speed**: Optimize all interactions under 3 seconds
5. **Simplicity**: Hide complexity, show only necessary options
6. **Accessibility**: Keyboard navigation, ARIA labels, color contrast

### **Accessibility Features**
- ARIA labels on all buttons
- Keyboard shortcuts (Enter to extract, Esc to close modals)
- High contrast mode support
- Focus indicators
- Screen reader support

---

## 9. TECHNICAL INTEGRATION POINTS

### **Content Script → Service Worker**
- Message: `{ action: 'EXTRACT_PROMPTS', mode: 'raw' | 'summary' }`
- Response: `{ action: 'EXTRACTION_RESULT', result: ExtractionResult }`

### **Service Worker → Side Panel**
- Real-time updates on extraction progress
- Error notifications
- Quota updates
- Auth state changes

### **Side Panel → Firebase**
- Save extraction to user's history
- Fetch history on load
- Sync on auth state change

### **Third-party APIs**
- Google OAuth (authentication)
- Firebase Realtime Database (history storage)
- OpenAI API (summarization)

---

## 10. SUMMARY OF DATA FLOWS

### **Complete Extraction Pipeline**
```
1. User on AI platform →
2. Opens SahAI side panel →
3. Platform detected (DOM analysis) →
4. User clicks "Extract" →
5. Content script activates →
6. Real-time captures collected →
7. Scroll-to-top initiates (virtual scrolling) →
8. Bottom scroll (discover heights) →
9. Top scroll (load old messages) →
10. Parallel extraction (5 positions) →
11. DOM scraping (all positions) →
12. Filtering (user only, no AI) →
13. Deduplication (remove duplicates) →
14. Merge with real-time captures →
15. Format results (ScrapedPrompt[]) →
16. Send to service worker →
17. Service worker sends to side panel →
18. Side panel displays results →
19. If signed in: Save to Firebase →
20. Update history in cloud →
21. User sees confirmation ✅
```

### **User Actions & State Updates**
- Extract → Sets loading=true → Shows spinner → Updates results → Sets loading=false
- Sign in → Shows OAuth popup → Validates token → Fetches cloud history → Updates UI
- Summarize → Checks quota → Calls API → Returns summary → Displays result
- Copy → Uses clipboard API → Shows "Copied!" toast → Clears after 2s

---

## 11. EDGE CASES & SPECIAL SCENARIOS

### **Long Conversations** (50+ prompts)
- Show paginated list (20 per page)
- Lazy load more as user scrolls
- Keep extraction time reasonable

### **Very Long Prompts** (1000+ chars)
- Truncate in list view
- Show full text in modal/expanded view
- Preserve in copy/export

### **No Prompts Found**
- Show helpful message
- Suggest: scroll to beginning, try again
- Check if platform is actually supported

### **Network Offline**
- Queue extractions for later
- Show cached history
- Sync when online

### **Multiple Browser Instances**
- Cloud sync handles conflicts
- Last-write-wins for same extraction
- User can resolve in settings

### **Token Expiry**
- Detect expired auth
- Show "Sign in again" prompt
- Gracefully fall back to guest mode

---

## 🎨 DESIGN DIRECTION (BRAIN, NOT UI)

### **Information Architecture**
- **Primary**: Extract (main purpose)
- **Secondary**: History (past work)
- **Tertiary**: Settings (preferences)
- **Quaternary**: Profile (auth)

### **Interaction Patterns**
- **Big button** for primary action (Extract)
- **Modal dialogs** for sign-in, clear confirmation
- **Inline modals** for history view, settings
- **Toast notifications** for brief feedback
- **Spinners** for progress

### **Color Semantics**
- **Blue**: Primary action (Extract), platform-specific accent
- **Green**: Success, completed actions
- **Red**: Errors, destructive actions
- **Gray**: Disabled, secondary info
- **Yellow/Orange**: Warnings, quotas

### **Typography Hierarchy**
- **Large**: Platform name, extraction count
- **Medium**: Prompt text, action labels
- **Small**: Timestamps, metadata, hints

### **Spacing & Layout**
- **Comfortable spacing**: 16px between sections
- **Tight grouping**: Related items
- **Clear hierarchy**: Primary content prominent

---

## 🚀 FINAL BRIEF FOR UI/UX DESIGNER

**Build a sophisticated yet simple Chrome extension side panel that:**

1. **Detects which AI conversation platform** the user is on (in real-time)

2. **Extracts user prompts** from entire conversations with one click, showing progress and results

3. **Manages extraction history** with cloud sync, allowing users to revisit and organize past extractions

4. **Offers AI summarization** (with quota management based on user tier)

5. **Authenticates users** via Google Sign-in to unlock premium features and cloud storage

6. **Provides flexible data export** in multiple formats (plain text, markdown)

7. **Shows usage statistics** (prompt count, word count, extraction time) to create sense of accomplishment

8. **Handles errors gracefully** with friendly messages and recovery options

9. **Supports multi-tier access** (guest, pro, enterprise) with visible upgrade paths

10. **Maintains offline functionality** while syncing to cloud when available

**Key constraints**:
- Must fit in compact side panel (400px width typical)
- Must be fast and responsive (sub-second feedback)
- Must handle 50-100+ prompts without performance degradation
- Must work across 8+ different AI platforms with different HTML structures
- Must prioritize data privacy (never store sensitive inputs, clear error messages)

---

**This is the complete brain/logic of SahAI. Use this to design UI screens that reflect the powerful intelligence and workflow driving this extension.**
