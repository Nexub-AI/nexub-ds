'use client'; // docs preview: server pages import every example

import { DescriptionList } from '@nexub/react';

export default function Example() {
  return (
    <DescriptionList.Root layout="stacked" columns={3}>
      <DescriptionList.Item label="Applicant">Ada Lovelace</DescriptionList.Item>
      <DescriptionList.Item label="Submitted">12 March 2026</DescriptionList.Item>
      <DescriptionList.Item label="Reference">APP-2041</DescriptionList.Item>
      <DescriptionList.Item label="Plan">Standard</DescriptionList.Item>
      <DescriptionList.Item label="Reviewer">Not assigned</DescriptionList.Item>
      <DescriptionList.Item label="Status">Under review</DescriptionList.Item>
    </DescriptionList.Root>
  );
}
