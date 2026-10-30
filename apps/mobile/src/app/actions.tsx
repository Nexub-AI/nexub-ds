import { useState } from 'react';
import { Stack as Screen } from 'expo-router';
import { ArrowRight, Heart, Plus, Send, Wallet } from '@nexub/icons/native';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  ButtonGroup,
  Chip,
  FilterChip,
  Heading,
  IconButton,
  Inline,
  Link,
  ScreenContainer,
  Stack,
} from '@nexub/react-native';

export default function ActionsScreen() {
  const [fav, setFav] = useState(false);
  const [filters, setFilters] = useState<string[]>(['Card']);
  const toggle = (f: string) => setFilters((all) => (all.includes(f) ? all.filter((x) => x !== f) : [...all, f]));
  return (
    <ScreenContainer>
      <Screen.Screen options={{ title: 'Actions' }} />

      <Stack>
        <Heading variant="title-lg">Buttons</Heading>
        <Button size="lg" fullWidth trailingIcon={ArrowRight}>
          Continue
        </Button>
        <Inline>
          <Button variant="tonal" leadingIcon={Plus}>
            Add money
          </Button>
          <Button variant="outlined">Details</Button>
          <Button variant="text">Skip</Button>
        </Inline>
        <Inline>
          <Button tone="payub" leadingIcon={Wallet}>
            Payub
          </Button>
          <Button tone="danger">Delete</Button>
          <Button loading loadingLabel="Sending">
            Send
          </Button>
          <Button disabled>Disabled</Button>
        </Inline>
        <ButtonGroup direction="stack">
          <Button size="lg">Confirm transfer</Button>
          <Button size="lg" variant="text">
            Cancel
          </Button>
        </ButtonGroup>
      </Stack>

      <Stack>
        <Heading variant="title-lg">Icon buttons</Heading>
        <Inline gap="4">
          <IconButton icon={Heart} label="Favourite" selected={fav} haptic="toggleOn" onPress={() => setFav(!fav)} />
          <IconButton icon={Send} label="Send" variant="tonal" />
          <IconButton icon={Plus} label="Add" variant="filled" />
          <IconButton icon={Plus} label="Add (outlined)" variant="outlined" size="sm" />
        </Inline>
      </Stack>

      <Stack>
        <Heading variant="title-lg">Chips</Heading>
        <Inline>
          {['Card', 'Bank', 'Cash'].map((f) => (
            <FilterChip key={f} label={f} selected={filters.includes(f)} onPress={() => toggle(f)} />
          ))}
          <Chip label="EUR" onRemove={() => {}} />
        </Inline>
      </Stack>

      <Stack>
        <Heading variant="title-lg">Badges</Heading>
        <Inline>
          <Badge tone="success" dot>
            Paid
          </Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="danger" variant="solid">
            3
          </Badge>
          <Badge tone="payub">Payub</Badge>
          <Badge variant="outline">v2.1</Badge>
        </Inline>
      </Stack>

      <Stack>
        <Heading variant="title-lg">Avatars</Heading>
        <Inline gap="4">
          <Avatar name="Asha Rao" size="lg" badge />
          <Avatar name="Leo Tan" />
          <AvatarGroup>
            {['Asha Rao', 'Leo Tan', 'Mia Chen', 'Omar Ali', 'Sam Lee', 'Zoe Park'].map((n) => (
              <Avatar key={n} name={n} />
            ))}
          </AvatarGroup>
        </Inline>
        <Link onPress={() => {}}>View all contacts</Link>
      </Stack>
    </ScreenContainer>
  );
}
