# @nexub/diagram: accessibility review (11.9)

The screen-reader pass that [ROADMAP_12.x.md](../../ROADMAP_12.x.md) § 11.9 and the `alpha → beta` criteria in [GOVERNANCE.md](../../GOVERNANCE.md) ask for, in two halves:

1. **Automated pass** (done, 2026-11-24): what a browser can check by itself, in Chromium, WebKit and Firefox. Everything it found is fixed and has a regression test.
2. **Human pass** (to do): VoiceOver and NVDA, with the checklist at the end. The maintainer promotes the package to `beta` after it, not before. This review does not change the package status.

Scope: `DiagramCanvas` (with `DiagramNode`, the Connect menu, the zoom controls, the minimap and the "Show as list" view), through the five Storybook stories in `src/DiagramCanvas.stories.tsx`: Default, MindMap, ReadOnly, Tones, Minimap.

## What the automated pass covered

| Check | How | Engines |
|---|---|---|
| axe (WCAG 2.2 A/AA, plus best-practice in the audit run) | every story, light and dark; the Connect menu open | Chromium, WebKit, Firefox (Firefox leaves the minimap out, see below) |
| Accessibility tree | `ariaSnapshot()` of every story: each focusable node has a role and a name | all three |
| Keyboard walk | 40 Tabs forward and 12 back from the top of every story; arrow keys, Home/End, Alt+arrows, C, Escape, Enter, Delete on nodes, edges and the menu; focus after closing the menu and after deleting | all three |
| Live region | a `MutationObserver` on `[data-diagram-live]` recording every move, connect and delete message | all three |
| Forced colours | `forced-colors: active` screenshots and computed system colours (node border, focus ring, warning stripe) | Chromium (the only engine that emulates it) |
| Reflow | 320 × 640 viewport: no sideways page scroll | all three |
| Reduced motion | handle transitions and animated-edge dashes off under `prefers-reduced-motion: reduce`, on without it; fit view (unit test) | all three |

The audit scripts were throwaway; what they found is kept as regression tests in `src/DiagramCanvas.test.tsx` (jsdom) and `packages/react/visual/diagram.spec.ts` (all three engines, in the pinned Playwright Docker image).

## What it found, and the fixes

| # | Severity | Engines | Finding | Fix | Tests |
|---|---|---|---|---|---|
| D1 | Serious | all | Edges were named by node **id**: "Edge from trigger to enrich". | Edges are named from the nodes' titles with a new `labels.edge` ("Connection from New sign-up to Enrich profile"). An edge's own `ariaLabel` still wins. | unit: *names edges by their nodes' titles and keeps one edge in the Tab order*, *takes the edge strings from labels*; visual: *the accessibility tree: edges named by node titles (not ids), no image wrappers* |
| D2 | Serious | all | Every edge was its own Tab stop, all before the first node: 6 Tabs to reach a node in the Default story, one per edge in general. | Roving tabindex for edges, as for nodes: one Tab stop for all edges. Arrow keys move between edges (in the order of their nodes), Home/End go to the first and last. | unit: *moves between edges with the arrow keys and Home/End*; visual: *Tab order: one stop for the edges, one for the nodes, then the controls and the list view; Shift+Tab goes back*, *edges: arrows move between them; …* |
| D3 | Moderate | all | Each edge sits in its own `<svg>`, which the browsers exposed as an unnamed image around the edge. | The wrapper `<svg>` gets `role="none"`. | unit and visual tests in D1 |
| D4 | Moderate | all | Edges were described by React Flow's English default ("Press enter or space to select an edge…"), which did not match the canvas keyboard and could not be translated. | New `labels.edgeHint` and `labels.edgeHintReadOnly`, passed to React Flow's `ariaLabelConfig`. | unit: *names edges …*, *read-only: arrows still move between edges; Delete does nothing; the hint says so*; visual: *read-only: focus moves, …* |
| D5 | Serious | all | The node order (Tab stop, Home/End, the list view, the Connect menu) was top-to-bottom rows. In a left-right workflow that starts at whichever step is drawn highest: "Enrich profile" (step 2) came before "New sign-up" (step 1), in the list view too. | The order follows the layout: `left-right` by columns, `mind-map` as an outline from the root (each branch depth first), `none` in rows as before. | unit: *left-right: by columns, …*, *mind-map: an outline from the root, …*, *none: rows, as before*; visual: *Tab order …*, *nodes: … Home is the first step …*, *the list view: … in the order of the flow …* |
| D6 | Moderate | all | Two identical announcements in a row ("Deleted 1 item" twice) left the live region unchanged, so the second was not read. | The repeat gets a trailing no-break space, so the region changes and is read again. | unit: *deletes the focused edge with Delete, announces each delete, and moves focus on*; visual: *edges: … the same message twice is announced twice* |
| D7 | Minor | all | Deleting one node announced a count of everything removed: "Deleted 4 items" for one node and its 3 edges. | `labels.deleted(count, nodes?)` gets the deleted nodes' titles: "Deleted Send welcome email and 2 connections". | unit: *removes the focused node and its edges with Delete, …*, *defaultDiagramLabels.deleted (11.9)*; visual: *nodes: … announcements for move, connect and delete* |
| D8 | Moderate | all | Delete on a focused edge did nothing unless the edge was first selected with Enter (which the edge hint did not say). | Delete and Backspace on a focused edge remove it (the selection, when there is one, still goes first). Focus moves to the next edge, else the first node. | unit: *deletes the focused edge …*, *deletes the selection rather than the focused edge*; visual: *edges: …* |

