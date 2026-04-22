# Styling & Theming Guide

## Color System

### Primary Colors
```
Blue-600: #2563eb  → Primary buttons, links, accents
Blue-700: #1d4ed8  → Hover states
Sky-500:  #0ea5e9  → Accent, gradient endpoint
```

### Gradient
```css
/* Brand gradient (used in "gradient-text" class) */
background: linear-gradient(135deg, #2563eb, #0ea5e9);
```

### Dark Mode
- Background: `gray-950` (#030712)
- Card/Surface: `gray-800` (#1f2937)
- Border: `gray-700` (#374151)
- Text: `gray-100` (#f3f4f6)
- Muted text: `gray-400` (#9ca3af)

### Light Mode
- Background: `white`
- Card/Surface: `white`
- Border: `gray-200` (#e5e7eb)
- Text: `gray-900` (#111827)
- Muted text: `gray-600` (#4b5563)

## Theme Toggle
- Stored in `localStorage` key: `"theme"`
- Toggles `dark` class on `<html>` element
- Respects `prefers-color-scheme` on first visit
- Context: `useTheme()` from `@/components/Providers`

## CSS Custom Properties (globals.css)
```css
:root {
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-accent: #0ea5e9;
}
```

## Custom CSS Classes

### `.gradient-text`
Blue-to-sky gradient text effect for headings.

### `.glass`
Glassmorphism effect (used on Navbar):
- Light: `rgba(255,255,255,0.8)` + `blur(12px)`
- Dark: `rgba(17,24,39,0.8)` + `blur(12px)`

### `.animate-fade-in-up`
Entrance animation: fade + slide up (0.6s ease-out)

## Component Styling Patterns

### Rounded Corners
- Cards: `rounded-xl` (12px)
- Buttons: `rounded-lg` (8px)
- Badges: `rounded-full`
- Inputs: `rounded-lg`

### Shadows
- Cards on hover: `hover:shadow-md`
- Search bar: `shadow-lg`
- Modals: `shadow-xl`

### Borders
- Cards: `border border-gray-200 dark:border-gray-700`
- Inputs: `border border-gray-300 dark:border-gray-600`
- Sections: `border-t border-gray-200 dark:border-gray-800`

### Max Widths
- Page content: `max-w-7xl` (80rem)
- Narrow content: `max-w-3xl` or `max-w-2xl`
- Forms: `max-w-md` (28rem)

### Spacing
- Page padding: `px-4 sm:px-6 lg:px-8 py-8` or `py-12`
- Section spacing: `py-20`
- Card padding: `p-6`
- Grid gaps: `gap-6` or `gap-8`

## Button Variants
| Variant | Light | Dark |
|---------|-------|------|
| primary | `bg-blue-600 text-white` | same |
| secondary | `bg-gray-100 text-gray-900` | `bg-gray-800 text-gray-100` |
| outline | `border-gray-300 text-gray-700` | `border-gray-600 text-gray-300` |
| ghost | `text-gray-700 hover:bg-gray-100` | `text-gray-300 hover:bg-gray-800` |
| danger | `bg-red-600 text-white` | same |

## Badge Variants
| Variant | Colors |
|---------|--------|
| default | gray |
| success | green |
| warning | yellow |
| error | red |
| info | blue |

## Service Card Colors
```
Visa:           bg-blue-100    text-blue-600
GIC/Banking:    bg-green-100   text-green-600
Accommodation:  bg-purple-100  text-purple-600
Test Prep:      bg-orange-100  text-orange-600
Financial:      bg-emerald-100 text-emerald-600
Applications:   bg-rose-100    text-rose-600
```

## Responsive Breakpoints (Tailwind defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Common Patterns
```tsx
// Section heading pattern
<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
  Text <span className="gradient-text">Highlighted</span>
</h2>

// Card hover pattern
<div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">

// Icon container pattern
<div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
  <Icon className="h-6 w-6" />
</div>
```
