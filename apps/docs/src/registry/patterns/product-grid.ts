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
    { name: "header", type: "React.ReactNode", required: false, description: "A SectionHeader, usually." },
    { name: "ProductCard name", type: "string", required: true, description: "Product name, the card's link text." },
    { name: "ProductCard description", type: "React.ReactNode", required: true, description: "One line on what it does." },
    { name: "ProductCard href", type: "string", required: true, description: "The product page." },
    { name: "ProductCard icon", type: "React.ReactNode", required: false, description: "The product mark." },
    { name: "ProductCard accent", type: "'leap' | 'bookub' | 'payub' | 'founderub'", required: false, description: "Coloured top edge and tint in marketing mode." },
    { name: "ProductCard linkLabel", type: "string", default: "'Learn more'", required: false, description: "The visual link cue." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
