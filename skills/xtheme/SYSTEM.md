# Crossmedia Design System

A reusable guide for Crossmedia digital products: portals, admin consoles and internal or client-facing tools. It grew out of the unified SSO portal, but it is written to be applied to any new project.

**Guiding idea:** sober and technical. Cool neutral backgrounds, the brand navy as the colour of command, a single accent, and all hierarchy carried by type and space — not by colour or ornament.

---

## 1. Principles

1. **The brand drives action, not background.** Navy appears in primary buttons, active states and monograms; never as a full-screen background (the sign-in welcome column is the one exception).
2. **One colour per meaning.** Green = success, amber = needs attention, red = error or destructive. No decorative colour.
3. **High density, enough air.** These are working tools: a lot of data fits, but every block breathes 16–24 px.
4. **No gradients, no emoji, no large shadows.** Shadows only separate floating layers (panels, menus, mobile sheets).
5. **Light and dark are designed together.** If a tone has no counterpart in the other mode, it does not enter the system.

---

## 2. Logo

| Version | Use | File |
|---|---|---|
| Primary (navy) | Light backgrounds: `#FFFFFF`, `#F4F5FA` | [`assets/logo.svg`](assets/logo.svg) |
| Light (white `#FFFFFF` + lavender `#9EA8EE`) | Dark backgrounds: `#0C0E1C`, `#151830`, `#1A1C42` | [`assets/logo-dark.svg`](assets/logo-dark.svg) — recoloured, not inverted |

- **Height:** 20 px in the desktop top bar · 16 px on mobile · 26–30 px on sign-in screens and covers.
- **Minimum clearspace:** the height of the "C" on every side.
- **Client co-branding:** Crossmedia logo · 1 px vertical divider (`#E1E4F0` / `#2A2F52`, 26 px tall) · 14 px of air · client logo at the same optical height. The client logo never comes first.
- Never: scale non-proportionally, add a shadow, recolour outside the two versions, or place it over photography.

---

## 3. Colour

### 3.1 Light mode

| Role | Hex | Use |
|---|---|---|
| Background | `#F4F5FA` | Application canvas |
| Surface | `#FFFFFF` | Cards, tables, bars, panels |
| Alt surface | `#FAFBFE` | Table header, table footer |
| Border | `#E1E4F0` | Card borders, bar dividers |
| Soft border | `#EEF0F7` | Row separators |
| Strong border | `#C9CEE4` | Field and secondary-button borders |
| Primary text | `#14163A` | Headings and content |
| Secondary text | `#4A4F72` · `#5A5F80` | Descriptions, field labels |
| Tertiary text | `#6B7194` | Captions, metadata (accessible floor) |
| Brand dark | `#272757` | Primary button, monograms, active state |
| Brand mid | `#40478D` | Secondary monograms, charts |
| Action | `#3B44A0` | Links and tertiary buttons |
| Accent | `#0A7C86` | Sparing use: categories, monograms |
| Selected | `#EEF0FA` | Active row or item background |
| Selected strong | `#E7E9F6` | Administrator role tag |

### 3.2 Dark mode

| Role | Hex | Use |
|---|---|---|
| Background | `#0C0E1C` | Canvas |
| Surface | `#151830` | Cards, bars |
| Raised surface | `#1C2040` | Fields, menus, inner rows |
| Active surface | `#262C55` | Active navigation item |
| Border | `#2A2F52` | General borders |
| Soft border | `#242849` | Inner separators |
| Strong border | `#3C4270` | Fields and secondary buttons |
| Primary text | `#EDEEF7` | Headings and content |
| Secondary text | `#A2A8C6` · `#C7CBE2` | Descriptions |
| Tertiary text | `#8F95B8` | Metadata |
| Action | `#8B95F0` | Links, active icons |
| Solid action | `#5761D6` | Primary button on dark |
| Accent | `#46CFD8` | Sparing use |

