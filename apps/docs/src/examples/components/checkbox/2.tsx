import { Checkbox, Label } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-3 items-start">
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked /><Label>Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox /><Label>Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox disabled /><Label>Disabled</Label>
      </div>
    </div>
  );
}
