import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { NexubProvider, type NexubMessages } from './index.js';
import { Pagination } from '../Pagination/Pagination.js';
import { SearchInput } from '../SearchInput/SearchInput.js';
import { Chip } from '../Chip/Chip.js';
import { Tabs } from '../Tabs/Tabs.js';
import { Slider } from '../Slider/Slider.js';
import { Amount } from '../Amount/Amount.js';
import { DatePicker } from '../DatePicker/DatePicker.js';

const meta: Meta = {
  title: 'Foundations/i18n',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const arabic: Partial<NexubMessages> = {
  pagination: 'ترقيم الصفحات',
  previousPage: 'الصفحة السابقة',
  nextPage: 'الصفحة التالية',
  goToPage: (n) => `الانتقال إلى الصفحة ${n}`,
  clearSearch: 'مسح البحث',
  remove: 'إزالة',
  pickDate: 'اختر تاريخًا',
};

function Panel({ title }: { title: string }) {
  const [page, setPage] = React.useState(2);
  return (
    <div className="flex flex-col gap-4 rounded-shape-container bg-[var(--color-surface-container-low)] p-4">
      <p className="text-title-sm text-[var(--color-on-surface)]">{title}</p>
      <SearchInput defaultValue="invoice" />
      <div className="flex gap-2">
        <Chip onRemove={() => {}}>Design</Chip>
        <Chip onRemove={() => {}}>Finance</Chip>
      </div>
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">One</Tabs.Trigger>
          <Tabs.Trigger value="b">Two</Tabs.Trigger>
          <Tabs.Trigger value="c">Three</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <Slider defaultValue={[30]} aria-label="Volume" />
      <Amount value={1234.5} currency="USD" />
      <DatePicker />
      <Pagination page={page} totalItems={100} pageSize={10} onPageChange={setPage} />
    </div>
  );
}

/**
 * The same components under two providers. The Arabic panel derives `dir="rtl"` from
 * its locale (Radix tabs/slider follow it; arrow keys flip) and translates a few
 * messages. NexubProvider never sets `dir` on <html> — apps do; here the panel's
 * wrapper carries `dir` so CSS logical properties flip too.
 */
export const EnglishAndArabic: Story = {
  name: 'English and Arabic',
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <NexubProvider locale="en-US">
        <div dir="ltr" lang="en-US">
          <Panel title="English (ltr)" />
        </div>
      </NexubProvider>
      <NexubProvider locale="ar-EG" messages={arabic}>
        <div dir="rtl" lang="ar-EG">
          <Panel title="العربية (rtl)" />
        </div>
      </NexubProvider>
    </div>
  ),
};