### 3.3 Semantic

| State | Light (text / background) | Dark (text / background) |
|---|---|---|
| Success | `#145C40` / `#E4F3EC` · dot `#1B7F58` | `#7BD7AC` / `#16382B` · dot `#4FBF8B` |
| Warning | `#7D4707` / `#FBEFDF` · dot `#C77A10` | `#E8B96A` / `#3B2C10` |
| Error | `#8F241C` / `#FBE9E7` · dot `#A72B22` | `#F0A9A2` / `#2A1817` |
| Neutral | `#4A4F72` / `#F2F3F9` | `#C7CBE2` / `#262C55` |

### 3.4 Tokens

[`assets/tokens.css`](assets/tokens.css) holds every value above as a CSS custom property (`--cm-*`): light values on `:root`, dark values on `[data-theme="dark"]`. It is the single source of truth. When a project's UI library has its own theme object, map each `--cm-*` token into it — never retype a hex value.

Theme switching: a `data-theme` attribute on `<html>`, with three user options (light / dark / follow system). "Follow system" sets `data-theme` from the `prefers-color-scheme` media query and updates it when that query changes. The preference is stored on the account, not only in the browser.

---

## 4. Typography

| Family | Role | Weights | Fallback |
|---|---|---|---|
| **Montserrat** | The whole interface: headings, text, labels and monograms | 400 · 500 · 600 · 700 | `system-ui, sans-serif` |
| **IBM Plex Mono** | Technical data: IPs, identifiers, timestamps, URLs, keys, config snippets | 400 · 500 | `ui-monospace, monospace` |

Montserrat is geometric and wide: at the same size it takes more room than a neutral grotesque. In dense blocks (tables, 13 px rows) check that no column breaks words, and reach for weight 600 before reaching for a larger size. Banned: Inter, Roboto, Arial and any "close enough" substitute. If a platform cannot load web fonts, use the system fallback — never another brand typeface.

Loading:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
```

### Scale

Everything in Montserrat except the last row.

| Name | Size / weight | Use |
|---|---|---|
| Display | 44 / 600, tracking −0.02em | Covers and sign-in screen |
| Screen title | 32 / 600, −0.015em | Portal `h1` |
| Section title | 26 / 600, −0.012em | Admin screen `h1` |
| Subtitle | 19–20 / 600 | Panel or modal header |
| Card | 17 / 600 | Tool name |
| Eyebrow | 15 / 600, +0.04em, uppercase | "YOUR TOOLS" |
| Body | 15 / 400, leading 1.55 | Supporting paragraphs |
| UI | 13.5 / 600 | Buttons, rows, navigation |
| Data | 13 / 400 | Table cells |
| Field label | 12.5 / 600 | `label` |
| Secondary | 12 / 400 | Help text and captions |
| Micro label | 11.5 / 600, +0.05em, uppercase | Table headers, group headings |
| Mono | 11.5–13 / 400 (IBM Plex Mono) | IPs, identifiers, exact dates |

Rules: `text-wrap: pretty` on paragraphs; never below 11.5 px; uppercase always with positive tracking; figures that are compared down a column go in Mono.

---

## 5. Spacing, radii and measurements

- **Scale:** 4 · 8 · 12 · 16 · 24 · 32 · 40 · 56. Every `gap` and `padding` comes from this.
- **Radii:** 6 px tags and chips · 9–10 px controls and fields · 13–14 px cards and panels · 20–26 px mobile sheets and floating buttons · 50% avatars.
- **Borders:** always 1 px; 2 px only for focus and selection.
- **Fixed application measurements:**

| Element | Desktop | Mobile |
|---|---|---|
| Top bar | 64 px | 56 px (plus safe area — never draw a fake status bar) |
| Sidebar | 246 px (admin) · 258 px (account) | — |
| Content margin | 24–32 px (admin) · 56 px (portal) | 16 px |
| Side panel width | 408–556 px | full-screen sheet |
| Bottom navigation | — | 76 px, 4 destinations |
| Table row height | 50–62 px | 84–96 px card |
| Minimum touch target | 44 × 44 px | 44 × 44 px |

- **Card grid:** 3 columns at 1440 px, 2 at 1024 px, 1 at 768 px; 18 px gap. Always `display: grid` with `repeat(N, minmax(0, 1fr))`, never fixed widths.

---

## 6. Iconography

- Stroke, never filled. 24 grid, weight **1.7–1.8** (2 for small arrows and chevrons), round caps and joins.
- Sizes: 22 px mobile navigation · 19 px top bar · 17 px sidebar · 16 px buttons · 14 px inline with text.
- Colour: `currentColor`. The icon inherits the colour of the text beside it.
- Every icon-only button carries an `aria-label`. Decorative icons get `aria-hidden="true"`.
- Never emoji as a UI glyph.

---

## 7. Components

### Buttons · 40 px (compact) or 42 px (forms)

| Variant | Light | Dark |
|---|---|---|
| Primary | `#272757` fill, white text | `#5761D6` fill, white text |
| Secondary | surface fill, `#C9CEE4` border, `#14163A` text | `#1C2040` fill, `#3C4270` border |
| Tertiary | no fill or border, `#3B44A0` text | `#8B95F0` text |
| Destructive | surface fill, `#E8C3BF` border, `#8F241C` text | `#55302C` border, `#F0A9A2` text |

