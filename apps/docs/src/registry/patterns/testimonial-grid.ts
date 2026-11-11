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
    { name: "header", type: "React.ReactNode", required: false, description: "A SectionHeader, usually." },
    { name: "TestimonialCard quote", type: "React.ReactNode", required: true, description: "The quote." },
    { name: "TestimonialCard name", type: "string", required: true, description: "Who said it." },
    { name: "TestimonialCard role", type: "React.ReactNode", required: false, description: "Job title and company." },
    { name: "TestimonialCard avatarSrc", type: "string", required: false, description: "Photo; initials otherwise." },
    { name: "TestimonialCard rating", type: "number", required: false, description: "Stars out of 5, announced as \"Rated n out of 5\"." },
    { name: "TestimonialCard accent", type: "'leap' | 'bookub' | 'payub' | 'founderub'", required: false, description: "The product the customer uses." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
