import { SplitButton, DropdownMenu } from '@nexub/react';

export default function Example() {
  return (
    <SplitButton variant="outlined" menuLabel="More export options" menu={<DropdownMenu.Item>CSV</DropdownMenu.Item>}>
      Export
    </SplitButton>
  );
}
