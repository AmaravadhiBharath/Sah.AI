# 🎨 SahAI Premium Sidepanel Design Specification

**Version**: 1.0
**Style**: Adobe XD Professional
**Focus**: 80% Results • 20% Footer • Premium Quality

---

## 📐 Layout Architecture

### Overall Structure
```
┌─────────────────────────────────┐
│                                 │
│  RESULTS AREA (80%)             │
│  ┌─────────────────────────────┐│
│  │ Floating Toggle (Sticky)     ││
│  ├─────────────────────────────┤│
│  │ Results List (Scrollable)    ││
│  │                             ││
│  │ • Item #1                    ││
│  │ • Item #2                    ││
│  │ • Item #3                    ││
│  │ • Item #4                    ││
│  │                             ││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  FOOTER AREA (20%)              │
│  [Extract All Button]           │
└─────────────────────────────────┘
```

### Dimensions
- **Sidepanel Width**: 280px (standard Chrome extension width)
- **Sidepanel Height**: 680px (full browser height)
- **Results Area**: 80% (544px)
- **Footer Area**: 20% (136px)
- **Aspect Ratio**: 9:16 (mobile-like)

---

## 🎨 Color Palette

### Light Theme (Primary)
```
Background:        #ffffff (pure white)
Surface:           #fafafa (off-white)
Text Primary:      #1a1a1a (dark gray)
Text Secondary:    #999999 (medium gray)
Text Tertiary:     #bbbbbb (light gray)
Border:            #f0f0f0 (subtle)
Border Alt:        #e8e8e8 (lighter)
Primary Action:    #0a84ff (blue)
Primary Dark:      #0071e3 (blue dark)
Success:           #34c759 (green)
Accent:            #0a84ff (blue)
```

### Dark Theme (Secondary)
```
Background:        #0a0a0a (pure black)
Surface:           #141414 (dark gray)
Text Primary:      #f5f5f5 (white)
Text Secondary:    #999999 (medium gray)
Text Tertiary:     #666666 (dark gray)
Border:            #2a2a2a (subtle)
Border Alt:        #333333 (lighter)
Primary Action:    #0a84ff (blue - same)
Primary Dark:      #0071e3 (blue dark - same)
Success:           #34c759 (green - same)
Accent:            #0a84ff (blue - same)
```

---

## 🔤 Typography

### Font Family
```
Primary:   Inter (weight: 400, 500, 600, 700, 800)
Fallback:  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
Monospace: JetBrains Mono (for code/meta info)
```

### Text Styles

| Usage | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| Toggle Button | 11px | 700 | 1.2 | 0.4px |
| Result Number | 10px | 800 | 1.0 | 0px |
| Result Platform | 9px | 600 | 1.2 | 0.3px |
| Result Text | 12px | 400 | 1.5 | 0px |
| Result Meta | 9px | 400 | 1.2 | 0px |
| Button Text | 11px | 700 | 1.2 | 0.4px |
| Empty State Title | 14px | 600 | 1.4 | 0px |
| Empty State Text | 12px | 400 | 1.6 | 0px |

---

## 🎛️ Component Specifications

### 1. Floating Toggle (Sticky)

**Purpose**: Switch between Extract and Summarize modes

**Properties**:
- Position: Sticky (top: 0)
- Z-Index: 10 (above results list)
- Background: White
- Border: 1px solid #e8e8e8
- Border-Radius: 12px
- Padding: 4px (internal gap)
- Gap: 4px (between buttons)
- Box-Shadow: 0 4px 12px rgba(0,0,0,0.08)
- Backdrop-Filter: blur(12px)
- Margin-Bottom: 12px

**Layout**:
```
┌─────────────────────────────┐
│ [Extract] [Summarize]       │
│ ├── button ├── button       │
│ └─ flex: 1 └─ flex: 1       │
└─────────────────────────────┘
```

**Toggle Button States**:

*Default (Inactive)*:
- Background: transparent
- Color: #999999
- Border-Radius: 8px
- Padding: 8px 12px
- Font-Weight: 600
- Font-Size: 11px
- Text-Transform: uppercase
- Letter-Spacing: 0.4px
- Transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)

*Hover (Inactive)*:
- Background: #f5f5f5
- Color: #333333
- Transform: none

*Active*:
- Background: #0a84ff (gradient optional)
- Color: white
- Box-Shadow: 0 2px 8px rgba(10, 132, 255, 0.3)

---

### 2. Result Items (Premium Cards)

**Purpose**: Display extracted prompts in scrollable list

