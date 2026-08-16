# Better Auth Design System Specification

## 1. Design Intent & Mission
Create implementation-ready, token-driven UI guidance for Better Auth that is optimized for consistency, accessibility, and fast delivery across dashboard web applications.

---

## 2. Brand & Product Context
- **Product/Brand**: Better Auth
- **URL**: `https://dash.better-auth.com/kjhj`
- **Audience**: Authenticated users, system administrators, and operators.
- **Product Surface**: Dashboard web application, developer console, and real-time observability telemetry.
- **Visual Style**: Structured, monolithic, tokenized, content-first, sharp-edged, high-density dark mode.
- **Component Density Metrics**: Links (44), Buttons (15), Lists (2), Cards (1), Navigation (1).

---

## 3. Style Foundations & Semantic Tokens

### 3.1 Typography
The typography system must use the Geist font family stack across all viewports. The base typography is compact and high-density (`12px`).

| Token | Value | Description / Usage |
| :--- | :--- | :--- |
| `font.family.primary` | `Geist` | Primary typeface across all UI elements |
| `font.family.stack` | `Geist, "Geist Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | Fallback stack |
| `font.size.base` | `12px` | Base font size across dashboard |
| `font.weight.base` | `500` | Default body weight |
| `font.lineHeight.base` | `16px` | Default body line height |
| `font.size.xs` | `10px` (Line height: `14px`) | Micro badges, status labels, metadata timestamps |
| `font.size.sm` | `11px` (Line height: `15px`) | Secondary table cells, code annotations, helper labels |
| `font.size.md` | `12px` (Line height: `16px`) | Primary body, inputs, buttons, navigation items |
| `font.size.lg` | `14px` (Line height: `18px`) | Card headers, table headings, tab labels |
| `font.size.xl` | `16px` (Line height: `22px`) | Section titles, modal headers |
| `font.size.2xl` | `18px` (Line height: `24px`) | Primary page headers, major subtitles |
| `font.size.3xl` | `20px` (Line height: `26px`) | Key metric callouts, stat numbers |
| `font.size.4xl` | `30px` (Line height: `36px`) | Hero titles, large stat values |

### 3.2 Color Palette & Semantic Tokens
All colors must reference semantic tokens. Raw arbitrary hex codes must not be used in component styling.

| Token | Value | Semantic Application |
| :--- | :--- | :--- |
| `color.surface.base` | `#000000` | Primary page canvas and deep dark containers |
| `color.surface.muted` | `oklab(0.273999 0.00165433 -0.00575992 / 0.3)` | Card containers, dropdown menus, table alternating rows |
| `color.text.primary` | `lab(98.26 0 0)` | Primary headings, titles, active tab labels |
| `color.text.secondary`| `lab(65.6464 1.53497 -5.42429)` | Subtitles, muted labels, inactive tab labels |
| `color.text.tertiary` | `lab(96.1634 0.0993311 -0.364041)` | Code snippets, high-contrast badges |
| `color.text.inverse` | `#38bdf8` | Highlighted links, active indicators, cyan callouts |
| `color.border.default`| `lab(100 0 0 / 0.1)` | Crisp structural container and divider borders |
| `color.border.strong` | `#34d399` | Online status rings, success borders, active pills |
| `color.focus.ring` | `oklab(0.551998 0.00438744 -0.0153712 / 0.5)` | 2px focus-visible outline for keyboard navigation |
| `color.state.error` | `lab(56.2 68.3 40.1)` | Destructive buttons, error alerts, failure badges |

### 3.3 Spacing Scale
All margins, paddings, and flex/grid gaps must adhere to the 7-step spacing scale:

| Token | Value | Typical Usage |
| :--- | :--- | :--- |
| `space.1` | `2px` | Icon-to-label micro padding, badge internal vertical padding |
| `space.2` | `4px` | Button inline icon gap, dense list item spacing |
| `space.3` | `8px` | Form field spacing, standard button padding, tag gap |
| `space.4` | `12px` | Container internal padding, table cell padding |
| `space.5` | `16px` | Card padding, section layout gaps, modal padding |
| `space.6` | `20px` | Page grid gaps, major component separations |
| `space.7` | `28px` | Section margins, dashboard layout margins |

### 3.4 Radius, Shadow & Motion Tokens
- **Border Radius**: Must be `0px` (`rounded-none`). Crisp, monolithic, sharp borders.
- **Shadow Tokens**:
  - `shadow.1`: `rgba(0, 0, 0, 0) 0px 0px 0px 0px` (Flat structural depth).
