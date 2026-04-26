import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'pagination',
    title: 'Pagination',
    description: 'Page navigation control with prev/next and page number buttons.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'page', type: 'number', required: true, description: 'The currently active page (1-indexed).' },
    { name: 'totalItems', type: 'number', required: true, description: 'Total number of items across all pages.' },
    { name: 'pageSize', type: 'number', default: '10', required: false, description: 'Number of items per page. Used to calculate total page count.' },
    { name: 'siblingCount', type: 'number', default: '1', required: false, description: 'Number of page buttons to show on each side of the current page.' },
    { name: 'onPageChange', type: '(page: number) => void', required: true, description: 'Callback invoked with the new page number when the user navigates.' },
    { name: 'showFirstLast', type: 'boolean', default: 'true', required: false, description: 'Whether to show First and Last page navigation buttons.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables all pagination controls.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `function DefaultPagination() {
  const [page, setPage] = React.useState(3);
  return (
    <Pagination
      page={page}
      totalItems={100}
      pageSize={10}
      onPageChange={setPage}
    />
  );
}`,
    },
    {
      title: 'Large dataset',
      code: `function LargeDatasetPagination() {
  const [page, setPage] = React.useState(5);
  return (
    <Pagination
      page={page}
      totalItems={500}
      pageSize={20}
      siblingCount={2}
      onPageChange={setPage}
    />
  );
}`,
    },
  ],
};

export default entry;
