// 11.8: web → native field props (TextField family, Checkbox, Switch, Stepper), the choice
// fields (SwitchField, CheckboxField, CheckboxGroupField) and CurrencySelect.
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  Checkbox,
  CheckboxField,
  CheckboxGroupField,
  CurrencySelect,
  MoneyInput,
  NexubNativeProvider,
  PasswordInput,
  SearchField,
  Stepper,
  Switch,
  SwitchField,
  TextField,
  currencySelectOptions,
  useTheme,
  type Roles,
} from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

let roles: Roles;
let controlHeights: Record<string, number>;
function ReadTheme() {
  const theme = useTheme();
  roles = theme.roles;
  controlHeights = theme.tokens.size.control;
  return null;
}
const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
    <ReadTheme />
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(<Provider>{ui}</Provider>);
type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null };
const nodes = (n: unknown = screen.toJSON()): Node[] => {
  if (!n || typeof n !== 'object') return [];
  if (Array.isArray(n)) return n.flatMap((c) => nodes(c));
  const node = n as Node;
  return [node, ...nodes(node.children)];
};
const style = (n: { props: Record<string, unknown> }) =>
  Object.assign({}, ...[n.props.style].flat(Infinity as 1).filter(Boolean));
const minHeights = () => nodes().map(style).map((s) => s.minHeight).filter((h) => typeof h === 'number');
const mark = (id: string) => <RNText testID={id}>{id}</RNText>;

describe('TextField', () => {
  it('invalid marks the field without an error message', async () => {
    await wrap(<TextField label="Email" invalid />);
    expect(screen.getByLabelText('Email').props['aria-invalid']).toBe(true);
    expect(screen.queryByText('Enter a valid email')).toBeNull();
    await screen.rerender(
      <Provider>
        <TextField label="Email" />
      </Provider>,
    );
    expect(screen.getByLabelText('Email').props['aria-invalid']).toBe(false);
  });

  it('readOnly: not editable, still a readOnly input, no clear button, quieter surface', async () => {
    await wrap(<TextField label="IBAN" readOnly clearable defaultValue="GB33" />);
    const input = screen.getByLabelText('IBAN');
    expect(input.props.editable).toBe(false);
    expect(input.props.readOnly).toBe(true);
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    expect(nodes().map(style).some((s) => s.backgroundColor === roles['surface-container-low'])).toBe(true);
  });

  it('clearable fires onChangeText("") then onClear', async () => {
    const calls: string[] = [];
    await wrap(
      <TextField
        label="Name"
        clearable
        defaultValue="Ada"
        onChangeText={(t) => calls.push(`change:${t}`)}
        onClear={() => calls.push('clear')}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Clear' }));
    expect(calls).toEqual(['change:', 'clear']);
  });

  it('loading marks the input busy and shows a spinner', async () => {
    await wrap(<TextField label="Handle" loading />);
    expect(screen.getByLabelText('Handle')).toBeBusy();
    expect(nodes().some((n) => n.type === 'ActivityIndicator')).toBe(true);
  });

  it('renders the icon and addon slots, a string addon as text', async () => {
    await wrap(
      <TextField
        label="Site"
        leadingIcon={mark('lead')}
        trailingIcon={mark('trail')}
        leadingAddon="https://"
        trailingAddon={mark('suffix')}
      />,
    );
    for (const id of ['lead', 'trail', 'suffix']) expect(screen.getByTestId(id)).toBeTruthy();
    expect(screen.getByText('https://')).toBeTruthy();
  });

  it('size sets the field height', async () => {
    await wrap(<TextField label="Name" size="sm" />);
    expect(minHeights()).toContain(controlHeights.sm);
    await screen.rerender(
      <Provider>
        <TextField label="Name" />
      </Provider>,
    );
    expect(minHeights()).toContain(controlHeights.lg);
  });
});

describe('PasswordInput', () => {
  it('defaultVisible starts shown', async () => {
    await wrap(<PasswordInput label="Password" defaultVisible />);
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);
  });

  it('visible is controlled: the toggle reports, the prop decides', async () => {
    const onVisibleChange = jest.fn();
    await wrap(<PasswordInput label="Password" visible={false} onVisibleChange={onVisibleChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Show password' }));
    expect(onVisibleChange).toHaveBeenCalledWith(true);
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);
  });

  it('inherits TextField props (invalid, loading)', async () => {
    await wrap(<PasswordInput label="Password" invalid loading />);
    const input = screen.getByLabelText('Password');
    expect(input.props['aria-invalid']).toBe(true);
    expect(input).toBeBusy();
  });
});

describe('SearchField', () => {
  it('onClear fires after the field empties', async () => {
    const onClear = jest.fn();
    const onChangeText = jest.fn();
    await wrap(<SearchField defaultValue="coffee" onClear={onClear} onChangeText={onChangeText} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChangeText).toHaveBeenLastCalledWith('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Search').props.value).toBe('');
  });

  it('keeps the search role and takes TextField props', async () => {
    await wrap(<SearchField label="Find" loading invalid readOnly />);
    const input = screen.getByRole('search', { name: 'Find' });
    expect(input).toBeBusy();
    expect(input.props['aria-invalid']).toBe(true);
    expect(input.props.editable).toBe(false);
  });
});

