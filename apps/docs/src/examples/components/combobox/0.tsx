import { Combobox } from '@nexub/react';

export default function Example() {
  return (
    <Combobox.Root className="w-[260px]">
      <Combobox.Input placeholder="Search…" />
      <Combobox.List>
        <Combobox.Empty>No results found.</Combobox.Empty>
        <Combobox.Group heading="Frameworks">
          <Combobox.Item value="react">React</Combobox.Item>
          <Combobox.Item value="vue">Vue</Combobox.Item>
          <Combobox.Item value="angular">Angular</Combobox.Item>
          <Combobox.Item value="svelte">Svelte</Combobox.Item>
        </Combobox.Group>
      </Combobox.List>
    </Combobox.Root>
  );
}
