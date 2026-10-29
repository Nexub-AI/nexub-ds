import { useState } from 'react';
import { Stack as Screen } from 'expo-router';
import {
  Checkbox,
  Heading,
  MoneyInput,
  PasswordInput,
  Radio,
  RadioGroup,
  ScreenContainer,
  SearchField,
  SegmentedControl,
  Slider,
  Stack,
  Stepper,
  Switch,
  Text,
  TextField,
  Inline,
} from '@nexub/react-native';

export default function InputsScreen() {
  const [amount, setAmount] = useState<number | null>(250);
  const [volume, setVolume] = useState(40);
  return (
    <ScreenContainer keyboardDismissMode="interactive">
      <Screen.Screen options={{ title: 'Inputs' }} />

      <Stack gap="4">
        <Heading variant="title-lg">Fields</Heading>
        <SearchField placeholder="Search transactions" />
        <TextField label="Full name" placeholder="As on your ID" textContentType="name" autoComplete="name" />
        <TextField label="Email" keyboardType="email-address" autoCapitalize="none" error="Enter a valid email address" defaultValue="asha@" />
        <PasswordInput label="Password" helperText="At least 12 characters" />
        <MoneyInput label="You send" currency="USD" value={amount} onValueChange={setAmount} helperText={amount == null ? undefined : `Fee included: $${(amount * 0.004).toFixed(2)}`} />
      </Stack>

      <Stack gap="2">
        <Heading variant="title-lg">Selection</Heading>
        <SegmentedControl
          label="Period"
          options={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
        />
        <Checkbox label="Save this recipient" description="Find them faster next time" defaultChecked />
        <RadioGroup label="Delivery speed" defaultValue="standard">
          <Radio value="standard" label="Standard" description="1–2 business days · Free" />
          <Radio value="instant" label="Instant" description="Seconds · $1.50" />
        </RadioGroup>
        <Inline gap="4">
          <Switch label="Notifications" defaultChecked />
          <Stepper label="Guests" defaultValue={2} min={1} max={8} />
        </Inline>
        <Slider label="Volume" value={volume} onValueChange={setVolume} formatValue={(v) => `${v}%`} />
        <Text variant="label-md" color="on-surface-variant" tabular>
          Volume {volume}%
        </Text>
      </Stack>
    </ScreenContainer>
  );
}
