# 🎨 Complete Customization Guide for SocialPulse

## Overview
This guide shows you exactly where and how to customize every aspect of the SocialPulse website - colors, typography, spacing, components, and more.

---

## 📋 Table of Contents
1. [Color Customization](#color-customization)
2. [Typography & Fonts](#typography--fonts)
3. [Spacing & Layout](#spacing--layout)
4. [Components & UI](#components--ui)
5. [Theme Configuration](#theme-configuration)
6. [Advanced Customization](#advanced-customization)

---

## 🎨 Color Customization

### Primary Colors (Main Theme)
**File**: `tailwind.config.ts`

```typescript
// pulse.primary - Main accent color (buttons, highlights, primary actions)
// Change this to your brand color
primary: "#00D9FF",  // Currently: Cyan

// pulse.secondary - Secondary accent (gradients, secondary UI)
// Use for complementary color
secondary: "#A78BFA",  // Currently: Purple

// pulse.accent - Tertiary color (highlights, badges)
// Bold color for emphasis
accent: "#EC4899",  // Currently: Pink/Magenta

// pulse.bg - Main background color
// Dark mode: keep dark, Light mode: make light
bg: "#0F172A",  // Currently: Navy Blue

// pulse.text - Main text color
// Should contrast well with bg
text: "#F8FAFC",  // Currently: Light Gray

// pulse.muted - Secondary text color
// Dimmed version of text for captions, labels
muted: "#94A3B8",  // Currently: Slate

// System colors (don't change unless needed)
success: "#10B981",  // Green - keep for success states
warning: "#F59E0B",  // Amber - keep for warnings
error: "#EF4444"     // Red - keep for errors
```

**How to Change**:
```typescript
// Example: Change to your brand colors
colors: {
  pulse: {
    primary: "#6366F1",      // Change to Indigo
    secondary: "#EC4899",    // Change to Pink
    accent: "#F59E0B",       // Change to Amber
    bg: "#1F2937",           // Slightly lighter navy
    text: "#FFFFFF",         // Pure white
    muted: "#D1D5DB",        // Lighter gray
    // ... rest stays the same
  }
}
```

### Social Media Platform Colors
**File**: `tailwind.config.ts` & `src/lib/constants.ts`

```typescript
// These colors appear on social media platform cards/icons only
platforms: {
  facebook: "#1877F2",      // Official Facebook blue
  instagram: "#E4405F",     // Official Instagram pink
  youtube: "#FF0000",       // Official YouTube red
  // ... etc
}
```

**How to Change**:
```typescript
// To customize a platform color:
platforms: {
  facebook: "#0A66C2",      // LinkedIn blue instead
  instagram: "#FF006E",     // Different pink
  // Keep official colors for brand recognition
}
```

### Global CSS Colors
**File**: `src/styles/globals.css`

```css
/* Scrollbar colors - matches primary color */
::-webkit-scrollbar-thumb {
  background: rgba(0, 217, 255, 0.5);  /* Change to match primary */
}

/* Mesh background gradients - uses primary/secondary/accent */
.mesh-bg::before,
.mesh-bg::after {
  background: radial-gradient(closest-side, rgba(0, 217, 255, 0.35), transparent 60%),
              /* Update these RGB values to match your colors */
}
```

---

## 🔤 Typography & Fonts

### Font Configuration
**File**: `tailwind.config.ts`

```typescript
// To add custom fonts:
extend: {
  fontFamily: {
    sans: ['Your Font Name', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
    display: ['Playfair Display', 'serif'],
  }
}
```

### Font Sizes
**Current**: Tailwind defaults (text-sm, text-base, text-lg, etc.)

**Change in tailwind.config.ts**:
```typescript
extend: {
  fontSize: {
    'xs': ['12px', { lineHeight: '16px' }],
    'sm': ['14px', { lineHeight: '20px' }],
    'base': ['16px', { lineHeight: '24px' }],
    // ... add custom sizes
  }
}
```

### Text Styling in Components
**Files**: Component files use `text-sm`, `text-base`, `font-medium`, etc.

**Example Change** (in component):
```jsx
// Before
<h1 className="text-3xl font-bold text-pulse-text">Title</h1>

// After - larger, different weight
<h1 className="text-4xl font-extrabold text-pulse-primary">Title</h1>
```

---

## 📐 Spacing & Layout

### Global Spacing Scale
**File**: `tailwind.config.ts`

```typescript
// Uses Tailwind's default spacing (4px base unit)
// p-2 = 8px, p-4 = 16px, p-6 = 24px, etc.

extend: {
  spacing: {
    '13': '3.25rem',
    // Add custom spacing values
  }
}
```

### Component Padding
**Files**: Component files throughout

```jsx
// Button padding examples (easy to change)
<button className="px-3 py-2">  {/* p = 8px, y = 8px */}

<button className="px-6 py-3">  {/* p = 24px, y = 12px */}
```

**Change in any component**:
```jsx
// Increase button padding
className="px-4 py-3"  // Before
className="px-6 py-4"  // After (larger)
```

### Component Sizes
**Cards**: `src/components/ui/Card.tsx`
```typescript
const paddingMap = {
  none: "p-0",      // No padding
  sm: "p-4",        // 16px
  md: "p-6",        // 24px
  lg: "p-8"         // 32px
};
// Change these numbers to adjust card padding globally
```

**Border Radius**
```jsx
// Current: rounded-xl (12px)
// Change to:
className="rounded-lg"   // 8px - smaller radius
className="rounded-2xl"  // 16px - larger radius
className="rounded-full" // Circle
```

---

## 🎯 Components & UI

### Button Variants
**File**: `src/components/ui/Button.tsx`

```typescript
variants: {
  variant: {
    primary: "...",    // Main action button
    secondary: "...",  // Secondary action
    ghost: "...",      // Text-only button
    danger: "...",     // Destructive actions
    success: "..."     // Positive actions
  }
}
```

**Customize Button Appearance**:
```typescript
primary: "glass border-pulse-primary/30 bg-gradient-to-r from-pulse-primary/20 to-pulse-secondary/20 text-pulse-text hover:from-pulse-primary/30 hover:to-pulse-secondary/30"
// Change:
// - border color (border-pulse-primary/30)
// - background gradient (from-pulse-primary/20, to-pulse-secondary/20)
// - text color (text-pulse-text)
// - hover state (hover:from-..., hover:to-...)
```

### Card Component
**File**: `src/components/ui/Card.tsx`

```typescript
// Gradient border color
"bg-gradient-to-r from-pulse-primary/50 via-pulse-secondary/40 to-pulse-accent/40"
// Change these colors to customize card borders

// Animated border effect
"bg-[radial-gradient(800px_circle_at_var(--x,50%)_var(--y,50%),rgba(0,217,255,0.28),transparent_45%)]"
// Update the rgba values (0, 217, 255) to match primary color
```

### Navigation Colors
**File**: `src/components/dashboard/Sidebar.tsx`

```jsx
// Active link styling
active ? "bg-gradient-to-r from-pulse-primary/30 via-pulse-secondary/20 to-transparent"
       : "text-pulse-muted hover:bg-white/5 hover:text-pulse-text"
// Customize these colors for active/inactive states
```

**File**: `src/components/dashboard/Topbar.tsx`

```jsx
// Primary button (New Post)
className="bg-gradient-to-r from-pulse-primary via-pulse-secondary to-pulse-accent"
// Change gradient colors here
```

---

## ⚙️ Theme Configuration

### Global Background
**File**: `src/styles/globals.css`

```css
body {
  background: #0F172A;    /* Change this hex code */
  color: #f8fafc;         /* Change text color */
}
```

### Glassmorphism Effects
**File**: `src/styles/globals.css`

```css
.glass {
  background: rgba(255, 255, 255, 0.05);  /* Opacity: change last number */
  backdrop-filter: blur(20px);             /* Blur amount: change px value */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Border opacity */
}

.glass-soft {
  background: rgba(255, 255, 255, 0.035); /* More transparent */
  backdrop-filter: blur(18px);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.07);  /* More opaque */
  backdrop-filter: blur(24px);
}
```

### Animation Speeds
**Files**: Throughout components

```jsx
// Page transition animation
transition={{ 
  duration: 0.25,    // 250ms - change for faster/slower
  ease: [0.25, 0.46, 0.45, 0.94]
}}

// Button animations
transition-all duration-300  // 300ms - change duration
hover:scale-1.02            // Change scale effect
```

**To make animations faster**:
```jsx
// Before
duration: 0.25
duration-300

// After
duration: 0.15  // 150ms - faster
duration-200    // 200ms - faster
```

---

## 🔌 Advanced Customization

### Add New Color Variables
**File**: `tailwind.config.ts`

```typescript
colors: {
  pulse: {
    // ... existing colors
    brand: "#YOUR_COLOR",      // Add custom color
    custom: "#ANOTHER_COLOR"   // Add more
  }
}
```

**Use in components**:
```jsx
<div className="bg-pulse-brand text-pulse-custom">Content</div>
```

### Add New Button Variant
**File**: `src/components/ui/Button.tsx`

```typescript
variants: {
  variant: {
    // ... existing variants
    outline: "glass border-2 border-pulse-primary bg-transparent text-pulse-primary hover:bg-pulse-primary/10"
  }
}
```

### Customize Breakpoints
**File**: `tailwind.config.ts`

```typescript
screens: {
  'sm': '640px',   // Small devices
  'md': '768px',   // Tablets
  'lg': '1024px',  // Desktops
  'xl': '1280px',  // Large screens
  '2xl': '1536px', // Extra large
}
```

### Add Dark/Light Mode Toggle
**File**: `src/app/layout.tsx`

```jsx
// Currently: always dark mode
html className="dark"

// To add toggle:
html className={isDark ? "dark" : "light"}
```

---

## 📝 Quick Reference Table

| Component | File | Change |
|-----------|------|--------|
| **Colors** | `tailwind.config.ts` | Primary, secondary, accent colors |
| **Background** | `src/styles/globals.css` | Body background color |
| **Buttons** | `src/components/ui/Button.tsx` | Button styles and variants |
| **Cards** | `src/components/ui/Card.tsx` | Card borders and gradients |
| **Navigation** | `src/components/dashboard/Sidebar.tsx` | Sidebar colors |
| **Header** | `src/components/dashboard/Topbar.tsx` | Top bar styling |
| **Typography** | `tailwind.config.ts` | Font families, sizes |
| **Spacing** | Component files | Padding, margins |
| **Animations** | Component files | Duration, effects |

---

## 🎨 Popular Color Schemes

### Dark Professional (Current)
```typescript
primary: "#00D9FF",    // Cyan
secondary: "#A78BFA",  // Purple
accent: "#EC4899",     // Pink
bg: "#0F172A",         // Navy
text: "#F8FAFC"        // Light
```

### Modern Gradient
```typescript
primary: "#6366F1",    // Indigo
secondary: "#EC4899",  // Pink
accent: "#F59E0B",     // Amber
bg: "#1F2937",         // Dark gray
text: "#FFFFFF"        // White
```

### Tech Minimalist
```typescript
primary: "#0EA5E9",    // Sky blue
secondary: "#06B6D4",  // Cyan
accent: "#F59E0B",     // Amber
bg: "#000000",         // Pure black
text: "#FFFFFF"        // Pure white
```

### Vibrant Modern
```typescript
primary: "#FF006E",    // Pink
secondary: "#8338EC",  // Purple
accent: "#3A86FF",     // Blue
bg: "#1A1A2E",         // Very dark blue
text: "#FFFFFF"        // White
```

---

## ✅ Customization Checklist

- [ ] Update primary color in `tailwind.config.ts`
- [ ] Update secondary color in `tailwind.config.ts`
- [ ] Update accent color in `tailwind.config.ts`
- [ ] Change background color in `globals.css`
- [ ] Update button styling in `Button.tsx`
- [ ] Customize card borders in `Card.tsx`
- [ ] Adjust spacing if needed in component files
- [ ] Update animation speeds in components
- [ ] Change platform colors in `constants.ts` (optional)
- [ ] Test all pages at `http://localhost:3000`
- [ ] Run build: `npm run build`
- [ ] Deploy!

---

## 🚀 Implementation Steps

1. **Identify your color scheme** - Pick 3-4 colors
2. **Update `tailwind.config.ts`** - Change primary, secondary, accent
3. **Update `globals.css`** - Change background and gradients
4. **Update component files** - Add comments showing customization
5. **Test locally** - `npm run dev`
6. **Build and deploy** - `npm run build && npm start`

---

## 💡 Pro Tips

- **Color Opacity**: `#00D9FF` → `rgba(0, 217, 255, 0.5)` = 50% opacity
- **Gradient**: Use 2-3 colors from your palette for cohesion
- **Contrast**: Ensure text color contrasts well with background (WCAG AA)
- **Test on Mobile**: Colors look different on different screens
- **Use DevTools**: Inspect elements to find exact classes to customize

---

## 📞 Need Help?

Each file has comments showing customization points. Look for:
```
// CUSTOMIZE: [Description of what you can change]
```

---

**Status**: Ready for customization ✅  
**Last Updated**: January 29, 2026
