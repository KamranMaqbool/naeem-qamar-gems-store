---
name: Luxe Facet
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#404944'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#242f41'
  on-tertiary: '#ffffff'
  tertiary-container: '#3a4558'
  on-tertiary-container: '#a7b2c9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-label:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin: 24px
  max_width: 1440px
---

## Brand & Style
The design system focuses on an elevated, professional admin experience for high-end luxury commerce. It blends **Minimalism** with **Corporate Modern** aesthetics to ensure data clarity while maintaining the prestige of a gemstone brand. The emotional response should be one of precision, security, and quiet luxury.

The style utilizes high-end "Deep Emerald Green" to ground the interface in a sense of established value and expertise. Whitespace is used generously to prevent information density from becoming overwhelming, ensuring that high-value inventory items remain the focal point of the dashboard.

## Colors
This design system employs a sophisticated palette centered around a rich, deep emerald.

- **Primary (#064E3B):** Used for key brand moments, primary actions, and selected states.
- **Secondary/Success (#10B981):** A brighter green used for positive indicators and active accents.
- **Neutral/Background (#F8FAFC):** A cool, crisp gray that provides a clean canvas for content.
- **Surface (#FFFFFF):** Pure white used for cards and table containers to create distinct layers.
- **Text (#1E293B):** A dark slate ensures maximum legibility and high contrast without the harshness of pure black.
- **Navigation:** The sidebar uses a dark variant of the primary color or deep slate to provide a strong structural anchor.

## Typography
Inter is the foundation of this system, chosen for its exceptional legibility in data-heavy environments. 

- **Headlines:** Use tight letter spacing (-0.01em to -0.02em) for larger sizes to maintain a premium feel.
- **Body:** Standardized at 14px for the majority of UI elements to balance information density and readability.
- **Labels:** Uppercase labels with slight tracking are reserved for metadata and section headers within widgets to create clear visual hierarchy.

## Layout & Spacing
The system utilizes a **Fixed Grid** approach for desktop views to maintain a curated, professional feel, while transitioning to a fluid model for tablet and mobile.

- **Desktop (1280px+):** 12-column grid with 24px gutters. Content is centered in a container with a maximum width of 1440px.
- **Tablet (768px - 1279px):** 8-column grid with 16px gutters and 24px side margins.
- **Mobile (Up to 767px):** 4-column grid with 16px gutters and 16px side margins. Sidebar collapses into a hamburger menu.

A base unit of 4px governs all spacing, ensuring a mathematically consistent rhythm throughout the dashboard.

## Elevation & Depth
Hierarchy is established through **Tonal Layers** and **Ambient Shadows**.

- **Level 0 (Background):** #F8FAFC. The lowest layer.
- **Level 1 (Cards/Tables):** #FFFFFF. White surfaces are elevated with a subtle "Resting" shadow: `0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)`.
- **Level 2 (Hover/Active):** Surfaces lifted during interaction use a more pronounced "Floating" shadow: `0px 10px 15px -3px rgba(0, 0, 0, 0.08)`.
- **Level 3 (Modals/Popovers):** Deep shadows to create clear separation from the workspace.

Crisp 1px borders in #E2E8F0 are used on all Surface elements to maintain structural definition even in high-brightness environments.

## Shapes
The shape language is sophisticated yet modern, using **Rounded (xl)** corners for major containers and buttons.

- **Containers & Cards:** Use `rounded-xl` (1.5rem / 24px) to soften the professional layout.
- **Input Fields & Buttons:** Use `rounded-lg` (1rem / 16px) for a modern, approachable feel.
- **Badges/Chips:** Strictly pill-shaped (full radius) to contrast against the more structured rectangular elements.

## Components

### Buttons
- **Primary:** Deep Emerald background, white text. High-contrast, bold weight.
- **Secondary:** White background, Slate Dark border (1px), Slate Dark text.
- **Tertiary/Ghost:** No background or border, Slate Dark text. Used for less frequent actions.

### Data Tables (Enterprise Grade)
- **Header:** Light gray background (#F1F5F9), uppercase label-md typography.
- **Rows:** White background, 1px bottom border (#F1F5F9).
- **Cells:** Vertical padding of 16px to ensure "breathing room" for SKU data and prices.

### Status Badges
- **Style:** Pill-shaped with a low-opacity background tint (10% of the status color) and high-opacity text (100% of the status color).
- **Example:** A "Paid" badge uses #10B981 at 10% for the background and #064E3B for the text.

### Sidebar Navigation
- **Background:** Deep Slate (#1E293B) or Deep Emerald (#064E3B).
- **Active State:** A vertical bar (4px) on the leading edge of the menu item using the Accent color (#10B981), paired with a subtle background highlight.

### Input Fields
- **Default:** 1px border (#E2E8F0), 16px horizontal padding.
- **Focus:** 1px border Primary (#064E3B) with a soft 4px glow in the same color at 10% opacity.