- **Motion Duration**:
  - `motion.duration.instant`: `150ms` (Hover color shifts, toggle switches).
  - `motion.duration.fast`: `300ms` (Modals, popovers, slide drawers).
  - Timing function: `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 4. Application Shell & Navigation Architecture

### 4.1 Top Bar
- **Logo & Brand**: Left-aligned `BETTER-AUTH.` logo in bold uppercase tracking with square icon.
- **Search Shortcut**: `⌘K` command shortcut button with `#27272a` border.
- **Surface**: Fixed `h-11` pitch black `#000000` with bottom border `color.border.default`.

### 4.2 Bottom Navigation Dock
- **Fixed Dock**: Docked at the bottom viewport `fixed bottom-0 left-0 right-0 h-11 bg-black border-t border-[#27272a] z-40`.
- **Numbered Navigation Tabs**:
  - `01 Overview`: Telemetry dashboard, metrics, world map, and advisory feed.
  - `02 Jobs`: Monitoring job endpoints, health statuses, and ping controls.
  - `03 Organizations`: Multi-tenancy and team directory.
  - `04 Events`: Real-time activity log stream.
  - `05 Sentinel`: Bot detection and attack prevention.
  - `06 Settings`: Project configuration, webhook destinations, and credentials.
- **Right Utilities**: Project indicator (`Kjhj`), and User profile with avatar (`My Account Mahesh Chopade`).

---

## 5. Component-Level Specifications

### 5.1 Buttons (15 Density Target)
- **Variants**: Default (Off-white `#e4e4e7`), Secondary (Muted `#18181b`), Outline (Bordered), Ghost, Destructive, Link, Icon.
- **Mandatory 7 States**: Default, Hover, Focus-Visible, Active, Disabled, Loading, Error.
- **Keyboard/Touch**: `Enter` / `Space` triggers; `44px` touch bounding box on mobile.

### 5.2 Links (44 Density Target)
- **Variants**: Default (`text-white hover:text-zinc-300`), Muted (`text-secondary`), Subnav Tab (`01 Overview` tab item with active highlight).
- **Mandatory 7 States**: Default, Hover, Focus-Visible, Active, Disabled, Loading, Error.

### 5.3 Lists & Tables (2 Density Target)
- **Anatomy**: Table header (`text-[10px] font-mono text-secondary uppercase`), rows with hover background `bg-white/[0.03]`, checkbox selection, relative timestamps.

### 5.4 Cards (1 Density Target)
- **Anatomy**: `bg-[#000000] border border-[#27272a] p-4 rounded-none`.

---

## 6. Accessibility Requirements (WCAG 2.2 AA)

1. **Contrast Compliance**:
   - `color.text.primary` on `color.surface.base` must achieve $\ge 7:1$ contrast ratio (**Pass**).
   - `color.text.secondary` on `color.surface.base` must achieve $\ge 4.5:1$ contrast ratio (**Pass**).
   - Interactive boundaries must achieve $\ge 3:1$ contrast ratio (**Pass**).
2. **Keyboard Navigation**:
   - Focus ring `oklab(0.551998 0.00438744 -0.0153712 / 0.5)` must be visible on all interactive elements.
3. **Screen Reader Semantics**:
   - `role="dialog"` on modals, `aria-live="polite"` on event streams, and connected `<label>` elements.

---

## 7. Content & Tone Standards
- **Tone**: Concise, confident, implementation-focused.
- **Action Labels**: Direct verbs (`Add User`, `New Job`, `Filter`, `Sign In`).

---

## 8. Anti-Patterns & Prohibited Implementations
- **No Rounded Bubbles**: Do not use `rounded-md`, `rounded-lg`, or `rounded-xl`.
- **No Low-Contrast Text**: Do not use gray shades below 4.5:1 contrast.
- **No Floating Modals Without Backdrop**: Dialogs must enforce strict focus trapping.

---

## 9. QA & Acceptance Verification Checklist
- [ ] Base typography is `12px` Geist with `16px` line height.
- [ ] Colors use `#000000` base, `lab(98.26 0 0)` text, `#38bdf8` cyan accents, `#34d399` emerald borders.
- [ ] Top bar contains `BETTER-AUTH.` and `⌘K`.
- [ ] Bottom navigation dock contains `01 Overview`, `02 Jobs`, `03 Organizations`, `04 Events`, `05 Sentinel`, `06 Settings`, and `My Account`.
- [ ] TypeScript checks and build checks pass with zero errors.
