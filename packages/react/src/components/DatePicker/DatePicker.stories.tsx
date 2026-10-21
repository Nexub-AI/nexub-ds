import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { fr } from 'date-fns/locale/fr';
import { ar } from 'date-fns/locale/ar';
import { DatePicker } from './DatePicker.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';

const meta: Meta = {
  title: 'Forms/DatePicker',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDatePicker() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div style={{ maxWidth: '280px' }}>
      <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
      {date && (
        <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Selected: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export const Default: Story = {
  render: () => <ControlledDatePicker />,
};

export const WithPresetDate: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 15));
    return (
      <div style={{ maxWidth: '280px' }}>
        <DatePicker value={date} onChange={setDate} />
      </div>
    );
  },
};

/** French: date-fns `fr` for month/weekday names and Monday week start; translated nav labels. */
export const French: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 15));
    return (
      <NexubProvider
        locale="fr"
        dateLocale={fr}
        messages={{
          pickDate: 'Choisir une date',
          previousMonth: 'Mois précédent',
          nextMonth: 'Mois suivant',
          calendarNavigation: 'Navigation du calendrier',
          todayDate: (d) => `Aujourd’hui, ${d}`,
          selectedDate: (l) => `${l}, sélectionné`,
        }}
      >
        <div style={{ maxWidth: '280px' }}>
          <DatePicker value={date} onChange={setDate} />
        </div>
      </NexubProvider>
    );
  },
};

/** Arabic: the provider derives dir="rtl"; the calendar, arrows and order mirror. */
export const Arabic: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 15));
    return (
      <NexubProvider
        locale="ar"
        dateLocale={ar}
        messages={{
          pickDate: 'اختر تاريخًا',
          previousMonth: 'الشهر السابق',
          nextMonth: 'الشهر التالي',
          calendarNavigation: 'التنقل في التقويم',
          todayDate: (d) => `اليوم، ${d}`,
          selectedDate: (l) => `${l}، محدد`,
        }}
      >
        <div dir="rtl" style={{ maxWidth: '280px' }}>
          <DatePicker value={date} onChange={setDate} />
        </div>
      </NexubProvider>
    );
  },
};
