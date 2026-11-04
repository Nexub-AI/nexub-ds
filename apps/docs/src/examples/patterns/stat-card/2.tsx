import * as React from 'react';
import { StatCard } from '@nexub/patterns';
import { Button } from '@nexub/react';

export default function Example() {
  const [orders, setOrders] = React.useState(1284);
  return (
    <div className="flex flex-col gap-3 items-stretch w-[240px]">
      <StatCard label="Orders today" value={orders.toLocaleString('en-US')} animate />
      <Button size="sm" variant="outlined" onClick={() => setOrders((o) => o + Math.ceil(Math.random() * 40))}>
        New orders
      </Button>
    </div>
  );
}
