# 🎨 SahAI - AI Screen Generation Prompt
## "Same Brain, New Skin" - UX/UI Redesign

---

## 📋 CONTEXT & BRIEF

**Product**: SahAI - A browser extension that extracts AI prompts from ChatGPT, Claude, Gemini, and 6+ other platforms.

**Goal**: Generate modern, empathetic UI screens that maintain 100% functional parity while dramatically improving usability, visual design, and user delight.

**Design Approach**: Simple, Calm & Minimalist (Adobe Firefly + Apple's elegance + Calm Tech principles)

**Target Users**: Students, Developers, Researchers (mixed technical skill levels)

---

## 🎯 DESIGN PHILOSOPHY

### Core Principles (NON-NEGOTIABLE)
1. **Simplicity First** - One primary action per screen, hidden complexity
2. **Empathy-Driven** - Every design decision considers user feelings & context
3. **Calm Tech** - Breathing room, gentle animations, information on demand
4. **Progressive Disclosure** - Simple by default, powerful when needed
5. **Accessibility First** - Keyboard navigation, high contrast, clear hierarchy

### What Makes This "Empathetic"?
- Anticipates user needs (onboarding only shows once)
- Celebrates wins (success animations when prompts extracted)
- Provides guidance (empty states show next steps, not dead ends)
- Respects control (keyboard shortcuts, escape to close)
- Reduces friction (clear CTAs, no confusion)
- Builds confidence (step-by-step for beginners, power features for experts)

---

## 🎨 VISUAL DESIGN SYSTEM

### Color Palette

**Light Theme** (Primary)
```
Background: #FAFAFA (warm white)
Surface: #FFFFFF (pure white)
Text Primary: #1A1A1A (almost black)
Text Secondary: #666666 (medium gray)
Text Tertiary: #A3A3A3 (light gray)
Border: #E8E8E8 (subtle)
Success: #34C759 (calm green, used for extractions)
Primary Action: #0A84FF (subtle blue)
Warning: #FF9500 (gentle orange)
Accent Green: #22C55E (bright, for highlights)
```

**Dark Theme** (Secondary)
```
Background: #0A0A0A (pure black)
Surface: #141414 (dark gray)
Text Primary: #F5F5F5 (white)
Text Secondary: #ABABAB (light gray)
Border: #2A2A2A (subtle)
Success: #34C759 (same green)
Primary Action: #0A84FF (same blue)
```

### Typography

**Font Stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
*(System fonts = fast, native feel, loads instantly)*

```
Display (Logo/Hero):    28px, weight 600, -0.5px letter-spacing
Headline (Section):     18px, weight 600, -0.3px letter-spacing
Subheading:             16px, weight 600, -0.2px letter-spacing
Body (Main text):       14px, weight 400, 0px letter-spacing
Label (UI labels):      12px, weight 500, 0.3px letter-spacing
Caption (Meta/hint):    11px, weight 400, 0px letter-spacing
Monospace (Code):       12px, weight 400, JetBrains Mono
```

### Spacing Scale
```
2px   = micro gaps
4px   = tight spacing
8px   = tight grouping
12px  = small margins
16px  = comfortable spacing (DEFAULT)
24px  = medium sections
32px  = large sections
48px  = major sections
64px  = page padding
```

### Shadows & Depth
```
Subtle:  0 2px 4px rgba(0,0,0,0.05)
Light:   0 4px 8px rgba(0,0,0,0.08)
Medium:  0 8px 16px rgba(0,0,0,0.12)
Strong:  0 16px 32px rgba(0,0,0,0.15)

(Apple style: very subtle until you look closer)
```

### Border Radius
```
Sharp corners (0px) - for: Text inputs, code blocks
Subtle corners (4px) - for: Secondary elements
Rounded (8px) - for: Primary buttons, cards, badges
Extra rounded (12px) - for: Large modals, accent elements
Full circle (50%) - for: Avatar circles, icon buttons
```

### Animations
```
Speed: 200ms (quick, responsive)
Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94) (smooth)
Hover: Slight opacity change (0.8 → 1.0)
Active: Brief scale feedback (1.0 → 1.02)
Success: Celebration animation (2-3 keyframes, fun but subtle)
Loading: Gentle spinner or progress bar
```

---

## 📱 SCREEN SPECIFICATIONS

### SCREEN 1: Main Extraction Interface (Idle State)

**Purpose**: Primary interaction point - user opens extension and sees this

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ [Header - 56px height]                  │
│ Logo + Settings                         │
├─────────────────────────────────────────┤
│ [Content Area - padded]                 │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Platform Badge                      │ │ (32px height, minimal)
│ │ "ChatGPT - Ready to extract"        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [24px gap]                              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Extract Prompts] (Primary Button)  │ │ (48px height, full width -32px)
│ └─────────────────────────────────────┘ │
│                                         │
│ [16px gap]                              │
│                                         │
│ Quick actions: [Copy Mode] [Settings]   │ (Secondary buttons, compact)
│                                         │
├─────────────────────────────────────────┤
│ [Footer - sticky, 48px]                 │
│ Help text + keyboard hint               │
└─────────────────────────────────────────┘
```

**Key Elements**:
- **Header**: Logo (28px text) + Settings icon (24x24). Padding 12px. Light border-bottom.
- **Platform Badge**: Subtle gray background (#F5F5F5), rounded 6px, padding 8px 12px. Text 12px, color secondary.
- **Primary Button**: Full width, 48px height, #0A84FF background, white text (14px bold), 8px border-radius. Hover: darker blue. Active: brief scale.
- **Secondary Buttons**: Ghost style (transparent, border only), 40px height, compact.
- **Footer**: Light gray background, 12px text, center-aligned, breathing room.

**Empty State Handling**: If no platform detected, show platform showcase grid (3x3 icons) with "Open a supported AI platform first" message.

---

### SCREEN 2: Extraction Results View

**Purpose**: Show extracted prompts after successful extraction

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ [Header]                                │
├─────────────────────────────────────────┤
│ [Results Summary - 24px padding]        │
│ ✓ 47 Prompts Extracted                  │ (Success checkmark in green)
│ 3,245 words • Completed in 34 seconds   │ (Secondary text, spaced)
│                                         │
│ [16px gap + subtle divider]             │
│                                         │
├─────────────────────────────────────────┤
│ [Prompts List - scrollable]             │
│                                         │
│ [Prompt Item] (repeating)               │
│ ┌─────────────────────────────────────┐ │
│ │ #1  "Can you help me build a..."    │ │ (Index + preview, clickable)
│ └─────────────────────────────────────┘ │
│                                         │
│ [8px gap]                               │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ #2  "What about the design sys..."  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ (Infinite scroll - load more)           │
│                                         │
├─────────────────────────────────────────┤
│ [Footer Actions - sticky, 56px]         │
│ [Copy All] [Export...] [Clear]          │ (3 equal-width buttons)
└─────────────────────────────────────────┘
```

