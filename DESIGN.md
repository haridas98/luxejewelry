# Design System: High-End Editorial Jewelry Experience

## 1. Overview & Creative North Star: "The Digital Atelier"
This design system is built on the philosophy of **The Digital Atelier**. We are moving away from the "e-commerce template" and toward a curated, editorial experience. The goal is to make the user feel as though they are browsing a high-end physical boutique or a limited-edition art book.

To achieve this, we reject the rigid, boxed-in layouts of traditional web design. Instead, we use **intentional asymmetry**, **exaggerated whitespace**, and **tonal layering**. Elements should feel like they are "resting" on fine paper rather than being locked into a digital grid. We prioritize the "breath" between products as much as the products themselves.

---

## 2. Colors & Surface Philosophy
The palette is a sophisticated interplay of `surface` (Warm White), `primary` (Deep Charcoal), and `secondary` (Soft Gold).

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. High-end design is felt through transitions, not demarcations. Separate your sections using background color shifts:
*   **Hero Section:** `surface` (#faf9f6)
*   **Product Feature:** `surface-container-low` (#f4f3f1)
*   **Footer/Impact Zones:** `primary-container` (#1c1b1b)

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to create "nested" depth without using shadows:
*   **Base:** `surface` (#faf9f6)
*   **Cards/Insets:** Place `surface-container-lowest` (#ffffff) elements on top of `surface-container` (#efeeeb) to create a soft, natural lift.

### Signature Textures & Glass
*   **The Golden Gradient:** For main CTAs or high-impact accents, use a subtle linear gradient from `secondary` (#775a19) to `secondary-fixed-dim` (#e9c176). This mimics the way light hits brushed gold.
*   **The Glass Rule:** For floating navigation or quick-view overlays, use `surface` at 80% opacity with a `20px` backdrop-blur. This keeps the experience integrated and airy.

---

## 3. Typography
We use a high-contrast typographic scale to establish an editorial rhythm.

*   **Display & Headlines (Noto Serif):** These are your "voice." Use `display-lg` for hero moments. Encourage **tight letter-spacing (-2%)** on large headings to give them a custom, printed feel. Use `headline-md` for product names to evoke prestige.
*   **Body & UI (Manrope):** Our functional workhorse. Manrope provides a clean, technical contrast to the romantic serif. 
    *   **Body-lg:** Used for storytelling and descriptions.
    *   **Label-md:** Always uppercase with **+10% letter-spacing** for navigation and small UI hints to mimic luxury branding.

---

## 4. Elevation & Depth: Tonal Layering
We do not use standard "Drop Shadows." Depth is achieved through light and material.

*   **The Layering Principle:** Avoid elevation levels 1-5. Instead, use `surface-container-high` (#e9e8e5) to define an active area within a `surface` page.
*   **Ambient Shadows:** If a component *must* float (e.g., a cart drawer), use a shadow with a `40px` blur, `0%` spread, and a color derived from `on-surface` at **4% opacity**. It should be felt, not seen.
*   **The Ghost Border:** If accessibility requires a boundary, use the `outline-variant` (#c4c7c7) at **15% opacity**. This creates a "whisper" of a line that disappears into the background.

---

## 5. Components

### Buttons
*   **Primary:** `primary` (#000000) background with `on-primary` (#ffffff) text. **0px border-radius**. High-padding (1.4rem horizontal).
*   **Secondary (The Gold Link):** No background. `secondary` (#775a19) text with a `1px` underline using the `secondary` token. 
*   **States:** On hover, primary buttons should shift to `primary-container` (#1c1b1b) with a subtle `0.5s` ease-in-out transition.

### Cards & Lists
*   **Prohibition:** Never use divider lines.
*   **The Grouping Rule:** Use the **Spacing Scale (10 or 12)** to separate list items. If more distinction is needed, use a `surface-container-low` background for alternating items.
*   **Jewelry Cards:** Product images should have a `surface-variant` (#e3e2e0) background to make the jewelry pop. Do not use borders around images.

### Input Fields
*   **Styling:** Minimalist. A single `1px` bottom border using `outline-variant` (#c4c7c7). 
*   **Labels:** Use `label-md` in uppercase above the field.
*   **Focus:** The bottom border transitions to `secondary` (#775a19).

### Bespoke Component: The "Atelier Carousel"
Instead of a standard slider, use an asymmetrical layout where the image occupies 60% of the screen (on the `surface` layer) and the product details sit on a floating `surface-container-lowest` card that overlaps the image edge by `spacing-6`.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Offset images and text blocks. If a product description is left-aligned, try right-aligning the price at the bottom to create visual tension.
*   **Use White Space as a Luxury Asset:** Treat empty space as "the cost of luxury." More space equals a higher price point.
*   **Tonal Transitions:** Use `surface-dim` for transitions between major page sections (e.g., transitioning from a bright gallery to a dark "Story" section).

### Don't:
*   **No Rounded Corners:** Use the `0px` scale across every element. Sharp corners signify precision and architectural intent.
*   **No Pure Grey Shadows:** Never use `#000000` at 20% for shadows. Always tint your shadows with the background hue.
*   **No Standard Grids:** Avoid placing 4 products in a row. Try a sequence of 1 large (2 columns) followed by 2 small (1 column each) to maintain an editorial feel.