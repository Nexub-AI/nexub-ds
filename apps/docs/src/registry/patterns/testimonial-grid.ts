import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'testimonial-grid',
    title: 'TestimonialGrid',
    description: "Customer quotes in product-coloured cards, with an optional star rating. Server component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "header", type: "React.ReactNode", required: false, description: "TestimonialGrid: a SectionHeader, usually." },
    { name: "quote", type: "React.ReactNode", required: true, description: "TestimonialCard: the quote." },
    { name: "name", type: "string", required: true, description: "TestimonialCard: who said it." },
    { name: "role", type: "React.ReactNode", required: false, description: "TestimonialCard: job title and company." },
    { name: "avatarSrc", type: "string", required: false, description: "TestimonialCard: photo; initials otherwise." },
    { name: "rating", type: "number", required: false, description: "TestimonialCard: stars out of 5, announced as \"Rated n out of 5\"." },
    { name: "accent", type: "'leap' | 'bookub' | 'payub' | 'founderub'", required: false, description: "TestimonialCard: the product the customer uses." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
