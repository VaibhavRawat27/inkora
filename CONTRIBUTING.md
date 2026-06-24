# Contributing to Inkora

Thank you for taking the time to contribute. This document explains the development setup, how to submit changes, and the conventions we follow.

---

## Table of contents

- [Code of conduct](#code-of-conduct)
- [Ways to contribute](#ways-to-contribute)
- [Reporting bugs](#reporting-bugs)
- [Suggesting features](#suggesting-features)
- [Development setup](#development-setup)
- [Project structure](#project-structure)
- [Making changes](#making-changes)
- [Pull request process](#pull-request-process)
- [Coding conventions](#coding-conventions)
- [Commit message style](#commit-message-style)
- [Release process](#release-process)

---

## Code of conduct

Be respectful and constructive. Harassment, discrimination, or personal attacks of any kind will not be tolerated. We want this to be a welcoming place for contributors of all backgrounds and experience levels.

---

## Ways to contribute

- **Report a bug** — open a GitHub Issue with a clear reproduction.
- **Suggest a feature** — open a GitHub Issue describing the use case.
- **Fix a bug** — fork, fix, open a PR referencing the Issue.
- **Add a feature** — discuss in an Issue first before writing code, so we can align on scope.
- **Improve docs** — typo fixes, missing examples, and better explanations are always welcome.
- **Write tests** — the project currently has no automated tests; this is a great place to start.

---

## Reporting bugs

Search existing Issues before opening a new one to avoid duplicates.

Include the following in your bug report:

1. **Description** — what did you expect to happen, and what happened instead?
2. **Minimal reproduction** — a CodeSandbox, StackBlitz, or the smallest code snippet that triggers the bug.
3. **Environment** — Inkora version, React version, browser, operating system.
4. **Screenshots or screen recordings** — if the bug is visual.

---

## Suggesting features

Open a GitHub Issue with:

1. **Problem statement** — what is the user need or pain point?
2. **Proposed solution** — how would you like it to work?
3. **Alternatives considered** — what else did you think about?
4. **Scope** — is this a new prop, a new extension, a new component, or a change to existing behaviour?

Features that increase the required peer-dependency list, add significant bundle weight, or change existing public API need extra discussion before we start implementation.

---

## Development setup

**Prerequisites**

- Node.js 18 or later
- npm 9 or later

**Clone and install**

```bash
git clone https://github.com/YOUR_USERNAME/inkora.git
cd inkora
```

The repository contains two packages:

| Folder | Purpose |
|--------|---------|
| `inkora/` | The library source — this is what gets published to npm |
| `editor-app/` | Vite test app — used to develop and manually test the library |

**Install dependencies for the library**

```bash
cd inkora
npm install
```

**Install dependencies for the test app**

```bash
cd ../editor-app
npm install
```

**Run the test app**

```bash
# From the editor-app folder:
npm run dev
```

The test app imports directly from `../inkora/src/index.js`, so any change you save in the `inkora/src/` folder is reflected immediately in the browser without a rebuild step.

**Build the library**

```bash
# From the inkora folder:
npm run build
```

This runs `tsup` and outputs `dist/index.js` (ESM) and `dist/index.cjs` (CJS) plus source maps.

**Watch mode (auto-rebuild on save)**

```bash
# From the inkora folder:
npm run dev
```

---

## Project structure

```
inkora/
├── src/
│   ├── index.js                  # Public API — all exports
│   ├── RichTextEditor.jsx        # InkoraEditor component
│   ├── BasicTextEditor.jsx       # InkoraBasicEditor component
│   ├── RichTextViewer.jsx        # InkoraViewer component
│   ├── styles.js                 # Shared CSS string (all .rte-* classes)
│   ├── adapters.js               # JSDoc type documentation for adapters
│   ├── components/
│   │   ├── Toolbar.jsx           # Full menu bar + format bar + all modals
│   │   ├── BubbleMenu.jsx        # Floating bubble menu on text selection
│   │   ├── CodeBlock.jsx         # Syntax-highlighted code block node view
│   │   ├── ImageNodeView.jsx     # Image node view with resize / filters
│   │   ├── VideoNodeView.jsx     # Video node view with resize / filters
│   │   ├── YoutubeNodeView.jsx   # YouTube embed node view
│   │   └── Icons.jsx             # SVG icon components
│   └── extensions/
│       ├── index.js              # createEditorExtensions factory
│       ├── FontSize.js           # Custom font-size extension
│       ├── LineHeight.js         # Custom line-height extension
│       ├── Callout.js            # Callout block extension
│       ├── Video.js              # Video block extension
│       ├── Audio.js              # Audio block extension
│       ├── Math.jsx              # KaTeX math block extension
│       ├── Hashtag.js            # #hashtag input rule extension
│       └── suggestions.jsx       # @mention suggestion UI
├── dist/                         # Build output (git-ignored, generated by tsup)
├── package.json
├── tsup.config.js
├── LICENSE
├── README.md
└── CONTRIBUTING.md
```

---

## Making changes

1. Fork the repository on GitHub.
2. Create a branch from `main`:
   ```bash
   git checkout -b fix/bubble-menu-clipping
   # or
   git checkout -b feat/paste-from-word
   ```
3. Make your changes in `inkora/src/`.
4. Test manually in the `editor-app/` test app.
5. Build the library to confirm it compiles without errors:
   ```bash
   cd inkora && npm run build
   ```
6. Commit and push to your fork.
7. Open a pull request against `main`.

---

## Pull request process

- **One concern per PR** — separate bug fixes from refactors and new features into different PRs where possible.
- **Reference the Issue** — include `Fixes #123` or `Closes #123` in the PR description so the Issue closes automatically on merge.
- **Describe what changed and why** — the PR description should explain the problem and the approach taken, not just repeat the commit messages.
- **Screenshots for visual changes** — attach a before/after screenshot for any UI change.
- **Keep the diff small** — avoid unrelated whitespace changes, import re-orderings, or style cleanup in the same PR as a logic change.
- A maintainer will review and may request changes. Address feedback by pushing new commits to the same branch — do not force-push after review has started.

---

## Coding conventions

**General**

- All components are written as standard React functions — no class components.
- State management: React `useState` / `useEffect` only — no external state library.
- No Tailwind classes inside the library source. Use inline style objects or CSS variables (`--rte-*`).
- Avoid `window.alert`, `window.prompt`, `window.confirm` — use the existing modal system in `Toolbar.jsx` instead.
- Prefer `navigator.clipboard` over `document.execCommand`.

**Styling**

- All colour values must reference a CSS variable so they work in both light and dark mode.
- New UI surfaces should honour the existing `--rte-*` variable set.
- Never hardcode pixel values for colours — always use `var(--rte-*)` with a fallback literal for the rare case where a CSS variable context is unavailable.

**Extensions**

- Every new TipTap extension must use `Extension.create()`, `Node.create()`, or `Mark.create()` — plain objects crash on init.
- `addNodeView()` must always go inside `.extend()`, never inside `.configure()` — TipTap silently ignores it in `.configure()`.
- `addInputRules()` must return an array of `new InputRule({...})` instances — plain objects crash.
- If an extension file contains JSX, give it a `.jsx` extension.

**Components**

- New modals should follow the `LinkModal` / `ConfirmModal` / `WordCountModal` pattern already in `Toolbar.jsx`: overlay div with `rte-modal-overlay` class, inner div with `rte-modal` class, header / body / button layout.
- New toolbar buttons should use the existing `DropItem`, `DropSep`, and `DropMenu` primitives in `Toolbar.jsx`.

**Comments**

- Add a comment only when the **why** is non-obvious — a hidden constraint, a TipTap quirk, or a browser workaround.
- Do not comment what the code does (the code shows that). Do not reference issue numbers or PR numbers in source comments — put those in the commit message or PR description.

---

## Commit message style

Use a short imperative sentence in the present tense:

```
fix: bubble menu clipping on editors with CSS transform ancestors
feat: word count modal replaces window.alert
chore: delete orphaned ImagePicker and MediaUpload files
docs: add @ mentions example to README
```

Prefix with `fix:`, `feat:`, `chore:`, `docs:`, `refactor:`, or `test:`.

Keep the subject line under 72 characters. Add a blank line followed by a longer explanation if the change needs context that does not fit in the subject.

---

## Release process

Releases are made by maintainers. Version numbers follow [Semantic Versioning](https://semver.org/):

| Change | Version bump |
|--------|-------------|
| Bug fix, doc update | Patch — `0.1.0` → `0.1.1` |
| New prop or new extension (backwards compatible) | Minor — `0.1.0` → `0.2.0` |
| Breaking prop rename, removed export, peer dep major bump | Major — `0.1.0` → `1.0.0` |