Checked and found fine: canvas named (`role="application"`, `aria-label`); nodes are named groups with `aria-roledescription="node"` and the keyboard hint as description; tone has a text equivalent and a border style in forced colours; Connect menu takes focus, is named "Connect X to…", Escape and Enter return focus to the node; delete moves focus to the next node; no focus trap anywhere (Tab and Shift+Tab leave the canvas both ways); zoom controls and the minimap are named; read-only allows only focus moves; the list view is a native `<details>`; at 320px the page does not scroll sideways (the canvas pans inside itself, a two-dimensional layout WCAG 1.4.10 exempts, with the list view as the text alternative); reduced motion turns off handle transitions, animated edge dashes and fit-view animation.

### Public API

No breaking change. `DiagramLabels` gains `edge`, `edgeHint` and `edgeHintReadOnly` (the `labels` prop is `Partial`, so existing callers are unaffected), and `deleted` gains an optional second argument (a one-argument override still type-checks).

**API change for the maintainer, not made:** `NexubMessages` in `@nexub/core` has `diagram…` keys for every other label. It needs `diagramEdge?: (source: string, target: string) => string`, `diagramEdgeHint?: string` and `diagramEdgeHintReadOnly?: string`, and `diagramDeleted` should take the optional `nodes` argument, so a translated `NexubProvider` covers the new strings. `diagramLabelsFrom` already reads those keys when they are there; only the type is missing.

### What the automated pass could not check or settle

- **What screen readers actually say.** Roles, names, descriptions and live-region text are checked; their speech, verbosity and timing are not. That is the human pass.
- **`role="application"` and browse mode.** The canvas is an application region, so NVDA and JAWS switch to focus mode inside it and VoiceOver passes keys through. Whether users find the "Show as list" view, and whether the node content (description, tone) is reachable, needs a person.
- **Edge stop before the node stop.** React Flow renders edges before nodes in the DOM, so the first Tab into the canvas lands on the edges' stop and the second on the nodes'. Swapping them would mean reordering React Flow's layers; left as is and listed for the human pass to judge.
- **Firefox crash under axe on the minimap.** In the Docker Firefox (Playwright 1.65, Linux arm64), the content process crashed (a core dump, not a test timeout) in 4 of 6 runs while axe walked the Minimap story's minimap `<svg>`, and never with the minimap excluded. It did not reproduce when each axe rule ran on its own, so the cause is not known. The visual spec excludes the minimap from axe in Firefox only (Chromium and WebKit scan it). The human pass checks the Minimap story in Firefox with NVDA running (step N12).
- **The connect button on a node** only takes pointer events while the node is hovered, focused or selected. Screen readers usually activate a button without a real pointer, but this needs checking (step N7).
- **Edge direction** shows only by position: edges have no arrowheads in the stories. Not a screen-reader issue (the names and the list view give the direction), but worth a look for low-vision users.
- **Forced colours** in WebKit and Firefox, and real Windows High Contrast themes.
- **Touch** (iOS VoiceOver swipe navigation on the canvas).
- **Reference screens** (Mind mind map, Command Hub Studio): the RFC's "before beta" check is separate from this pass.

## Human pass: checklist

Run Storybook from the repo (`pnpm --filter @nexub/react storybook`) and open the stories on their own, without the Storybook frame: `http://localhost:6006/iframe.html?id=components-diagramcanvas--default&viewMode=story` (swap the id for `--mind-map`, `--read-only`, `--tones`, `--minimap`). For iOS, open the same URL from the Mac's address on the local network.

Mark each box **P** (pass) or **F** (fail, with a note under the table). "Announces" is what should be said, not word for word: order and wording vary by screen reader.

