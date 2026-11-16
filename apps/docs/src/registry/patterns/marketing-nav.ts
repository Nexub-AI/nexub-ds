import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'marketing-nav',
    title: 'MarketingNav',
    description: "The site header: logo, links with mega-menus, a country switcher and actions. Below `lg` the links move into a side sheet.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "logo", type: "React.ReactNode", required: true, description: "Logo, wrapped in a link to `logoHref`." },
    { name: "items", type: "MarketingNavItem[]", required: true, description: "Links; an item with `items` opens a mega-menu of links with descriptions; one with `columns` (`MarketingNavColumn[]`: `title`, `href`, `description`, `accent`, `links`) opens a grouped mega-menu, with optional `footer` links and a `feature` card. A link's `badge` shows after its label and is part of its accessible name." },
    { name: "countries", type: "MarketingCountry[]", required: false, description: "Country sites: `{ code, label, href }`. The switcher shows when there are two or more." },
    { name: "country", type: "string", required: false, description: "Current country code." },
    { name: "actions", type: "React.ReactNode", required: false, description: "Sign in / Get started buttons." },
    { name: "logoHref", type: "string", default: "'/'", required: false, description: "Where the logo links." },
    { name: "menuLabel", type: "string", default: "'Open menu'", required: false, description: "Accessible name of the mobile menu button." },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Grouped mega-menu',
      description: "An item with `columns` opens a panel as wide as the container: up to 5 columns (3 + 2 below `xl`), each a labelled list whose title can link to the division page, with an optional `footer` strip and `feature` card. In the side sheet each column is an accordion section. `accent` tints a heading with the division colour (load `@nexub/themes/divisions`).",
    },
  ],
};

export default entry;
