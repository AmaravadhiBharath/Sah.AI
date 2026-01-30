# 🎨 Material Design UI - Complete Redesign

## 📐 Design Philosophy

**Principles:**
- **Material Design 3** - Follow Google's latest design system
- **Minimal** - Clean, uncluttered, focused
- **Informative** - Show only what matters
- **Functional** - Every element serves a purpose
- **Consistent** - Unified visual language

---

## 🖼️ Wireframe Analysis

### **Screen 1: Empty State**
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│     ┌──────────────────┐        │
│     │ Extract│summarize│        │ ← Mode Toggle (centered)
│     └──────────────────┘        │
│                                 │
│        ┌──────────┐             │
│        │ Generate │             │ ← Primary Action (centered)
│        └──────────┘             │
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Elements:**
- Mode toggle: Segmented button (Extract/summarize)
- Generate button: Large, centered primary action
- No header, no footer - just essentials
- Maximum whitespace

---

### **Screen 2 & 3: Loading State**
```
┌─────────────────────────────────┐
│  ┌──────────────────┐           │
│  │ Extract│summarize│           │ ← Mode Toggle (top)
│  └──────────────────┘           │
│                                 │
│         loading...              │ ← Status
│      chatgpt detected           │ ← Platform
│                                 │
│        36 Prompts               │ ← Stats
│        2567 char                │
│        12.4sec..                │
│                                 │
│    ┌────────────────┐           │
│    │   Generating   │           │ ← Action Button
│    └────────────────┘           │
└─────────────────────────────────┘
```

**Elements:**
- Mode toggle: Top-aligned
- Loading text: Center
- Platform detection: Center
- Real-time stats: Center (Prompts, Characters, Time)
- Action button: "Generating" (disabled state)

---

### **Screen 4: Loading Simplified**
```
┌─────────────────────────────────┐
│  ┌──────────────────┐           │
│  │ Extract│summarize│           │
│  └──────────────────┘           │
│                                 │
│         loading...              │
│                                 │
│    ┌────────────────┐           │
│    │    Generate    │           │
│    └────────────────┘           │
└─────────────────────────────────┘
```

---

### **Screen 5: Results State**
```
┌─────────────────────────────────┐
│  ┌──────────────────┐           │
│  │ Extract│summarize│           │
│  └──────────────────┘           │
│                                 │
│  Back              Edit         │ ← Actions
│                                 │
│  ┌──────────────────┐ ☐checkbox│ ← Card 1
│  │ 1                │           │
│  └──────────────────┘           │
│                                 │
│  ┌──────────────────┐ ☐checkbox│ ← Card 2
│  │ 2                │           │
│  └──────────────────┘           │
│                                 │
│  ┌──────────────────┐ ☐checkbox│ ← Card 3
│  │ 3                │           │
│  └──────────────────┘           │
│                                 │
│  ┌──────────────────┐ ☐checkbox│ ← Card 4
│  │ 4                │           │
│  └──────────────────┘           │
│                                 │
│  ┌────────┐  ┌──────┐          │
│  │Re-Gen..│  │ copy │          │ ← Actions
│  └────────┘  └──────┘          │
│                                 │
│  ┌────────────────────────┐    │
│  │       upgrade          │    │ ← Upgrade CTA
│  └────────────────────────────┘│
└─────────────────────────────────┘
```

---

## 🎨 Material Design Components

### **1. Typography**
```
Headline: Roboto 24px Medium
Title: Roboto 18px Medium
Body: Roboto 14px Regular
Caption: Roboto 12px Regular
Button: Roboto 14px Medium
```

### **2. Colors**
```
Primary: #6750A4 (Purple)
Primary Container: #EADDFF
On Primary: #FFFFFF
On Primary Container: #21005D

Secondary: #625B71
Secondary Container: #E8DEF8

Surface: #FFFBFE
On Surface: #1C1B1F
On Surface Variant: #49454F

Outline: #79747E
Outline Variant: #CAC4D0
```

### **3. Elevation**
```
Level 0: No shadow
Level 1: 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.15)
Level 2: 0 1px 2px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.15)
Level 3: 0 4px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)
```

