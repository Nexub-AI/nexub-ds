import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'marketing-footer',
    title: 'MarketingFooter',
    description: "The site footer: a tools strip, the logo, link columns and the legal line. Server component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "columns", type: "{ title, links: { label, href }[] }[]", required: true, description: "Link columns, each a labelled nav." },
    { name: "logo", type: "React.ReactNode", required: false, description: "Logo." },
    { name: "tagline", type: "React.ReactNode", required: false, description: "A line under the logo." },
    { name: "tools", type: "React.ReactNode[]", required: false, description: "Tools or integrations, scrolling in a strip." },
    { name: "toolsLabel", type: "string", default: "'Works with'", required: false, description: "Label of the tools strip." },
    { name: "bottom", type: "React.ReactNode", required: false, description: "Copyright and legal links." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
