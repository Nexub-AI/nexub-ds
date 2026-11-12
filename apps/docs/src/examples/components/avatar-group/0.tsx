'use client'; // docs preview: server pages import every example

import { AvatarGroup, Avatar } from '@nexub/react';

export default function Example() {
  return (
    <AvatarGroup max={3}>
      <Avatar name="Alice B" />
      <Avatar name="Bob C" />
      <Avatar name="Carol D" />
      <Avatar name="Dave E" />
      <Avatar name="Eve F" />
    </AvatarGroup>
  );
}