Setups: **VO-mac** VoiceOver, macOS Safari · **VO-iOS** VoiceOver, iOS Safari · **NVDA-FF** NVDA, Windows Firefox · **NVDA-Ch** NVDA, Windows Chrome.

| # | Story | Do | Announces | VO-mac | VO-iOS | NVDA-FF | NVDA-Ch |
|---|---|---|---|---|---|---|---|
| N1 | Default | From the top of the page, Tab once. | "Lead onboarding workflow", application (on entering); "Connection from New sign-up to Enrich profile" (or "… to Send welcome email"); the connection hint "Arrow keys move between connections. Press Delete to remove it." | [ ] | n/a | [ ] | [ ] |
| N2 | Default | Down Arrow, then Up Arrow. | The next connection's name, then the first again. Nothing about the page scrolling. | [ ] | n/a | [ ] | [ ] |
| N3 | Default | Tab once more. | "New sign-up", node (or group), with its hint "Arrow keys move between nodes. Alt and an arrow key moves the node. Press C to connect …". The first step of the workflow, not "Enrich profile". | [ ] | n/a | [ ] | [ ] |
| N4 | Default | Right Arrow, Down Arrow, Home, End. | Each node's title as focus moves; Home says "New sign-up"; End a last step ("Notify sales" or "Create CRM record"). | [ ] | n/a | [ ] | [ ] |
| N5 | Default | On a node, Option+Down Arrow (Mac) / Alt+Down Arrow (Windows), twice. | "Moved New sign-up to x, y" after each press, politely (not cutting off the node name), with new numbers each time. Check NVDA's Alt does not open a browser menu. | [ ] | n/a | [ ] | [ ] |
| N6 | Default | On a node, press C. Down Arrow twice, then Escape. | "Connect New sign-up to…", list, and the first option; each option's title on Down Arrow; on Escape, back on "New sign-up" (node name read again). | [ ] | n/a | [ ] | [ ] |
| N7 | Default | Press C, then Enter. Then, in browse/virtual mode, find a node's "Connect … to…" button and activate it. | "Connected New sign-up to <option>"; focus back on "New sign-up". The button in browse mode opens the same menu. | [ ] | [ ] | [ ] | [ ] |
| N8 | Default | Focus "Send welcome email", press Delete. | "Deleted Send welcome email and 2 connections"; focus on the next node, whose name is read. | [ ] | n/a | [ ] | [ ] |
| N9 | Default | Shift+Tab to the connections stop, press Delete twice. | "Deleted 1 item" **both times**; focus on the next connection each time. | [ ] | n/a | [ ] | [ ] |
| N10 | Default | Tab past the canvas: zoom in, zoom out, fit view, "React Flow attribution", "Show as list". Press Enter on "Show as list" and read the list. | Each control named; "Show as list", collapsed/expanded; the list starts with "New sign-up", then each node with "Connects to: …" / "Connected from: …". Tab leaves the page normally (no trap); Shift+Tab comes back through the same stops. | [ ] | [ ] | [ ] | [ ] |
| N11 | ReadOnly | Tab to a node and a connection; press Delete, C and Alt+Arrow. | Hints say only "Arrow keys move between nodes." / "… between connections."; nothing moves, connects or is deleted; nothing is announced. | [ ] | n/a | [ ] | [ ] |
| N12 | Minimap | Load the story, Tab through it, use browse mode over the minimap. | "Minimap", image. **Firefox:** the tab does not crash (see the automated pass). | [ ] | [ ] | [ ] | [ ] |
| N13 | Tones | Browse mode through the nodes. | Each title, its description, and "Good" / "Warning" / "Problem" for the tones. | [ ] | [ ] | [ ] | [ ] |
| N14 | MindMap | Tab to the nodes, Home, then Right/Down arrows; open "Show as list". | Home is "Product launch" (the root); the list reads as an outline: Product launch, Audience, Small teams, Enterprise, Channels, … | [ ] | [ ] | [ ] | [ ] |
| N15 | Default | VO-iOS only: swipe right through the page from the top. | Reaches the canvas, its connections and nodes by name, the controls and "Show as list"; double-tap on "Show as list" expands it. Panning the canvas with three fingers does not lose VoiceOver focus. | n/a | [ ] | n/a | n/a |
| N16 | Default | With the system set to reduce motion, click Fit view. | The view jumps; nothing animates. | [ ] | [ ] | [ ] | [ ] |
| N17 | Tones | Windows High Contrast (Contrast themes) on, NVDA-FF and NVDA-Ch only. | Node borders, focus ring and connections visible; the warning node's stripe dashed, the problem node's double. | n/a | n/a | [ ] | [ ] |

Notes on failures:

-
