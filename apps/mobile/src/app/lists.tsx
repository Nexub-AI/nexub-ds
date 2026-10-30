import { useState } from 'react';
import { Stack as Screen } from 'expo-router';
import { Bell, CreditCard, Globe, Lock, Moon } from '@nexub/icons/native';
import {
  Accordion,
  Amount,
  Avatar,
  Badge,
  Card,
  Heading,
  Icon,
  Inline,
  ListItem,
  ListSection,
  ScreenContainer,
  Stack,
  Text,
} from '@nexub/react-native';

export default function ListsScreen() {
  const [faceId, setFaceId] = useState(true);
  const [dark, setDark] = useState(false);
  const [speed, setSpeed] = useState('standard');
  return (
    <ScreenContainer>
      <Screen.Screen options={{ title: 'Lists & cards' }} />

      <Card>
        <Text variant="label-lg" color="on-surface-variant">
          Total balance
        </Text>
        <Amount value={12480.5} currency="USD" locale="en-US" size="display" />
        <Inline>
          <Badge tone="success" dot>
            +2.4% this month
          </Badge>
        </Inline>
      </Card>

      <ListSection header="Recent activity">
        <ListItem
          title="Amazon"
          subtitle="Today · Card"
          leading={<Avatar name="Amazon" size="md" />}
          trailing={<Amount value={-42.5} currency="USD" locale="en-US" tone="auto" />}
          onPress={() => {}}
          variant="navigation"
        />
        <ListItem
          title="Salary"
          subtitle="Yesterday · Bank transfer"
          leading={<Avatar name="Acme Corp" size="md" />}
          trailing={<Amount value={4200} currency="USD" locale="en-US" tone="auto" signDisplay="exceptZero" />}
        />
      </ListSection>

      <ListSection header="Security" footer="Face ID is used to approve payments over $500." inset={56}>
        <ListItem variant="switch" title="Face ID" leading={<Icon icon={Lock} />} checked={faceId} onCheckedChange={setFaceId} />
        <ListItem title="Cards" value="2 active" leading={<Icon icon={CreditCard} />} onPress={() => {}} />
        <ListItem title="Notifications" leading={<Icon icon={Bell} />} onPress={() => {}} />
      </ListSection>

      <ListSection header="Appearance" inset={56}>
        <ListItem variant="switch" title="Dark mode" leading={<Icon icon={Moon} />} checked={dark} onCheckedChange={setDark} />
        <ListItem title="Language" value="English" leading={<Icon icon={Globe} />} onPress={() => {}} />
      </ListSection>

      <ListSection header="Delivery speed">
        <ListItem variant="radio" title="Standard" subtitle="1–2 business days" checked={speed === 'standard'} onCheckedChange={() => setSpeed('standard')} />
        <ListItem variant="radio" title="Instant" subtitle="Seconds · $1.50" checked={speed === 'instant'} onCheckedChange={() => setSpeed('instant')} />
      </ListSection>

      <ListSection>
        <ListItem variant="button" title="Sign out" destructive onPress={() => {}} />
      </ListSection>

      <Stack gap="0">
        <Heading variant="title-lg" style={{ marginBottom: 8 }}>
          FAQ
        </Heading>
        <Accordion title="How long does a transfer take?">
          <Text color="on-surface-variant">Most transfers arrive in seconds. Bank transfers can take 1–2 business days.</Text>
        </Accordion>
        <Accordion title="Is there a fee?">
          <Text color="on-surface-variant">We show the fee before you confirm. No hidden markup on the exchange rate.</Text>
        </Accordion>
      </Stack>
    </ScreenContainer>
  );
}
