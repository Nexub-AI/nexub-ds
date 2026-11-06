---
"@nexub/react": minor
"@nexub/themes": minor
"@nexub/marketing": minor
---

Quality first: full test coverage and interactive charts.

- **Every component is now covered by the automated accessibility run.** The 24 components and marketing sections that had no Storybook story (the charts, MoneyInput, NavigationRail, Sheet, SplitButton, Float, Marquee, Reveal and every `@nexub/marketing` section) now have one, so axe-core (WCAG 2.2 A/AA, light and dark) and the screenshot suite run on them on every change. `@nexub/react/accessibility.json` reports 116 of 116 components covered.
- **Charts: negative values.** `BarChart` and `LineChart` take values below zero: the axis spans zero, a zero line is drawn, and bars grow up or down from it (stacked bars stack positives and negatives separately). New `niceDomain(values)` helper.
- **Charts: hover tooltip.** Hovering a category highlights it and shows every series value, built from CSS over the plot, so the charts stay server components with no JavaScript and no style attributes. Screen readers keep the data table.
- **Charts: draw-in.** Bars grow from the zero line and lines reveal left to right on first paint (`.nx-chart-bar`, `.nx-chart-line` in `@nexub/themes`), off under reduced motion.
- **MarketingNav accessibility (WCAG 2.5.3 Label in Name).** The logo link no longer overrides its name with "Home"; it takes the logo's own name ("Nexub"), so it matches the visible wordmark. `logoLabel` still overrides it. The country switcher's name now starts with the visible code ("SG, Choose country: Singapore").
