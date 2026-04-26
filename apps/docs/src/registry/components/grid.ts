import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'grid',
    title: 'Grid',
    description: 'CSS Grid layout primitive.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'cols', type: 'number | string', required: false, description: 'Number of columns or a custom grid-template-columns value.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", required: false, description: 'Gap between grid cells using design tokens.' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", required: false, description: 'Sets the align-items CSS property for all grid cells.' },
  ],
  examples: [
    {
      title: '2-column',
      code: `<Grid cols={2} gap="md">
  <Card><Card.Body><Text>Card one</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card two</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card three</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card four</Text></Card.Body></Card>
</Grid>`,
    },
    {
      title: '3-column',
      code: `<Grid cols={3} gap="md">
  <Card><Card.Body><Text>Card one</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card two</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card three</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card four</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card five</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card six</Text></Card.Body></Card>
</Grid>`,
    },
  ],
};

export default entry;
