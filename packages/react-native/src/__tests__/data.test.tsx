import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { DataList, FileList, FilterSheet, MultiSelect, NexubNativeProvider, type FilterGroup } from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(<Provider>{ui}</Provider>);

const labels = [
  { value: 'bug', label: 'Bug' },
  { value: 'design', label: 'Design' },
  { value: 'docs', label: 'Docs' },
  { value: 'perf', label: 'Performance' },
];

it('MultiSelect: toggles checkbox rows and summarises the field', async () => {
  const onValueChange = jest.fn();
  await wrap(<MultiSelect label="Labels" options={labels} defaultValue={['bug', 'design', 'docs']} onValueChange={onValueChange} />);
  await fireEvent.press(screen.getByRole('button', { name: 'Labels, Bug, Design, +1 more' }));
  await fireEvent.press(screen.getByRole('checkbox', { name: 'Performance' }));
  expect(onValueChange).toHaveBeenLastCalledWith(['bug', 'design', 'docs', 'perf']);
  await fireEvent.press(screen.getByRole('checkbox', { name: 'Bug' }));
  expect(onValueChange).toHaveBeenLastCalledWith(['design', 'docs', 'perf']);
});

const people = [
  { id: 'a', name: 'Ana', amount: 30 },
  { id: 'b', name: 'Ben', amount: 10 },
  { id: 'c', name: 'Chen', amount: 20 },
];

it('DataList: sorts from the sheet and selects rows', async () => {
  const onSelectedChange = jest.fn();
  await wrap(
    <DataList
      data={people}
      keyExtractor={(p) => p.id}
      title={(p) => p.name}
      value={(p) => `${p.amount} USD`}
      sorts={[{ id: 'amount', label: 'Amount', compare: (x, y) => x.amount - y.amount }]}
      selectable
      onSelectedChange={onSelectedChange}
    />,
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Sort' }));
  await fireEvent.press(screen.getByRole('radio', { name: 'Amount' }));
  const names = screen.getAllByRole('checkbox').map((r) => String(r.props.accessibilityLabel ?? ''));
  expect(names.map((n) => n.split(',')[0])).toEqual(['Ben', 'Chen', 'Ana']);
  await fireEvent.press(screen.getAllByRole('checkbox')[0]!);
  expect(onSelectedChange).toHaveBeenLastCalledWith(['b']);
  expect(screen.getByText('1 selected')).toBeTruthy();
});

it('FileList: progress and cancel while uploading, remove after', async () => {
  const onCancel = jest.fn();
  const onRemove = jest.fn();
  const { rerender } = await wrap(
    <FileList files={[{ id: '1', name: 'scan.pdf', size: 2048, progress: 40 }]} onCancel={onCancel} onRemove={onRemove} />,
  );
  expect(screen.getByLabelText('scan.pdf, 40% uploaded')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Cancel upload of scan.pdf' }));
  expect(onCancel).toHaveBeenCalledWith('1');
  await rerender(
    <Provider>
      <FileList files={[{ id: '1', name: 'scan.pdf', progress: 100 }]} onCancel={onCancel} onRemove={onRemove} />
    </Provider>,
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Remove scan.pdf' }));
  expect(onRemove).toHaveBeenCalledWith('1');
});

it('FilterSheet: adds a rule to the shared FilterGroup JSON', async () => {
  const onValueChange = jest.fn();
  const value: FilterGroup = { id: 'root', combinator: 'and', rules: [] };
  await wrap(
    <FilterSheet
      open
      onOpenChange={() => {}}
      title="Filters"
      fields={[{ id: 'name', label: 'Name', type: 'text' }]}
      value={value}
      onValueChange={onValueChange}
    />,
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Add filter' }));
  const next = onValueChange.mock.lastCall[0] as FilterGroup;
  expect(next.rules[0]).toMatchObject({ field: 'name', operator: 'contains', value: '' });
});