describe('MoneyInput + CurrencySelect', () => {
  it('currencySlot sits beside the amount; picking a currency reports its code', async () => {
    const onCurrency = jest.fn();
    await wrap(
      <MoneyInput
        label="Amount"
        currency="USD"
        currencySlot={<CurrencySelect label="Currency" value="USD" onValueChange={onCurrency} />}
      />,
    );
    expect(screen.getByLabelText('Amount')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Currency, USD · US Dollar' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'EUR · Euro, €' }));
    expect(onCurrency).toHaveBeenCalledWith('EUR');
  });

  it('inherits TextField props', async () => {
    await wrap(<MoneyInput label="Amount" currency="USD" invalid readOnly />);
    const input = screen.getByLabelText('Amount');
    expect(input.props['aria-invalid']).toBe(true);
    expect(input.props.editable).toBe(false);
  });

  it('currencySelectOptions: code · name, symbol below, priority first', () => {
    const options = currencySelectOptions('en-US', ['usd', 'EUR', 'JPY'], ['EUR']);
    expect(options.map((o) => o.value)).toEqual(['EUR', 'USD', 'JPY']);
    expect(options[0]).toEqual({ value: 'EUR', label: 'EUR · Euro', description: '€' });
  });
});

describe('Checkbox', () => {
  it('invalid is announced and draws the box red', async () => {
    await wrap(<Checkbox label="Terms" invalid />);
    expect(screen.getByRole('checkbox', { name: 'Terms' }).props['aria-invalid']).toBe(true);
    expect(nodes().map(style).some((s) => s.borderColor === roles.error)).toBe(true);
  });

  it('readOnly does not toggle but stays enabled', async () => {
    const onCheckedChange = jest.fn();
    await wrap(<Checkbox label="Terms" readOnly defaultChecked onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox', { name: 'Terms' });
    await fireEvent.press(box);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(box).toBeChecked();
    expect(box).toBeEnabled();
  });

  it('size scales the label', async () => {
    const fontSize = () => style(screen.getByText('Terms')).fontSize as number;
    await wrap(<Checkbox label="Terms" size="sm" />);
    const sm = fontSize();
    await screen.rerender(
      <Provider>
        <Checkbox label="Terms" size="lg" />
      </Provider>,
    );
    expect(fontSize()).toBeGreaterThan(sm);
  });
});

describe('Switch', () => {
  it('invalid is announced and colours the track', async () => {
    await wrap(<Switch label="Wi-Fi" invalid />);
    const sw = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(sw.props['aria-invalid']).toBe(true);
    // The iOS host props: tint = the off track, onTint = the on track.
    expect([sw.props.tintColor, sw.props.onTintColor]).toEqual([roles['error-container'], roles.error]);
  });

  it('readOnly ignores a toggle', async () => {
    const onCheckedChange = jest.fn();
    await wrap(<Switch label="Wi-Fi" readOnly onCheckedChange={onCheckedChange} />);
    await fireEvent(screen.getByRole('switch', { name: 'Wi-Fi' }), 'valueChange', true);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).not.toBeChecked();
  });

  it('size scales the platform switch', async () => {
    await wrap(<Switch label="Wi-Fi" size="lg" />);
    expect(style(screen.getByRole('switch', { name: 'Wi-Fi' })).transform).toEqual([{ scale: 1.15 }]);
  });

  it('checkedIcon / uncheckedIcon draw the Nexub switch with the icon in the thumb', async () => {
    const onCheckedChange = jest.fn();
    await wrap(
      <Switch label="Dark mode" checkedIcon={mark('moon')} uncheckedIcon={mark('sun')} onCheckedChange={onCheckedChange} />,
    );
    const sw = screen.getByRole('switch', { name: 'Dark mode' });
    expect(sw).not.toBeChecked();
    expect(screen.getByTestId('sun')).toBeTruthy();
    await fireEvent.press(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
    expect(screen.getByTestId('moon')).toBeTruthy();
  });
});

describe('Stepper', () => {
  const adjust = (name: string, actionName: 'increment' | 'decrement') =>
    fireEvent(screen.getByLabelText(name), 'accessibilityAction', { nativeEvent: { actionName } });

  it('invalid is announced and colours the value', async () => {
    await wrap(<Stepper label="Guests" defaultValue={3} invalid />);
    expect(screen.getByRole('adjustable', { name: 'Guests' }).props['aria-invalid']).toBe(true);
    expect(style(screen.getByText('3')).color).toBe(roles.error);
  });

  it('precision formats the value and rounds each step', async () => {
    const onChange = jest.fn();
    await wrap(<Stepper label="Weight" defaultValue={1.5} step={0.1} precision={2} onValueChange={onChange} />);
    expect(screen.getByText('1.50')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Increment' }));
    expect(onChange).toHaveBeenLastCalledWith(1.6);
    expect(screen.getByText('1.60')).toBeTruthy();
  });

  it('size picks the button size', async () => {
    await wrap(<Stepper label="Guests" size="lg" />);
    expect(style(screen.getByRole('button', { name: 'Increment' })).height).toBe(controlHeights.md);
  });

  it('showSteppers={false} hides − / + and makes the value typeable', async () => {
    const onChange = jest.fn();
    await wrap(<Stepper label="Guests" defaultValue={2} max={5} showSteppers={false} onValueChange={onChange} />);
    expect(screen.queryByRole('button', { name: 'Increment' })).toBeNull();
    const input = screen.getByLabelText('Guests');
    expect(input.props.value).toBe('2');
    await adjust('Guests', 'increment');
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  describe('nullable', () => {
    it('starts empty, shows "–", and a step from empty goes to 0 (or the nearest bound)', async () => {
      const onChange = jest.fn();
      await wrap(<Stepper label="Rooms" nullable min={1} onValueChange={onChange} />);
      const input = screen.getByLabelText('Rooms');
      expect(input.props.value).toBe('');
      expect(input.props.placeholder).toBe('–');
      expect(input.props.accessibilityValue).toMatchObject({ text: '–' });
      await fireEvent.press(screen.getByRole('button', { name: 'Increment' }));
      expect(onChange).toHaveBeenLastCalledWith(1);
    });

    it('clearing reports null; a half-typed value stays as typed', async () => {
      const onChange = jest.fn();
      await wrap(<Stepper label="Rooms" nullable defaultValue={4} onValueChange={onChange} />);
      const input = screen.getByLabelText('Rooms');
      await fireEvent(input, 'focus');
      await fireEvent.changeText(input, '');
      expect(onChange).toHaveBeenLastCalledWith(null);
      await fireEvent.changeText(screen.getByLabelText('Rooms'), '2.');
      expect(screen.getByLabelText('Rooms').props.value).toBe('2.');
      expect(onChange).toHaveBeenLastCalledWith(2);
      await fireEvent.changeText(screen.getByLabelText('Rooms'), '2.x');
      expect(screen.getByLabelText('Rooms').props.value).toBe('2.');
    });

    it('clamps on blur, not while typing', async () => {
      const onChange = jest.fn();
      await wrap(<Stepper label="Rooms" nullable min={15} max={40} onValueChange={onChange} />);
      const input = screen.getByLabelText('Rooms');
      await fireEvent(input, 'focus');
      await fireEvent.changeText(input, '3');
      expect(onChange).toHaveBeenLastCalledWith(3);
      await fireEvent.changeText(screen.getByLabelText('Rooms'), '300');
      expect(onChange).toHaveBeenLastCalledWith(300);
      await fireEvent(screen.getByLabelText('Rooms'), 'blur');
      expect(onChange).toHaveBeenLastCalledWith(40);
      expect(screen.getByLabelText('Rooms').props.value).toBe('40');
    });

    it('a controlled null stays empty', async () => {
      await wrap(<Stepper label="Rooms" nullable value={null} onValueChange={() => {}} />);
      expect(screen.getByLabelText('Rooms').props.value).toBe('');
    });
  });
});

describe('SwitchField', () => {
  it('pressing the label toggles; description and error are the hint; error marks it invalid', async () => {
    const onCheckedChange = jest.fn();
    await wrap(
      <SwitchField
        label="Wi-Fi"
        description="Join known networks"
        error="Needs location"
        onCheckedChange={onCheckedChange}
      />,
    );
    const sw = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(sw.props.accessibilityHint).toBe('Join known networks. Needs location');
    expect(sw.props['aria-invalid']).toBe(true);
    expect(screen.getByText('Needs location')).toBeTruthy();
    await fireEvent.press(screen.getByText('Wi-Fi', { includeHiddenElements: true }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeChecked();
  });

  it('a disabled or read-only field ignores label presses', async () => {
    const onCheckedChange = jest.fn();
    await wrap(<SwitchField label="Wi-Fi" readOnly onCheckedChange={onCheckedChange} />);
    await fireEvent.press(screen.getByText('Wi-Fi', { includeHiddenElements: true }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('layout="start" puts the switch first', async () => {
    await wrap(<SwitchField label="Wi-Fi" layout="start" />);
    const order = nodes().filter((n) => n.type === 'RCTSwitch' || (n.type === 'Text' && n.children?.[0] === 'Wi-Fi'));
    expect(order.map((n) => n.type)).toEqual(['RCTSwitch', 'Text']);
  });
});

describe('CheckboxField', () => {
  it('shows the error, marks the box invalid, and renders the aside', async () => {
    await wrap(<CheckboxField label="Insurance" description="Covers loss" error="Pick one" aside="$12" />);
    const box = screen.getByRole('checkbox', { name: 'Insurance' });
    expect(box.props['aria-invalid']).toBe(true);
    expect(box.props.accessibilityHint).toBe('Covers loss. Pick one');
    expect(screen.getByText('Pick one')).toBeTruthy();
    expect(screen.getByText('$12')).toBeTruthy();
  });

  it('toggles like a Checkbox', async () => {
    const onCheckedChange = jest.fn();
    await wrap(<CheckboxField label="Insurance" onCheckedChange={onCheckedChange} />);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Insurance' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe('CheckboxGroupField', () => {
  const options = [
    { value: 'olives', label: 'Olives' },
    { value: 'basil', label: 'Basil', description: 'Fresh' },
    { value: 'anchovy', label: 'Anchovy', disabled: true },
  ];

  it('is a labelled group; picks build the value in pick order', async () => {
    const onValueChange = jest.fn();
    await wrap(<CheckboxGroupField label="Toppings" options={options} defaultValue={['basil']} onValueChange={onValueChange} />);
    // A group, not one accessible element: its boxes stay reachable one by one.
    expect(screen.getByLabelText('Toppings').props.role).toBe('group');
    expect(screen.getByRole('checkbox', { name: 'Basil' })).toBeChecked();
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Olives' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['basil', 'olives']);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Basil' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['olives']);
    expect(screen.getByRole('checkbox', { name: 'Anchovy' })).toBeDisabled();
  });

  it('controlled value wins; error marks every box invalid; required shows a marker', async () => {
    const onValueChange = jest.fn();
    await wrap(
      <CheckboxGroupField label="Toppings" options={options} value={[]} onValueChange={onValueChange} error="Pick one" required />,
    );
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Olives' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['olives']);
    expect(screen.getByRole('checkbox', { name: 'Olives' })).not.toBeChecked();
    for (const name of ['Olives', 'Basil', 'Anchovy'])
      expect(screen.getByRole('checkbox', { name }).props['aria-invalid']).toBe(true);
    expect(screen.getByText('Pick one')).toBeTruthy();
    expect(screen.getByText(' *', { includeHiddenElements: true })).toBeTruthy();
  });

  it('disabled and readOnly reach every box', async () => {
    const onValueChange = jest.fn();
    await wrap(<CheckboxGroupField label="Toppings" options={options} readOnly onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Olives' }));
    expect(onValueChange).not.toHaveBeenCalled();
    await screen.rerender(
      <Provider>
        <CheckboxGroupField label="Toppings" options={options} disabled />
      </Provider>,
    );
    expect(screen.getByRole('checkbox', { name: 'Olives' })).toBeDisabled();
  });
});
