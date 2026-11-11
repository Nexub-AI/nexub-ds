import { TooltipProvider, Tooltip, Button } from '@nexub/react';

export default function Example() {
  return (
    <TooltipProvider>
      <Tooltip label="This is a tooltip" side="top">
        <Button variant="outlined">Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  );
}
