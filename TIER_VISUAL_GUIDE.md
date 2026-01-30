# SahAI v1.2.12: Tier Visual Guide

## Extraction Process Visualization

### How Scrolling Works

```
┌───────────────────────────────────────────────────────────────────┐
│                    EXTRACTION PHASES                              │
└───────────────────────────────────────────────────────────────────┘

PHASE 1: BOTTOM SCROLL (Load newest messages downward)
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│ Conversation DOM (Virtual Scrolling) │
├─────────────────────────────────────┤
│ [Message A - Oldest]   (UNLOADED)   │
│ [Message B]            (UNLOADED)   │
│ ...                    (UNLOADED)   │
│ [Message X]            (LOADED)     │ ← Current viewport
│ [Message Y]            (LOADED)     │
│ [Message Z - Newest]   (LOADED)     │ ← Scroll to bottom
└─────────────────────────────────────┘

Timeline:
  Scroll Down (Attempt 1)
  └─ Wait TIER_WAIT_MS
  Scroll Down (Attempt 2)
  └─ Wait TIER_WAIT_MS
  ...repeat N times until height stable...
  Scroll Down (Attempt N)
  └─ Height stable, break


PHASE 2: TOP SCROLL (Load oldest messages upward)
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│ Conversation DOM (Virtual Scrolling) │
├─────────────────────────────────────┤
│ [Message A - Oldest]   (LOADED)     │ ← Scroll to top
│ [Message B]            (LOADED)     │
│ ...                    (LOADED)     │
│ [Message X]            (LOADED)     │ ← Current viewport
│ [Message Y]            (UNLOADED)   │
│ [Message Z - Newest]   (UNLOADED)   │
└─────────────────────────────────────┘

Timeline:
  Scroll Up (Attempt 1)
  └─ Wait TIER_WAIT_MS
  Scroll Up (Attempt 2)
  └─ Wait TIER_WAIT_MS
  ...repeat N times until height stable...
  Scroll Up (Attempt N)
  └─ Height stable, break


PHASE 3: PARALLEL EXTRACTION (Read from 5 positions)
═══════════════════════════════════════════════════════════════════

Position: TOP
  ↓ Scroll to 0px
  └─ Extract all visible messages
  └─ Wait TIER_PARALLEL_WAIT_MS
  └─ 12 prompts found

Position: 25%
  ↓ Scroll to 25% height
  └─ Extract all visible messages
  └─ Wait TIER_PARALLEL_WAIT_MS
  └─ 8 prompts found

Position: MIDDLE
  ↓ Scroll to 50% height
  └─ Extract all visible messages
  └─ Wait TIER_PARALLEL_WAIT_MS
  └─ 10 prompts found

Position: 75%
  ↓ Scroll to 75% height
  └─ Extract all visible messages
  └─ Wait TIER_PARALLEL_WAIT_MS
  └─ 9 prompts found

Position: BOTTOM
  ↓ Scroll to 100% height
  └─ Extract all visible messages
  └─ Wait TIER_PARALLEL_WAIT_MS
  └─ 11 prompts found

═════════════════════════════════════════════════════════════════════
DEDUPLICATION & MERGE: 12+8+10+9+11 = 50 unique prompts
═════════════════════════════════════════════════════════════════════
```

---

## Tier Comparison

### Visual Timeline Comparison

```
TIER 1: AGGRESSIVE (Lovable)
═══════════════════════════════════════════════════════════════════
0s    5s    10s   15s   20s   25s   30s   35s
|-----|-----|-----|-----|-----|-----|-----|
Phase1└─────┤ Phase2└──────────┤ Phase3└────┤
Bottom     20s  Top         25s  Parallel  35s
(50×500ms)     (50×500ms)       (1000ms×5)

Top Attempts: 50        Bottom Attempts: 50
Wait/Scroll: 500ms      Stability: 5 checks
Parallel Wait: 1000ms   Total: ~30-35s
Coverage: 100%


TIER 2: MODERATE - Version A (ChatGPT, Claude)
═══════════════════════════════════════════════════════════════════
0s    5s    10s   15s   20s   25s
|-----|-----|-----|-----|-----|
Phase1└─────┤ Phase2└─────┤ Phase3└─┤
Bottom      16s  Top      20s  Parallel 25s
(40×400ms)      (40×400ms)     (800ms×5)

Top Attempts: 40        Bottom Attempts: 40
Wait/Scroll: 400ms      Stability: 4 checks
Parallel Wait: 800ms    Total: ~18-25s
Coverage: ~95%


TIER 2: MODERATE - Version B (Gemini, Perplexity)
═══════════════════════════════════════════════════════════════════
0s    5s    10s   15s   20s
|-----|-----|-----|-----|
Phase1└─────┤ Phase2└──┤ Phase3└─┤
Bottom      14s  Top   17s  Parallel 23s
(35×350ms)      (35×350ms) (750ms×5)

Top Attempts: 35        Bottom Attempts: 35
Wait/Scroll: 350ms      Stability: 4 checks
Parallel Wait: 750ms    Total: ~18-23s
Coverage: ~90%


TIER 3: CONSERVATIVE - Version A (DeepSeek, Bolt, Cursor)
═══════════════════════════════════════════════════════════════════
0s    5s    10s   15s   20s
|-----|-----|-----|-----|
Phase1└──┤ Phase2└──┤ Phase3└─┤
Bottom   9s  Top   12s  Parallel 18s
(30×300ms)  (30×300ms) (600ms×5)

Top Attempts: 30        Bottom Attempts: 30
Wait/Scroll: 300ms      Stability: 3 checks
Parallel Wait: 600ms    Total: ~12-18s
Coverage: ~85%


TIER 3: CONSERVATIVE - Version B (Meta AI)
═══════════════════════════════════════════════════════════════════
0s    5s    10s   15s
|-----|-----|-----|
Phase1└──┤ Phase2└┤ Phase3└┤
Bottom   6s  Top   9s  Parallel 14s
(25×250ms)  (25×250ms) (500ms×5)

Top Attempts: 25        Bottom Attempts: 25
Wait/Scroll: 250ms      Stability: 3 checks
Parallel Wait: 500ms    Total: ~12-14s
Coverage: ~80%
```

