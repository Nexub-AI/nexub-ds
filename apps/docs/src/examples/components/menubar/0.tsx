import { Menubar } from '@nexub/react';

export default function Example() {
  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item>New file</Menubar.Item>
            <Menubar.Item>Open…</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item>Save</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item>Undo</Menubar.Item>
            <Menubar.Item>Redo</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item>Copy</Menubar.Item>
            <Menubar.Item>Paste</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item>Zoom in</Menubar.Item>
            <Menubar.Item>Zoom out</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}