### **4. Border Radius**
```
Small: 4px
Medium: 8px
Large: 12px
Extra Large: 28px
Full: 50%
```

### **5. Spacing Scale**
```
4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, 40px, 48px
```

---

## 📱 Component Library

### **Mode Toggle (Segmented Button)**
```tsx
<div className="segmented-button">
  <button className="segment active">Extract</button>
  <button className="segment">summarize</button>
</div>
```

**Styles:**
- Container: Outlined, rounded
- Active: Filled with primary container color
- Inactive: Transparent
- Smooth transitions

---

### **Primary Button**
```tsx
<button className="filled-button">
  Generate
</button>
```

**Styles:**
- Background: Primary color
- Text: On Primary color
- Shadow: Elevation 1
- Hover: Elevation 2
- Padding: 12px 24px
- Border radius: Medium (8px)

---

### **Text Button**
```tsx
<button className="text-button">
  Back
</button>
```

**Styles:**
- No background
- Text: Primary color
- No shadow
- Hover: Light primary container overlay

---

### **Prompt Card**
```tsx
<div className="prompt-card">
  <span className="card-number">1</span>
  <div className="card-content">...</div>
  <input type="checkbox" className="card-checkbox" />
</div>
```

**Styles:**
- Background: Surface
- Border: Outline Variant
- Border radius: Large (12px)
- Padding: 16px
- Number: Absolute left, outside card
- Checkbox: Absolute right, top

---

### **Stats Display**
```tsx
<div className="stats">
  <div className="stat-item">36 Prompts</div>
  <div className="stat-item">2567 char</div>
  <div className="stat-item">12.4sec..</div>
</div>
```

**Styles:**
- Text align: Center
- Font: Body
- Color: On Surface Variant
- Line height: 1.5
- Gap: 4px between items

---

## 🔄 State Flow

```
Empty State
    ↓
  [Click Generate]
    ↓
Loading State (Simple)
    ↓
  [Detecting Platform]
    ↓
Loading State (Detailed)
  - Shows platform detected
  - Shows stats counting
  - Button says "Generating"
    ↓
  [Extraction Complete]
    ↓
Results State
  - Shows cards
  - Back & Edit buttons
  - Re-Generate & copy buttons
  - upgrade button
```

---

## 🎯 Implementation Plan

### **Phase 1: Foundation**
1. Import Roboto font
2. Set up Material color tokens
3. Create base styles (reset, typography, spacing)

### **Phase 2: Components**
1. Segmented Button (mode toggle)
2. Filled Button (primary actions)
3. Text Button (secondary actions)
4. Prompt Card
5. Stats Display
6. Loading Indicator

### **Phase 3: Screens**
1. Empty State
2. Loading State
3. Results State

### **Phase 4: Polish**
1. Transitions
2. Animations
3. Accessibility
4. Responsive adjustments

---

## ✨ Key Differences from Current UI

### **Current UI:**
- Complex header with back button, mode toggle, copy
- Footer with large button + navigation dock
- Multiple states with overlapping controls

### **New Material UI:**
- **Empty:** Only toggle + button (centered)
- **Loading:** Toggle + status + stats + button
- **Results:** Toggle + Back/Edit + cards + actions + upgrade
- Progressive disclosure
- Each state shows only what's needed
- Clean, scannable, focused

---

## 📏 Layout System

### **Container:**
```
Max width: 400px (chrome extension width)
Padding: 20px
Gap between sections: 24px
```

### **Vertical Rhythm:**
```
Mode Toggle → 24px → Content → 24px → Actions
```

---

## 🎨 Visual Hierarchy

1. **Primary:** Mode toggle, Generate button
2. **Secondary:** Stats, platform detection, Back/Edit
3. **Tertiary:** Checkboxes, card numbers
4. **Accent:** upgrade button (uses secondary color)

---

**Ready to implement!** 🚀

This design will be:
✅ Clean and minimal
✅ Informative without clutter
✅ Following Material Design 3
✅ Mobile-first (perfect for extensions)
✅ Accessible
✅ Beautiful