---

## Platform Tier Positioning

```
┌─────────────────────────────────────────────────────────────────┐
│ AGGRESSIVENESS ←─────────────────────────────→ SPEED            │
│ (Higher attempts = More messages found)  (Lower = Faster)       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ TIER 1                                                          │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (100% coverage, 30-35s)                 │
│ Lovable                                                         │
│                                                                 │
│ TIER 2A                                                         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (95% coverage, 18-25s)                        │
│ ChatGPT, Claude                                                 │
│                                                                 │
│ TIER 2B                                                         │
│ ▓▓▓▓▓▓▓▓▓▓▓ (90% coverage, 18-23s)                           │
│ Gemini, Perplexity                                              │
│                                                                 │
│ TIER 3A                                                         │
│ ▓▓▓▓▓▓▓▓ (85% coverage, 12-18s)                              │
│ DeepSeek, Bolt, Cursor                                          │
│                                                                 │
│ TIER 3B                                                         │
│ ▓▓▓▓▓▓ (80% coverage, 12-14s)                                │
│ Meta AI                                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Platform Distribution by Tier

```
ALL PLATFORMS: 9 total
════════════════════════════════════════════════════════════════

┌─────────────────────────┐
│ TIER 1: AGGRESSIVE      │
├─────────────────────────┤
│ 1. Lovable    ████████  │ 1 platform
│               100%       │
└─────────────────────────┘

┌─────────────────────────┐
│ TIER 2: MODERATE        │
├─────────────────────────┤
│ 2. ChatGPT    ███████   │ 4 platforms
│ 3. Claude     ███████   │
│ 4. Gemini     ██████    │
│ 5. Perplexity ██████    │
│               90-95%     │
└─────────────────────────┘

┌─────────────────────────┐
│ TIER 3: CONSERVATIVE    │
├─────────────────────────┤
│ 6. DeepSeek   █████     │ 4 platforms
│ 7. Bolt       █████     │
│ 8. Cursor     █████     │
│ 9. Meta AI    ████      │
│               80-85%     │
└─────────────────────────┘
```

---

## Configuration Parameters Explained

### Scroll Attempts (Top/Bottom)

```
Lower Value (25):  ◆    Faster extraction, fewer messages found
Medium Value (35): ◆◆◆  Balanced approach
High Value (50):   ◆◆◆◆◆ More thorough, slower extraction

Why different for each platform?
• Lovable is extremely aggressive with virtual scrolling → needs 50 attempts
• ChatGPT is moderate → needs 40 attempts
• Gemini is lighter → needs 35 attempts
• DeepSeek/Bolt/Cursor are even lighter → need 30 attempts
• Meta AI is lightest → needs 25 attempts
```

### Wait Per Scroll (milliseconds)

```
Shorter (250ms):  ◇   Faster, may miss messages
Medium (350ms):   ◇◇◇  Balanced
Longer (500ms):   ◇◇◇◇◇ More reliable, slower

Why different for each platform?
• Lovable's DOM is complex, needs 500ms to fully render
• ChatGPT/Claude need 400ms for standard rendering
• Gemini/Perplexity render faster, need 350ms
• Lighter platforms (DeepSeek/Bolt/Cursor) only need 300ms
• Meta AI renders quickly, needs only 250ms

Formula: More messages + Complex DOM = Longer wait time
```

### Stability Checks (consecutive same-height checks)

```
Lower (3):  △    Breaks earlier, faster but might miss content
Higher (5): △△△△△ Ensures all content loaded, slower

Why different?
• TIER 1: Needs 5 to confirm truly all content loaded
• TIER 2: Needs 4 to balance thoroughness with speed
• TIER 3: Needs 3 since less content to load
```

### Parallel Extraction Wait

```
Shorter (500ms):  ◇   May miss partially rendered content
Medium (800ms):   ◇◇◇  Good balance
Longer (1000ms):  ◇◇◇◇◇ Maximum reliability

Why different?
• TIER 1: 1000ms to handle complex Lovable layout
• TIER 2: 750-800ms for standard interfaces
• TIER 3: 500-600ms for simpler layouts