Radius 10 px, text 13.5/600, 16–22 px side padding, optional 16 px icon with an 8 px gap. One primary button per screen or per panel.

### Fields

40–46 px tall, 9–10 px radius, `#C9CEE4` border, 12–14 px side padding, 14 px text.
- **Focus:** 2 px `#3B44A0` border plus `0 0 0 3px rgba(59,68,160,.14)` halo.
- **Disabled:** `#F4F5FA` fill, `#E1E4F0` border, `#767CA0` text, with one line of help explaining *why* it is locked.
- Always an associated `<label>`. If the design hides it, hide it with `clip-path: inset(50%)`, never `display: none`.
- Search field: 16 px magnifier on the left, keyboard shortcut in Mono inside a pill on the right.

### Selection

Native checkboxes and radios at 16–18 px with `accent-color: #272757`. Switch: 44 × 26 px, radius 13, 20 px white knob. The label is always clickable.

### Status tags

- **With dot** (live state): pill, radius 20, 4–5 / 9–10 px padding, 11.5/600 text, 6 px dot in the solid colour.
- **Without dot** (classification: role, protocol): rectangle, radius 6, same text, neutral or selected fill.
- Never colour alone: the state is always spelled out in words.

### Avatars and monograms

People: circle, two initials, Montserrat 600. Tools and clients: rounded square (9–11 px), two letters. Sizes 24 · 28 · 32 · 38 · 44 · 68. Backgrounds rotate through the brand palette (`#272757`, `#40478D`, `#3B44A0`, `#0A7C86`, `#2F6F8F`, `#4A4F72`); text is always white. Stacked group: −8 px overlap, 2 px border in the background colour, and a grey `+N` chip at the end.

### Client logo slot

Until a real logo exists: rectangle with a dashed `#C1C7DE` border, radius 6–8, the word `LOGO` in Mono at 7.5–9 px, colour `#6B7194`. It marks the slot without faking a brand.

### Cards

Surface, 1 px border, radius 14, 20 px padding, card shadow. If the whole card navigates, build it as an `<a>` and make the inner "Open" a `<span>` — never a `<button>` inside a link. Footer separated by an `#EEF0F7` rule, metadata left, action right.

### Tables

42–44 px header on `#FAFBFE` in micro-label type. Rows 50–62 px, separated by `#EEF0F7`. Selected row: `#F7F8FE` fill; highlighted row: plus a 3 px `#272757` bar on the left. Use `display: grid` with an explicit `grid-template-columns`, never a `<table>` with automatic widths. The last column is the action menu (three-dot button, 30 px).

