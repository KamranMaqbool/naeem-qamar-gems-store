---
name: Aurelian Emerald
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#414944'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#717973'
  outline-variant: '#c0c9c2'
  surface-tint: '#396752'
  primary: '#002215'
  on-primary: '#ffffff'
  primary-container: '#043927'
  on-primary-container: '#73a48c'
  inverse-primary: '#a0d1b8'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#1c1c1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#313131'
  on-tertiary-container: '#9a9998'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bbeed3'
  primary-fixed-dim: '#a0d1b8'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#204f3c'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

This design system embodies the quiet confidence of high-end jewelry, blending **Minimalism** with **High-Contrast** sophistication. The brand personality is one of curated excellence—exclusive yet inviting, rooted in the heritage of fine craftsmanship.

The visual direction prioritizes breathing room, allowing high-fidelity photography of gemstones to act as the primary structural element. The interface utilizes expansive whitespace and a rigorous grid to evoke the feeling of a physical luxury boutique. The emotional response should be one of serenity, prestige, and unwavering trust.

## Colors

The palette is anchored by **Pearl (#F9F8F5)**, which serves as the primary canvas to prevent the clinical feeling of pure white. **Deep Emerald (#043927)** provides a weighty, authoritative contrast for primary actions and key brand moments. **Champagne Gold (#D4AF37)** is used sparingly for decorative accents, subtle borders, and secondary highlights to signify value. Darker neutrals are reserved for text to ensure AAA accessibility against the pearl background.

## Typography

The typographic scale relies on a dramatic contrast between the romantic, high-contrast strokes of **Playfair Display** and the functional clarity of **Inter**. 

- **Headlines:** Use Playfair Display for all editorial and storytelling headers. Letter spacing should be slightly tightened for large display sizes.
- **Body:** Inter is used for technical specifications and narrative copy to maintain readability.
- **Labels:** Small caps with increased tracking are used for metadata, such as "Carat Weight" or "Material," to provide a structured, catalog-like feel.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model on desktop to maintain a centered, gallery-like experience. 
- **Desktop:** 12-column grid with a 1440px max-width.
- **Tablet:** 8-column grid with 32px side margins.
- **Mobile:** 4-column fluid grid with 20px side margins.

Horizontal spacing between sections should be aggressive (120px+) to emphasize the luxury of space. Elements should rarely feel "packed"; if in doubt, increase the padding.

## Elevation & Depth

To maintain a minimalist aesthetic, avoid heavy drop shadows. Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** Use subtle shifts from the Pearl background to a pure white (#FFFFFF) for elevated cards or modals.
- **Outlines:** Use 1px borders in Champagne Gold (#D4AF37) at 30% opacity to define boundaries without adding visual weight.
- **Interactions:** On hover, a soft, highly diffused ambient shadow (0px 10px 30px rgba(4, 57, 39, 0.05)) may be used to indicate lift.

## Shapes

The shape language is primarily **Soft (0.25rem)**. While the overall layout feels rectangular and architectural, the slight rounding on buttons and input fields prevents the UI from feeling sharp or aggressive. 

- **Small elements (Buttons, Tags):** 4px (0.25rem) radius.
- **Large elements (Product Cards, Modals):** 8px (0.5rem) radius.
- **Images:** Should remain sharp (0px) to echo the precision of a gemstone cut.

## Components

### Buttons
- **Primary:** Deep Emerald background, White text, 4px radius. High-padding (16px 32px).
- **Secondary:** Transparent background, 1px Champagne Gold border, Emerald text.
- **Ghost:** No background, Emerald text with a persistent 1px underline.

### Input Fields
- Use a "Minimalist Float" style: 1px bottom-border only in Emerald Green, moving to a full 1px Soft border on focus. Background remains Pearl.

### Product Cards
- No borders or shadows by default. Use large-scale imagery with text centered underneath in Playfair Display. On hover, the image should subtly scale (1.05x).

### Chips & Tags
- Used for "Limited Edition" or "New Arrival." Small caps, 1px Champagne Gold border, transparent background.

### Navigation
- A centered, minimalist top-bar. Use `label-caps` for links. The active state is indicated by a subtle gold dot beneath the text.