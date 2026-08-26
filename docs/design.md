# 🎨 StockVista Design System & Aesthetics

> **Document Type**: UI/UX Design Specification
> **Version**: 1.0
> **Status**: ✅ APPROVED

StockVista is designed to be a premium, state-of-the-art financial tracking application. The aesthetics must wow the user at first glance, combining professional data visualization with modern, dynamic web design principles.

---

## 1. Core Philosophy

- **Premium Feel**: Avoid generic designs. Use curated color palettes, glassmorphism, and deep shadows to create depth.
- **Dynamic & Alive**: The interface should feel responsive. Every interaction should be accompanied by subtle micro-animations.
- **Clarity in Complexity**: Financial data is complex. Use whitespace, typography hierarchy, and color cues to make it instantly readable.

---

## 2. Color Palette

We utilize a sleek, deep dark mode by default to reduce eye strain and make vibrant market indicators pop.

### Base Colors (Deep Dark Theme)
- **Background**: `#0a0a0b` (Deepest charcoal/black for maximum OLED contrast)
- **Surface / Card Background**: `#141416` (Slightly elevated dark gray)
- **Elevated Surface (Modals/Dropdowns)**: `#1f1f22`
- **Borders & Dividers**: `#27272a` (Subtle separation)

### Market Indicators (Vibrant Accents)
- **Positive / Gain (Bullish)**: `#00d09c` (Vibrant Emerald Green)
  - *Hover*: `#00e6ad`
  - *Glow*: `rgba(0, 208, 156, 0.2)`
- **Negative / Loss (Bearish)**: `#ff6b6b` (Soft but vivid Crimson)
  - *Hover*: `#ff8787`
  - *Glow*: `rgba(255, 107, 107, 0.2)`

### Typography Colors
- **Primary Text**: `#f4f4f5` (Zinc 50 - High emphasis)
- **Secondary Text**: `#a1a1aa` (Zinc 400 - Medium emphasis, metadata)
- **Disabled Text**: `#52525b` (Zinc 600 - Low emphasis)

---

## 3. Typography

Modern, clean, and highly legible typography is essential for reading financial tickers and numbers.

- **Primary Font**: **Inter** (or **Outfit** for headings)
- **Monospace (for numbers/tickers)**: **JetBrains Mono** or **Roboto Mono**
  - *Why?* Tabular lining ensures numbers align perfectly in vertical columns (like watchlists and order books).

**Hierarchy:**
- `h1` (App Title/Hero): 48px, Bold, Tracking -0.02em
- `h2` (Section Titles): 24px, Semi-Bold
- `Body` (General Text): 16px, Regular, Line-height 1.5
- `Ticker/Price`: 32px, Medium, Monospace, Tracking -0.01em

---

## 4. Visual Effects & Components

### 4.1 Glassmorphism & Depth
- **Navbar & Sticky Headers**: Implement a backdrop blur (`backdrop-filter: blur(12px)`) with a semi-transparent background (`rgba(10, 10, 11, 0.8)`) to give a frosted glass effect as content scrolls underneath.
- **Shadows**: Use multi-layered soft drop shadows to lift interactive elements off the background.
  - *Card Shadow*: `0 4px 20px -2px rgba(0, 0, 0, 0.5)`

### 4.2 Card Design
- **Border Radius**: `12px` (Soft but professional)
- **Borders**: 1px solid `#27272a`
- **Hover State**: Lift the card (`transform: translateY(-2px)`) and slightly brighten the border (`border-color: #3f3f46`) with a smooth `200ms ease-in-out` transition.

---

## 5. Micro-Animations & Interactions

To make the app feel "alive", implement the following micro-interactions:

1. **Live Price Updates (Tick Flashes)**:
   - When a stock price increases, flash the background of the price component with a subtle green glow (`rgba(0, 208, 156, 0.15)`) that fades out over `500ms`.
   - When it decreases, flash with red (`rgba(255, 107, 107, 0.15)`).
2. **Button Interactions**:
   - `active` (click) state: Scale down slightly (`transform: scale(0.97)`).
3. **Page Transitions**:
   - Fade in and slide up slightly (`translateY(10px)` to `0`) when navigating between pages or loading new stock data.
4. **Skeleton Loaders**:
   - Replace standard spinners with shimmering skeleton placeholders that match the exact shape of the incoming data (e.g., table rows, chart boxes).

---

## 6. Charting Aesthetics

The TradingView Lightweight Charts must seamlessly blend with the app's theme.
- **Chart Background**: Transparent (inherit from the surface card).
- **Grid Lines**: Very faint (`#1f1f22`).
- **Candlesticks**: Solid `#00d09c` for up, solid `#ff6b6b` for down. Remove borders from the candles for a cleaner, modern look.
- **Crosshair**: Dotted, `#71717a` with a smooth tracking animation.

---

## 7. SEO & Accessibility Best Practices

Even though it's an app-like experience, the public pages must adhere to strict SEO and accessibility guidelines:
- **Contrast Ratios**: Ensure all text passes WCAG AA contrast standards against its background.
- **Semantic HTML**: Proper use of `<nav>`, `<main>`, `<article>`, and heading hierarchy (`h1` -> `h2` -> `h3`).
- **Dynamic Meta Tags**: Next.js must dynamically update the `<title>` and `<meta name="description">` based on the stock being viewed (e.g., "Reliance Industries (RELIANCE) Live Share Price & Chart | StockVista").