With multi-select, a bar appears above the table: `#EEF0FA` fill, `#C8CEEF` border, count on the left and bulk actions on the right, the destructive one always last and in red.

### Navigation

- **Top bar:** logo · divider · client switcher · centred search (420 px) · launcher · alerts · avatar with name and role. Surface fill, 1 px bottom border.
- **Launcher:** 392 px floating menu, radius 16, 3-column grid of monogram plus name, with admin entries and sign-out below.
- **Sidebar:** 42 px links, radius 9, 17 px icon. Active: `#EEF0FA` fill and `#272757` text at 600. "Back to the portal" at the top; sign out in soft red at the bottom.
- **Mobile:** four fixed destinations at the bottom, 22 px icon over an 11 px label; the active one in brand colour at weight 600.

### Panels and sheets

Side panel: 408–556 px wide, panel shadow, a header with title, subtitle and close, a body with sections 18 px apart, and a fixed footer with right-aligned actions. The screen behind is dimmed with `rgba(20,22,58,.26)`. On mobile the same content rises as a sheet with a 22 px top radius and a 42 × 4 px grab handle.

### Empty and error states

A flat geometric illustration in the system greys (never a photo or a giant icon), a 20/600 title, one or two sentences saying *what happened* and *what to do*, and at most two actions. Errors carry a reference in Mono (`ERR-0000`) so support can trace them.

---

## 8. Accessibility

- Minimum contrast 4.5:1 (3:1 from 24 px up). Measured values in this system: primary text 17.4:1 on white; `#5A5F80` 6.2:1; `#3B44A0` 8.3:1; white on `#272757` 13.9:1; in dark, `#EDEEF7` 15.1:1 and `#8F95B8` 5.9:1 on `#151830`.
- **Watch `#767CA0`: it lands at 4.07:1 on white.** Use it only for icons and decorative elements; for small text the minimum grey is `#6B7194` (4.76:1).
- Always real controls: `<button>`, `<a href>`, `<input>` with a `<label>`. A `div` with `onClick` is skipped by Tab and announced by nothing.
- Visible focus on every interactive element, using the same halo as the fields.
- State is never carried by colour alone: word plus colour, or word plus icon.
- 44 px touch targets on mobile, list rows included.

---

## 9. Writing (UI copy)

These rules hold in every UI language. The examples are in English; write the real copy in the project's UI language.

- Neutral and implicitly formal in buttons, alerts and errors. Greeting headlines may be informal ("Hi, Daniel").
- Buttons are verbs or nouns: *Save changes*, *Invite user*, *Export CSV*. No exclamation marks anywhere.
- Relative dates while recent ("2 h ago", "yesterday") and absolute from a week out ("12 Aug"). Technical logs are always absolute and in Mono.
- Missing data is marked in uppercase brackets — `[CLIENT NAME]`, `[YOUR ROLE]` — never invented.
- Error messages say what failed, what the system did about it, and what the person can do.

---

## 10. Checklist

- [ ] The tokens from 3.4 are in the project (directly or mapped into the UI library's theme), and the `data-theme` switch works across all three options.
- [ ] Both type families load, with fallbacks declared.
- [ ] Both logo versions are in the repository, and the co-branding block respects divider and clearspace.
- [ ] No text grey lighter than `#6B7194` in light mode.
- [ ] Every screen has been checked at 1440, 1024 and 390 px wide.
- [ ] Every screen exists in light and dark.
- [ ] Every icon-only button has an `aria-label`.
- [ ] Every list has an empty state, a loading state and an error state.
- [ ] One primary button per screen.
- [ ] No invented data: gaps are left in brackets.

---

*Version 1.0 · derived from the unified SSO portal · Crossmedia*
