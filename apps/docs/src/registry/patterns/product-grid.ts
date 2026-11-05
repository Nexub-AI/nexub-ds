import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'product-grid',
    title: 'ProductGrid',
    description: "Product cards in a grid; each card is one link with the product's accent. Server component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "header", type: "React.ReactNode", required: false, description: "ProductGrid: a SectionHeader, usually." },
    { name: "name", type: "string", required: true, description: "ProductCard: product name, the card's link text." },
    { name: "description", type: "React.ReactNode", required: true, description: "ProductCard: one line on what it does." },
    { name: "href", type: "string", required: true, description: "ProductCard: the product page." },
    { name: "icon", type: "React.ReactNode", required: false, description: "ProductCard: the product mark." },
    { name: "accent", type: "'leap' | 'bookub' | 'payub' | 'founderub'", required: false, description: "ProductCard: coloured top edge and tint in marketing mode." },
    { name: "linkLabel", type: "string", default: "'Learn more'", required: false, description: "ProductCard: the visual link cue." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
