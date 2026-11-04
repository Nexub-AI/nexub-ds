import * as React from 'react';
import { Pagination } from '@nexub/react';

export default function Example() {
  const [page, setPage] = React.useState(3);
  return <Pagination page={page} totalItems={500} pageSize={20} siblingCount={2} onPageChange={setPage} />;
}
