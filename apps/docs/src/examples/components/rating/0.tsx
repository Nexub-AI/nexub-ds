import * as React from 'react';
import { Rating } from '@nexub/react';

export default function Example() {
  const [val, setVal] = React.useState(3);
  return <Rating value={val} onValueChange={setVal} />;
}
