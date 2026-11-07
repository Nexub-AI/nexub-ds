import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { InlineEdit, NexubNativeProvider, SortableList, StepProgress, TreeList } from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const wrap = (ui: React.ReactElement) =>
  render(
    <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
      {ui}
    </NexubNativeProvider>,
  );

it('TreeList drills down, picks a leaf, and goes back', async () => {
  const onSelect = jest.fn();
  await wrap(
    <TreeList
      rootTitle="Teams"
      nodes={[{ id: 'eng', title: 'Engineering', children: [{ id: 'ada', title: 'Ada' }] }, { id: 'ops', title: 'Ops' }]}
      onSelect={onSelect}
    />,
  );
  await fireEvent.press(screen.getByText('Engineering'));
  await fireEvent.press(screen.getByText('Ada'));
  expect(onSelect).toHaveBeenCalledWith('ada');
  await fireEvent.press(screen.getByText('Back to Teams'));
  expect(screen.getByText('Ops')).toBeTruthy();
});

it('StepProgress reads its position', async () => {
  await wrap(<StepProgress steps={[{ id: 'a', label: 'Account' }, { id: 'b', label: 'Billing' }]} current={1} />);
  expect(screen.getByLabelText('Step 2 of 2: Billing')).toBeTruthy();
});

it('SortableList moves with buttons and accessibility actions', async () => {
  const onReorder = jest.fn();
  await wrap(<SortableList items={['A', 'B', 'C']} keyExtractor={(i) => i} title={(i) => i} onReorder={onReorder} />);
  await fireEvent.press(screen.getAllByLabelText('Move down', { includeHiddenElements: true })[0]!);
  expect(onReorder).toHaveBeenLastCalledWith(['B', 'A', 'C']);
  await fireEvent(screen.getByLabelText('C, Step 3 of 3'), 'accessibilityAction', { nativeEvent: { actionName: 'moveUp' } });
  expect(onReorder).toHaveBeenLastCalledWith(['A', 'C', 'B']);
});

it('InlineEdit saves on submit', async () => {
  const onSave = jest.fn();
  await wrap(<InlineEdit label="Name" value="Acme" onSave={onSave} />);
  await fireEvent.press(screen.getByLabelText('Edit Name, Acme'));
  await fireEvent.changeText(screen.getByDisplayValue('Acme'), 'Globex');
  await fireEvent(screen.getByDisplayValue('Globex'), 'submitEditing');
  expect(onSave).toHaveBeenCalledWith('Globex');
});
