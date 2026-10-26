---
name: xtheme
description: Apply the Crossmedia design system to a project — detect its UI libraries, write and approve a design, then build the theme, components and screens. Use when building or restyling any Crossmedia UI.
metadata:
  internal: false
---

# xtheme

The Crossmedia design system lives in three files beside this one:

| File | Holds |
| --- | --- |
| [`SYSTEM.md`](SYSTEM.md) | The rules: principles, logo, colour, type, spacing, icons, components, accessibility, copy, checklist. |
| [`PATTERNS.md`](PATTERNS.md) | Screen patterns: the rules combined on real screens. |
| [`assets/`](assets/) | `tokens.css`, `logo.svg` (light backgrounds) and `logo-dark.svg` (dark backgrounds). |

Read `SYSTEM.md` in full before step 3. Read `PATTERNS.md` before you design any screen.

The **design** comes before the app. Step 3 writes it outside the app's code; step 4 changes the
app only after the user approves that design.

If `docs/xtheme/DESIGN.md` already exists, the project ran this Skill before. Read it, tell the user
what it records, and ask whether to update the design or to go on building from it. Then start at
step 3 or step 4.

## 1. Survey the project

Look, do not ask yet. Find:

- **Framework** — React, Vue, Angular, Svelte, server-rendered templates, plain HTML.
- **UI libraries** — component libraries (for example MUI, shadcn/ui, Radix, Vuetify, PrimeVue,
  Angular Material) and styling systems (for example Tailwind, CSS Modules, Sass,
  styled-components). Read the package manifest and the config files.
- **Existing theme** — a theme object, CSS custom properties, a Tailwind config, global styles.
- **Existing logos and fonts** — files under the asset folders.
- **Screens** — the routes or pages that exist, and the `PATTERNS.md` pattern each one matches.

Done when you can list each of the five with a file path as evidence, or say "none found".

## 2. Ask the user

Show the survey, then ask these questions in one message:

1. **Libraries.** "The project uses `<libraries>`. Build the design system with them, or use other
   libraries?" If none were found, propose the lightest fit for the framework and ask.
2. **Scope.** "Restyle this existing app, or set up the design system for new work only?"
3. **Client logo.** "Does the app show a client's logo beside the Crossmedia one? If so, send the
   file, or use the client logo slot until it exists." The Crossmedia logo ships in `assets/`.
4. **UI language.** "Which language is the UI copy in?" The copy rules in `SYSTEM.md` section 9
   are language-neutral; write the real copy in this language.

Done when every question has an answer. Ask again for any answer that is missing.

## 3. Write the design

Create two files in the project. Change no app code in this step.

**`docs/xtheme/DESIGN.md`** — the plan, with these sections:

- **Stack** — the framework and the libraries chosen in step 2.
- **Tokens** — where `assets/tokens.css` goes, and how each `--cm-*` token maps into the library's
  theme (for example the Tailwind colour keys, or the MUI `palette` fields). Every token has one
  target; a library slot with no matching token stays on the library default and is listed.
- **Theme switch** — where `data-theme` is set, and where the light / dark / system choice is
  stored.
- **Assets** — fonts and how they load; where `assets/logo.svg` and `assets/logo-dark.svg` go; the
  client logo file, or the client logo slot with the path the real file replaces.
- **Components** — one row per component in `SYSTEM.md` section 7 that the app needs: its name in
  the project, the library component it wraps (or "own"), and the file it lives in. The
  component philosophy holds whatever the library: the variants, sizes and states in `SYSTEM.md`
  are the only ones a component exposes.
- **Screens** — for a restyle, one row per existing screen with its pattern from `PATTERNS.md`
  and what changes. For new work only, the patterns the project will use.
- **Conflicts** — every place where the existing app, or a library default, breaks a rule in
  `SYSTEM.md`, and the fix.
- **Gaps** — anything unknown, in brackets (`[LOGO FILE]`).

**`docs/xtheme/preview.html`** — one self-contained page that the user opens in a browser. It
inlines `assets/tokens.css`, loads both fonts, and has a light / dark / system switch. It shows
the colour tokens, the type scale, every component from the Components section in each variant
and state, and one mock of each screen in the Screens section. Use plain HTML and CSS so it runs
with no build. It is a picture of the design, so the app's real components can differ in markup
but not in look.

Then ask the user to open the preview and review `DESIGN.md`. Apply every change they ask for.

Done when the user says the design is approved. Go to step 4 only after that.

## 4. Build

Work in this order, because each layer uses the one before it:

1. **Foundation** — tokens into the theme system, fonts, both logo files, the theme
   switch.
2. **Components** — every row of the Components section.
3. **Screens** — every row of the Screens section. Skip this layer for new work only.

In an existing app, change only what `DESIGN.md` lists. When the work shows that the design is
wrong, stop, update `DESIGN.md`, and get the user's approval for that change before you go on.

Done when every row in `DESIGN.md` is built.

## 5. Check

Go through the checklist in `SYSTEM.md` section 10, item by item, on every built screen. Check each
screen at 1440, 1024 and 390 px wide, in light and in dark.

Report each checklist item as pass or fail, with the screen and the file for each fail. Fix the
fails, then check again.

Done when every item passes, or the user accepts each remaining fail by name.