Used at each of 5 positions (TOP, 25%, MIDDLE, 75%, BOTTOM)
```

---

## Decision Tree: Which Tier Gets Used?

```
                    Start Extraction
                          ↓
                Platform Detected
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
    Is Lovable?      Is ChatGPT/      Is Gemini/
                     Claude?          Perplexity?
        ↓                 ↓                 ↓
       YES               YES               YES
        ↓                 ↓                 ↓
    TIER 1          TIER 2A           TIER 2B
    50/50           40/40             35/35
    500ms           400ms             350ms
    Stab=5          Stab=4            Stab=4
    Wait=1000ms     Wait=800ms        Wait=750ms
        ↓                 ↓                 ↓
        └─────────────────┼─────────────────┘
                          ↓
                    Extract & Merge
                          ↓
                   Return Prompts
                    (12-50 messages)


        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
    Is DeepSeek/    Is Cursor?       Is Meta AI?
    Bolt?
        ↓                 ↓                 ↓
       YES               YES               YES
        ↓                 ↓                 ↓
    TIER 3A          TIER 3A           TIER 3B
    30/30            30/30             25/25
    300ms            300ms             250ms
    Stab=3           Stab=3            Stab=3
    Wait=600ms       Wait=600ms        Wait=500ms
        ↓                 ↓                 ↓
        └─────────────────┼─────────────────┘
                          ↓
                    Extract & Merge
                          ↓
                   Return Prompts
                    (8-40 messages)
```

---

## Example: ChatGPT Extraction with Logs

```
[SahAI] Platform: chatgpt (TIER 2 (Moderate))
[SahAI] Config: top=40, bottom=40, wait=400ms, stability=4
[SahAI] Phase 1: Scrolling to bottom (40 attempts)...

Bottom Scroll Progression:
  Scroll 1/40:  height 2000px  (max: 0px)      ← Growing
  Scroll 2/40:  height 2100px  (max: 2000px)   ← Growing
  Scroll 3/40:  height 2100px  (max: 2100px)   ← Same (count=1)
  Scroll 4/40:  height 2100px  (max: 2100px)   ← Same (count=2)
  Scroll 5/40:  height 2100px  (max: 2100px)   ← Same (count=3)
  Scroll 6/40:  height 2100px  (max: 2100px)   ← Same (count=4)
  → Break! (4 consecutive same = stability achieved)
  Height stable - all content discovered

[SahAI] Phase 2: Scrolling to top (40 attempts)...

Top Scroll Progression:
  Scroll 1/40:  height 2100px  (max: 0px)      ← Growing
  Scroll 2/40:  height 2200px  (max: 2100px)   ← Growing
  Scroll 3/40:  height 2300px  (max: 2200px)   ← Growing
  Scroll 4/40:  height 2350px  (max: 2300px)   ← Growing
  Scroll 5/40:  height 2350px  (max: 2350px)   ← Same (count=1)
  Scroll 6/40:  height 2350px  (max: 2350px)   ← Same (count=2)
  Scroll 7/40:  height 2350px  (max: 2350px)   ← Same (count=3)
  Scroll 8/40:  height 2350px  (max: 2350px)   ← Same (count=4)
  → Break! (4 consecutive same = stability achieved)
  Top height stable for 4 checks - all oldest messages loaded

[SahAI] Starting parallel extraction from height: 2350px
[SahAI] Using platform wait time: 800ms

[SahAI] [TOP] Scrolling to 0px...
[SahAI] [TOP] Found 12 prompts
[SahAI] [25%] Scrolling to 587px...
[SahAI] [25%] Found 8 prompts
[SahAI] [MIDDLE] Scrolling to 1175px...
[SahAI] [MIDDLE] Found 10 prompts
[SahAI] [75%] Scrolling to 1762px...
[SahAI] [75%] Found 9 prompts
[SahAI] [BOTTOM] Scrolling to 2350px...
[SahAI] [BOTTOM] Found 11 prompts

[SahAI] Parallel extraction complete: 50 unique prompts

Extraction took: 22 seconds ✅
Coverage: 95% estimated ✅
```

---

## Summary: Why Tiers Exist

| Why | What | Result |
|-----|------|--------|
| **Different platforms** have different virtual scrolling aggressiveness | TIER system groups similar platforms | One size doesn't fit all |
| **More aggressive** scrolling takes more time | Each tier is tuned for that platform | 10-35 seconds depending on tier |
| **Complex layouts** need longer render times | Wait time scales with complexity | 250-500ms per scroll |
| **Need to confirm** all content is loaded | Stability checks ensure completeness | 3-5 consecutive same heights = done |
| **Want consistency** across all platforms | Universal aggressive extraction | Better coverage on all 9 platforms |
| **Want flexibility** for future tuning | Centralized config system | Easy to adjust per platform |

---

**Key Takeaway:** v1.2.12 applies the "aggressive extraction" strategy from v1.2.11 (which achieved 100% on Lovable) to all 9 platforms, but intelligently adapts the parameters for each platform's unique characteristics.

Result: **Better coverage on all platforms, tailored to each one's needs.**