**Key Elements**:
- **Results Summary**: Headline 16px bold, subtext 12px secondary. Green success icon (16x16).
- **Prompt Items**: Light gray background (#F9F9F9 light / #1A1A1A dark), 12px padding, 8px border-radius. Hover: subtle shadow, slight highlight. Index in bold primary color. Text truncated to 2 lines.
- **Divider**: 1px solid border, subtle color (#E8E8E8 light / #2A2A2A dark).
- **Footer Buttons**: Equal width (33% each), bordered style, hover effects. Clear button is red (#FF3B30).

**Click Behavior**:
- Clicking prompt item opens full-screen modal with complete text
- Copy button copies individual prompt to clipboard (toast notification)
- Copy All copies all prompts with numbering
- Export opens format selector (Markdown, JSON, CSV)

---

### SCREEN 3: Full Prompt Modal (Detail View)

**Purpose**: Display complete prompt when user clicks on an item

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ [Modal Header - 48px]                   │
│ Prompt #1                 [X close]     │ (Title + close button)
├─────────────────────────────────────────┤
│                                         │
│ [Modal Content - 24px padding]          │
│                                         │
│ Full prompt text here...                │ (14px, line-height 1.6)
│                                         │
│ Lorem ipsum dolor sit amet, consectetur │
│ adipiscing elit. Sed do eiusmod tempor  │
│ incididunt ut labore et dolore magna... │
│                                         │
│ [24px gap]                              │
│                                         │
│ Meta info:                              │ (12px secondary text)
│ Source: ChatGPT • 234 words • 5s ago    │
│                                         │
├─────────────────────────────────────────┤
│ [Footer - sticky, 56px]                 │
│ [← Previous] [Copy] [Next →]            │ (Navigation + action)
└─────────────────────────────────────────┘
```

**Key Elements**:
- **Modal**: 320px width (mobile-friendly), centered on screen, subtle shadow
- **Header**: Light gray background, 16px bold text, X button (24x24) top-right
- **Content**: 14px body text, 1.6 line-height (readable), code in monospace font
- **Meta**: 12px secondary color, light gray background (#F9F9F9), 8px padding, 4px border-radius
- **Footer Buttons**: [Previous] and [Next] are ghost style (navigate between prompts), [Copy] is primary (blue)
- **Close**: Escape key or X button

---

### SCREEN 4: Onboarding Modal (First-Time User)

**Purpose**: Welcome new users, explain features, reduce cognitive load

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ [Modal - centered, 360px wide]          │
│                                         │
│ [Step Indicator]                        │ (3 dots, step 1/3)
│ ● ○ ○                                   │
│                                         │
│ [24px gap]                              │
│                                         │
│ [Icon - 64x64 animated]                 │ (Illustration or lottie)
│ (sparkle/extract icon in color)         │
│                                         │
│ [16px gap]                              │
│                                         │
│ Welcome to SahAI                        │ (Headline 18px bold)
│                                         │
│ [8px gap]                               │
│                                         │
│ Extract prompts from ChatGPT, Claude,   │ (Body 14px secondary)
│ Gemini and more - all in one place.     │
│                                         │
│ [24px gap]                              │
│                                         │
│ Pro tip: Press ? for keyboard shortcuts │ (Hint, 12px, italic)
│                                         │
│ [32px gap]                              │
│                                         │
│ [Next] [Skip]                           │ (Primary + secondary buttons)
│                                         │
└─────────────────────────────────────────┘
```

**Key Elements**:
- **Step Indicators**: 3 circles, filled/empty based on step. 8px diameter, 8px gap
- **Icon**: Centered, 64x64, uses brand color (#34C759 green)
- **Text**: Center-aligned, headline 18px bold, body 14px secondary
- **Pro Tip**: Italic, smaller, subtle color, light background
- **Buttons**: [Next] is primary (full width), [Skip] is secondary ghost style
- **3 Steps**:
  1. "Welcome" - Explain what SahAI does
  2. "How it works" - Show extraction flow with numbered steps
  3. "Let's go!" - Show supported platforms, encourage first extraction

---

### SCREEN 5: Empty State (No Prompts Found)

**Purpose**: Handle case when no prompts detected on current page

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ [Header]                                │
├─────────────────────────────────────────┤
│                                         │
│ [Empty State Content - centered]        │
│                                         │
│ [Icon - 80x80]                          │
│ (Illustration: empty chat bubble)       │
│                                         │
│ [16px gap]                              │
│                                         │
│ No prompts found                        │ (Headline 16px bold)
│                                         │
│ [8px gap]                               │
│                                         │
│ You're on a supported platform,         │ (Body 14px secondary)
│ but no prompts detected yet.            │
│                                         │
│ Try having a conversation first.        │
│                                         │
│ [24px gap]                              │
│                                         │
│ [Supported Platforms] (link)            │
│                                         │
│ [32px gap]                              │
│                                         │
│ ──── Or ────                            │ (Divider with text)
│                                         │
│ [32px gap]                              │
│                                         │
│ ChatGPT  Claude  Gemini                 │ (Platform icons grid 3x3)
│ Copilot  Perplexity  LLaMA              │
│ Grok  Coze  ...                         │
│                                         │
│ Open any platform above                 │ (Caption)
│                                         │
└─────────────────────────────────────────┘
```

**Key Elements**:
- **Illustration**: Simple, monochrome or brand-colored, 80x80px
- **Headline**: 16px bold, center-aligned
- **Body**: 14px secondary, center-aligned, 2-3 sentences max
- **Platform Icons**: 32x32 each, rounded 4px, subtle shadow on hover
- **Divider**: Line with centered text "Or" (12px secondary)
- **Link Color**: Primary blue (#0A84FF)

---

### SCREEN 6: Settings Modal

**Purpose**: Configure extraction preferences

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ [Header - 48px]                         │
│ Settings                          [X]   │
├─────────────────────────────────────────┤
│                                         │
│ [Settings Content - 24px padding]       │
│                                         │
│ Extraction Preferences                  │ (Section headline 14px)
│                                         │
│ [8px gap]                               │
│ ────────────────────────────────────── │ (Divider)
│                                         │
│ [Setting Item]                          │ (Repeating)
│ ┌─────────────────────────────────────┐ │
│ │ Include timestamps          [Toggle] │ │
│ │ Add timestamps to each prompt        │ │ (Label + toggle + hint)
│ └─────────────────────────────────────┘ │
│                                         │
│ [12px gap]                              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Auto-copy on extract        [Toggle] │ │
│ │ Automatically copy to clipboard      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [12px gap]                              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Show notifications          [Toggle] │ │
│ │ Notify when extraction complete     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [24px gap]                              │
│                                         │
│ Appearance                              │ (Section headline)
│ ────────────────────────────────────── │
│                                         │
│ Theme: [Light] [Dark] [System]          │ (Toggle group, 3 options)
│                                         │
│ [24px gap]                              │
│                                         │
│ About                                   │ (Section headline)
│ ────────────────────────────────────── │
│                                         │
│ Version 1.3.0                           │
│ Made with ❤️ by the SahAI team          │
│                                         │
│ [Feedback] [GitHub] [Privacy]           │ (Links)
│                                         │
└─────────────────────────────────────────┘
```

**Key Elements**:
- **Section Headers**: 14px bold, #1A1A1A (light theme)
- **Dividers**: 1px solid #E8E8E8
- **Toggle Switch**:
  - Width 48px, height 24px, 4px border-radius
  - Off: Gray background, left-aligned circle
  - On: Green background (#34C759), right-aligned circle
  - Smooth 200ms transition
- **Setting Item**: 12px padding, hover light gray background
- **Links**: 12px primary blue (#0A84FF), underline on hover
- **Theme Toggle**: 3 ghost buttons, middle one active/filled

---

### SCREEN 7: Success Celebration (After Extract)

**Purpose**: Delight user after successful extraction

**Layout Structure** (Overlay/Toast):
```
┌─────────────────────────────────────────┐
│                                         │
│  ✅  47 prompts extracted!              │ (Floating toast, top center)
│                                         │
│  [Slide down from top, play 2s, fade]   │
│                                         │
└─────────────────────────────────────────┘

OR (Full celebration in results):

[Confetti animation background]
┌─────────────────────────────────────────┐
│                                         │
│        ✨ Amazing! ✨                   │
│                                         │
│    47 prompts extracted successfully    │
│                                         │
│  [Celebrate animation - 2 keyframes]    │
│                                         │
│       [View Results]                    │
│                                         │
└─────────────────────────────────────────┘
```

**Key Elements**:
- **Toast**: 56px height, green background (#34C759), white text, 12px padding, 8px border-radius
- **Icon**: Checkmark or sparkle, 20x20px
- **Animation**: Slide down 300ms, stay 3s, fade out 300ms
- **Celebration Modal** (optional): Confetti effect, emoji rain (if animated), 2-second duration
- **Sound**: Optional subtle "ding" sound (200ms)

---

## 🎯 INTERACTION PATTERNS

### Button States
```
Default:
- Background: primary color (#0A84FF)
- Cursor: pointer
- Opacity: 1.0

Hover:
- Background: darker shade
- Shadow: light shadow
- Transition: 200ms smooth

Active/Pressed:
- Transform: scale(1.02)
- Opacity: 0.95

Disabled:
- Background: #E8E8E8
- Text: #A3A3A3
- Cursor: not-allowed
- Opacity: 0.5
```

### Input Fields
```
Default:
- Border: 1px solid #E8E8E8
- Background: white
- Padding: 12px 16px
- Height: 40px
- Border-radius: 4px

Focus:
- Border-color: #0A84FF
- Box-shadow: 0 0 0 2px rgba(10,132,255,0.1)

Error:
- Border-color: #FF3B30
- Background: #FFF5F5
```

### Keyboard Navigation
```
Tab: Focus next interactive element (natural reading order)
Shift+Tab: Focus previous element
Enter/Space: Activate buttons/toggles
Escape: Close modals
Cmd+E (Mac) / Ctrl+E (Windows): Quick extract
Cmd+C (Mac) / Ctrl+C (Windows): Copy selected
?: Show keyboard shortcuts help
```

---

## 📐 RESPONSIVE DESIGN

### Breakpoints
```
Mobile (320px - 600px):
- Full-width layouts
- Single column
- Touch-friendly (48px minimum tap targets)
- Bottom navigation/actions

Tablet (600px - 1000px):
- Slightly wider padding
- 2-column layouts where sensible

Desktop (1000px+):
- Maximum content width 1200px
- 3-column layouts possible
- Sidebar navigation optional
```

### Mobile Considerations
```
- Buttons minimum 48x48px (44x44px absolute minimum)
- Touch targets spaced 8px apart
- No hover states (use active instead)
- Vertical scrolling primary
- Full-width modals on small screens
- Bottom sheet for actions (preferred over top modal)
```

---

## ✅ QUALITY CHECKLIST

When generating these screens, ensure:

### Visual Design
- [ ] All colors match palette (light + dark themes)
- [ ] Typography follows hierarchy (Display → Headline → Body → Label → Caption)
- [ ] Spacing uses only values from scale (2, 4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Border-radius consistent (0, 4, 8, 12, 50%)
- [ ] Shadows subtle and layered
- [ ] Icons are 16x16, 20x20, 24x24, 32x32, 64x64 (standard sizes only)

### Usability
- [ ] One primary action per screen (clear CTA)
- [ ] Empty states have helpful guidance
- [ ] Error messages are friendly and actionable
- [ ] Loading states show progress
- [ ] Focus states clearly visible (keyboard accessible)
- [ ] Touch targets minimum 48x48px
- [ ] Text contrast WCAG AA minimum (4.5:1)

### Delight
- [ ] Micro-interactions add personality (not noise)
- [ ] Animations are smooth (200ms easing)
- [ ] Success feedback is celebratory
- [ ] Hover states invite interaction
- [ ] Empty states feel warm, not punitive
- [ ] Overall feel is calm and professional

### Consistency
- [ ] All buttons follow button style guide
- [ ] All inputs follow input style guide
- [ ] All text follows typography scale
- [ ] All spacing uses scale
- [ ] All shadows follow depth system
- [ ] Icons are consistent style (line-weight, size)
- [ ] Modals follow modal pattern

---

## 🚀 PROMPT ENGINEERING FOR AI DESIGN TOOLS

### For Figma AI / Adobe Firefly / Other Tools

**Quick Prompt**:
```
Generate SahAI Chrome extension screens with these specs:
- Platform: Browser extension sidepanel (320-400px width)
- Screens: 7 (idle, results, detail, onboarding, empty, settings, success)
- Design: Minimal, calm, Apple-inspired
- Colors: Light theme primary (#FAFAFA bg, #1A1A1A text, #0A84FF primary, #34C759 success)
- Typography: Inter sans-serif, system fonts
- Style: Subtle shadows, 8px border-radius, 16px base spacing
- Features: One CTA per screen, clear empty states, empathetic UX
- Include: Dark theme variant for all screens
- Tone: Professional but warm, simple but powerful
```

### For Claude/ChatGPT/LLMs

Use this document as context and ask:
```
Based on the attached SahAI design system and screen specifications,
generate detailed design mockups/descriptions for:
1. [Specify screen name from list above]
2. Include all elements from the specification
3. Ensure color, typography, and spacing compliance
4. Suggest any micro-interactions or animations
5. Provide dark theme variant
6. Suggest a 3-4 line description for handoff to developers
```

---

## 📝 DESIGN HANDOFF CHECKLIST

Before development, designers should provide:

- [ ] 7 high-fidelity screen designs (light + dark themes = 14 total)
- [ ] Component library (buttons, inputs, toggles, modals, badges)
- [ ] Icon set (20+ icons in consistent style, 20x20 & 24x24)
- [ ] Typography guide (weights, sizes, line-heights, colors)
- [ ] Color tokens (hex codes + design system variable names)
- [ ] Spacing scale (grid units for alignment)
- [ ] Animation specs (duration, easing, trigger conditions)
- [ ] Responsive breakpoints & mobile layouts
- [ ] Accessibility checklist (contrast, keyboard nav, screen readers)
- [ ] Interaction states (hover, active, disabled, loading)
- [ ] Copy/microcopy specifications
- [ ] Error handling states & messages
- [ ] Loading states & placeholders

---

## 🎓 DESIGN PRINCIPLES SUMMARY

| Principle | What It Means | Example |
|-----------|---------------|---------|
| **Simplicity** | One primary action per screen | Show only "Extract" button, hide settings |
| **Calm** | Breathing room, gentle animations | 16px padding, 200ms transitions |
| **Empathy** | Design for how users *feel* | Success celebration when extract works |
| **Progressive Disclosure** | Simple by default, complex when needed | Hide settings, show on click |
| **Accessibility** | Usable by everyone | 48x48px buttons, keyboard nav, contrast |
| **Consistency** | Same patterns everywhere | All buttons look & behave the same |
| **Feedback** | Always respond to user action | Toast on copy, loading spinner on extract |

---

## 🎨 EXAMPLE USE CASE

**Scenario**: User opens extension for the first time on ChatGPT

1. **Onboarding Modal** appears (gentle introduction)
2. User clicks "Next" through 3 steps
3. Modal closes, **Main Screen** shows (Extract button front-and-center)
4. User clicks **Extract**
5. **Loading State** shows with progress
6. **Success Celebration** plays (sparkle animation)
7. **Results Screen** displays extracted prompts
8. User clicks on a prompt
9. **Detail Modal** opens (full text, meta info)
10. User clicks "Copy"
11. **Toast Notification** confirms "Copied!"
12. User presses `?` to see **Keyboard Shortcuts**

Every step feels smooth, purposeful, and empowering.

---

## 📞 SUPPORT & QUESTIONS

This prompt is designed to:
- Be used with AI design tools (Figma, Adobe Firefly, etc.)
- Guide developers during implementation
- Serve as design system documentation
- Ensure consistency across all screens
- Communicate design intent to stakeholders

**Version**: 1.0 (January 30, 2026)
**Status**: Ready for AI screen generation
**Quality Target**: 9/10 usability score
