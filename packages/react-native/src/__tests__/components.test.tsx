import * as React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { native } from '@nexub/tokens/native';
import { Settings } from '@nexub/icons/native';
import {
  Amount,
  Button,
  Checkbox,
  ErrorState,
  IconButton,
  ListItem,
  MoneyInput,
  NexubNativeProvider,
  Progress,
  Radio,
  RadioGroup,
  SegmentedControl,
  Stepper,
  ToastProvider,
  useToast,
} from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const roles = native.color.roles.standard.light;
const wrap = (ui: React.ReactElement) =>
  render(
    <NexubNativeProvider scheme="light" contrast="standard">
      <ToastProvider>{ui}</ToastProvider>
    </NexubNativeProvider>,
  );

describe('Button', () => {
  it('is a labelled button that presses', async () => {
    const onPress = jest.fn();
    await wrap(<Button onPress={onPress}>Send money</Button>);
    await fireEvent.press(screen.getByRole('button', { name: 'Send money' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('loading blocks presses and reports busy', async () => {
    const onPress = jest.fn();
    await wrap(
      <Button loading onPress={onPress}>
        Pay
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Pay' });
    expect(btn).toBeBusy();
    expect(btn).toBeDisabled();
    await fireEvent.press(btn);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('small controls still get a 44pt target', async () => {
    await wrap(<IconButton icon={Settings} label="Settings" size="sm" />);
    expect(screen.getByRole('button', { name: 'Settings' }).props.hitSlop).toEqual({
      top: 6,
      bottom: 6,
      left: 6,
      right: 6,
    });
  });
});

describe('selection controls', () => {
  it('Checkbox toggles and reports checked', async () => {
    const onChange = jest.fn();
    await wrap(<Checkbox label="Remember me" onCheckedChange={onChange} />);
    const box = screen.getByRole('checkbox', { name: 'Remember me' });
    expect(box).not.toBeChecked();
    await fireEvent.press(box);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeChecked();
  });

  it('RadioGroup selects one value', async () => {
    const onChange = jest.fn();
    await wrap(
      <RadioGroup label="Speed" defaultValue="standard" onValueChange={onChange}>
        <Radio value="standard" label="Standard" />
        <Radio value="instant" label="Instant" />
      </RadioGroup>,
    );
    await fireEvent.press(screen.getByRole('radio', { name: 'Instant' }));
    expect(onChange).toHaveBeenCalledWith('instant');
    expect(screen.getByRole('radio', { name: 'Instant' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Standard' })).not.toBeChecked();
  });

  it('SegmentedControl exposes tabs with the selected one', async () => {
    await wrap(
      <SegmentedControl
        label="Period"
        options={[
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
      />,
    );
    await fireEvent.press(screen.getByRole('tab', { name: 'Month' }));
    expect(screen.getByRole('tab', { name: 'Month' })).toBeSelected();
  });
});

describe('ListItem', () => {
  it('a switch row is one switch element; pressing the row toggles it', async () => {
    const onChange = jest.fn();
    await wrap(
      <ListItem
        variant="switch"
        title="Face ID"
        subtitle="Unlock the app"
        checked={false}
        onCheckedChange={onChange}
      />,
    );
    await fireEvent.press(screen.getByRole('switch', { name: 'Face ID, Unlock the app' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('a navigation row reads title, subtitle and value', async () => {
    await wrap(<ListItem title="Language" value="English" onPress={() => {}} />);
    expect(screen.getByRole('button', { name: 'Language, English' })).toBeTruthy();
  });
});

describe('money and numbers', () => {
  it('MoneyInput parses locale input into a number', async () => {
    const onValue = jest.fn();
    await wrap(<MoneyInput label="Amount" currency="EUR" locale="de-DE" onValueChange={onValue} />);
    await fireEvent.changeText(screen.getByLabelText('Amount'), '1.234,5');
    expect(onValue).toHaveBeenLastCalledWith(1234.5);
  });

  it('Stepper clamps to its range and is adjustable', async () => {
    const onChange = jest.fn();
    await wrap(
      <Stepper label="Guests" defaultValue={1} min={1} max={2} onValueChange={onChange} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Increment' }));
    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    expect(screen.getByRole('adjustable', { name: 'Guests' })).toHaveAccessibilityValue({ now: 2 });
  });

  it('Amount formats with Intl and colours losses with tone="auto"', async () => {
    await wrap(<Amount value={-42.5} currency="USD" locale="en-US" tone="auto" />);
    const text = screen.getByText('-$42.50');
    expect(StyleSheet.flatten(text.props.style).color).toBe(roles.error);
  });
});

describe('feedback', () => {
  function Saver() {
    const toast = useToast();
    return (
      <RNText accessibilityRole="button" onPress={() => toast({ message: 'Saved' })}>
        save
      </RNText>
    );
  }

  it('useToast shows a message', async () => {
    await wrap(<Saver />);
    await fireEvent.press(screen.getByRole('button', { name: 'save' }));
    expect(screen.getByText('Saved')).toBeTruthy();
  });

  it('ErrorState offers Retry', async () => {
    const onRetry = jest.fn();
    await wrap(<ErrorState title="Couldn’t load" onRetry={onRetry} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('Progress reports its value', async () => {
    await wrap(<Progress value={0.4} label="Upload" />);
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAccessibilityValue({
      now: 40,
    });
  });
});
