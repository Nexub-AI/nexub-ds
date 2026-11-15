'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Pagination } from '@nexub/react';

export default function Example() {
  const [page, setPage] = React.useState(3);
  return <Pagination page={page} totalItems={100} pageSize={10} onPageChange={setPage} />;
}