**Container Properties**:
- Display: flex
- Flex-Direction: column
- Gap: 10px
- Overflow-Y: auto
- Overflow-X: hidden

**Individual Item Properties**:
- Background: white
- Border: 1px solid #f0f0f0
- Border-Radius: 12px
- Padding: 14px
- Cursor: pointer
- Transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Position: relative
- Overflow: hidden

**Item States**:

*Default*:
- Border-Color: #f0f0f0
- Box-Shadow: none
- Transform: translateY(0)
- Top accent bar opacity: 0

*Hover*:
- Border-Color: #e0e0e0
- Box-Shadow: 0 8px 24px rgba(10, 132, 255, 0.12)
- Transform: translateY(-2px)
- Top accent bar opacity: 1 (3px blue gradient)

*Summarize Mode*:
- Background: linear-gradient(135deg, #f8f8ff 0%, #f5f9ff 100%)
- Border-Color: #e8eeff

**Item Structure**:
```
┌────────────────────────────┐
│ #1  ChatGPT                │ ← Header (result-header)
│                            │
│ Can you help me build...   │ ← Text (result-text, 2 lines max)
│                            │
│ 2.4k chars • 2 min ago     │ ← Meta (result-meta)
└────────────────────────────┘
```

**Item Elements**:

*Result Number (#1)*:
- Font-Weight: 800
- Color: #0a84ff
- Font-Size: 10px
- Min-Width: 16px
- Line-Height: 1

*Result Platform (ChatGPT)*:
- Font-Size: 9px
- Color: #999999
- Font-Weight: 600
- Text-Transform: uppercase
- Letter-Spacing: 0.3px

*Result Text*:
- Font-Size: 12px
- Color: #1a1a1a
- Line-Height: 1.5
- Display: -webkit-box
- -webkit-line-clamp: 2
- -webkit-box-orient: vertical
- Overflow: hidden
- Text-Overflow: ellipsis
- Margin-Bottom: 8px

*Result Meta*:
- Display: flex
- Gap: 8px
- Font-Size: 9px
- Color: #bbbbbb
- Align-Items: center

---

### 3. Footer Area (20%)

**Container Properties**:
- Flex: 1
- Background: white
- Border-Top: 1px solid #f0f0f0
- Padding: 12px 16px
- Display: flex
- Align-Items: center
- Gap: 8px

**Primary Button**:
- Flex: 1
- Height: 36px
- Background: linear-gradient(135deg, #0a84ff 0%, #0071e3 100%)
- Color: white
- Border: none
- Border-Radius: 10px
- Font-Weight: 700
- Font-Size: 11px
- Cursor: pointer
- Text-Transform: uppercase
- Letter-Spacing: 0.4px
- Box-Shadow: 0 4px 12px rgba(10, 132, 255, 0.2)
- Display: flex
- Align-Items: center
- Justify-Content: center
- Gap: 6px
- Transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)

**Button States**:

*Default*:
- Transform: translateY(0)
- Box-Shadow: 0 4px 12px rgba(10, 132, 255, 0.2)

*Hover*:
- Transform: translateY(-2px)
- Box-Shadow: 0 6px 20px rgba(10, 132, 255, 0.3)

*Active/Pressed*:
- Transform: translateY(0)
- Box-Shadow: 0 2px 8px rgba(10, 132, 255, 0.2)

*Disabled*:
- Background: #f0f0f0
- Color: #cccccc
- Cursor: not-allowed
- Box-Shadow: none

---

### 4. Empty State

**Container**:
- Display: flex
- Flex-Direction: column
- Align-Items: center
- Justify-Content: center
- Gap: 16px
- Padding: 32px 24px
- Text-Align: center
- Color: #999999
- Flex: 1

**Elements**:

*Icon*:
- Font-Size: 48px
- Opacity: 0.6

*Title*:
- Font-Size: 14px
- Font-Weight: 600
- Color: #1a1a1a

*Text*:
- Font-Size: 12px
- Color: #999999
- Line-Height: 1.6

---

### 5. Loading State

**Skeleton Items**:
- Background: linear-gradient(90deg, #f5f5f5 25%, #f0f0f0 50%, #f5f5f5 75%)
- Background-Size: 200% 100%
- Animation: loading 1.5s infinite

**Loading Animation**:
```css
@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 🎨 Styling Details

### Border Radius Scale
```
Sidepanel Frame:  16px (premium rounded)
Result Items:     12px (softer)
Toggle Button:    8px (subtle)
Primary Button:   10px (balanced)
Toggle Container: 12px (cohesive)
```

### Shadow System
```
Subtle:  0 4px 12px rgba(0,0,0,0.08)
Light:   0 8px 24px rgba(10,132,255,0.12)
Medium:  0 6px 20px rgba(10,132,255,0.3)
Strong:  0 20px 60px rgba(0,0,0,0.12)
```

### Spacing Scale
```
4px    = tight gaps (toggle internal)
6px    = tight spacing (footer icon gap)
8px    = default margin (items, sections)
10px   = comfortable gap (result items)
12px   = padding (buttons, toggles)
14px   = card padding (result items)
16px   = section padding (results area)
```

### Animation Easing
```
Default: cubic-bezier(0.25, 0.46, 0.45, 0.94)
Duration: 200ms (responsive feel)
```

---

## 🌙 Dark Theme Implementation

**Changes from Light Theme**:

| Element | Light | Dark |
|---------|-------|------|
| Results Area BG | #fafafa | #141414 |
| Results Content | white | #0a0a0a |
| Item BG | white | #1a1a1a |
| Item Border | #f0f0f0 | #2a2a2a |
| Text Primary | #1a1a1a | #f5f5f5 |
| Text Secondary | #999999 | #999999 |
| Toggle BG | white | #1a1a1a |
| Toggle Border | #e8e8e8 | #2a2a2a |
| Footer BG | white | #0a0a0a |
| Summarize Gradient | #f8f8ff → #f5f9ff | #0f1a3f → #0a1a2e |
| Summarize Border | #e8eeff | #1a2a4a |

---

## 📱 Responsive Behavior

### Mobile (320px - 480px)
- Sidepanel width adjusted to container
- Padding reduced to 12px
- Font sizes reduced by 1px
- Touch targets remain 36px minimum

### Tablet (481px - 768px)
- Standard layout maintained
- Optional wider variant (320px+ width)

### Desktop (769px+)
- Full 280px width
- Standard layout

---

## ✅ Implementation Checklist

### Structure
- [ ] Create 2-part flexbox layout (80% + 20%)
- [ ] Results area scrollable, footer sticky
- [ ] Floating toggle with sticky positioning
- [ ] Result items in vertical list

### Styling
- [ ] All border-radius values correct (16/12/10/8)
- [ ] All colors match palette (light + dark)
- [ ] All text sizes match typography table
- [ ] Spacing follows scale (4, 6, 8, 10, 12, 14, 16)
- [ ] Shadows match shadow system
- [ ] Gradients on buttons match spec

### Interactions
- [ ] Toggle switches between Extract/Summarize
- [ ] Items hover with shadow + lift
- [ ] Button hover with transform
- [ ] Smooth 200ms transitions everywhere
- [ ] Loading state shows skeleton shimmer

### States
- [ ] Empty state shows helpful message
- [ ] Loading state shows 3 skeleton items
- [ ] Success state updates button text
- [ ] Disabled button styling applied
- [ ] Dark theme colors applied

### Polish
- [ ] Scrollbar hidden by default (6px on hover)
- [ ] Focus states visible (keyboard accessible)
- [ ] No layout shift during interaction
- [ ] Consistent micro-interactions

---

## 🎯 Key Principles

1. **80/20 Focus**: Results dominate, footer is minimal but clear
2. **Premium Feel**: Gradients, shadows, rounded corners
3. **User-Centric**: Floating toggle keeps controls accessible while maximizing content
4. **Dark-First Consideration**: Dark theme as quality alternative, not afterthought
5. **Smooth Interactions**: Every hover/click has 200ms feedback
6. **Adobe Aesthetic**: Clean, professional, premium (not playful)

---

## 📊 Performance Notes

- **CSS Only**: No JavaScript needed for styling
- **Smooth Animations**: 200ms is optimal for perceived responsiveness
- **Minimal Shadows**: Subtle shadows maintain performance
- **Efficient Selectors**: No deep nesting, fast paint

---

## 🚀 Next Steps

1. **Implement CSS**: Create stylesheet with all specs above
2. **Build Components**: React components for toggle, items, states
3. **Test Interactions**: Hover, click, keyboard navigation
4. **Dark Mode**: Toggle implementation
5. **Responsive**: Test on various viewport sizes
6. **Performance**: Check rendering performance, optimize if needed

---

**Design Quality Target**: 9.5/10 ⭐
**Implementation Difficulty**: Low-Medium (mostly CSS, straightforward layout)
**Estimated Dev Time**: 4-6 hours for full implementation
