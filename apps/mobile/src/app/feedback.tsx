import { useState } from 'react';
import { Stack as Screen } from 'expo-router';
import { Wallet } from '@nexub/icons/native';
import {
  Banner,
  Button,
  Dialog,
  EmptyState,
  ErrorState,
  Heading,
  Inline,
  LoadingIndicator,
  Progress,
  ScreenContainer,
  Skeleton,
  Stack,
  useToast,
} from '@nexub/react-native';

export default function FeedbackScreen() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  return (
    <ScreenContainer>
      <Screen.Screen options={{ title: 'Feedback' }} />

      <Stack>
        <Heading variant="title-lg">Banners</Heading>
        <Banner tone="info" title="Verify your identity">
          We need a photo ID before your first transfer over $1,000.
        </Banner>
        <Banner tone="warning" action={<Button variant="text" size="sm">Review</Button>} onDismiss={() => {}}>
          Your card expires next month.
        </Banner>
        <Banner tone="success">Transfer sent. It should arrive in seconds.</Banner>
      </Stack>

      <Stack>
        <Heading variant="title-lg">Toast and dialog</Heading>
        <Inline>
          <Button variant="tonal" onPress={() => toast({ message: 'Recipient saved', action: { label: 'Undo', onPress: () => {} } })}>
            Show toast
          </Button>
          <Button variant="outlined" onPress={() => setOpen(true)}>
            Open dialog
          </Button>
        </Inline>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Cancel this transfer?"
          description="The money goes back to your balance. This can’t be undone."
          actions={
            <>
              <Button variant="text" onPress={() => setOpen(false)}>
                Keep it
              </Button>
              <Button tone="danger" onPress={() => setOpen(false)}>
                Cancel transfer
              </Button>
            </>
          }
        />
      </Stack>

      <Stack>
        <Heading variant="title-lg">Progress</Heading>
        <Progress value={0.62} label="Verification" />
        <Inline gap="6">
          <Progress value={0.62} label="Upload" variant="circular" />
          <LoadingIndicator />
        </Inline>
        <Stack gap="2">
          <Skeleton width="60%" height={20} />
          <Skeleton height={14} />
          <Skeleton width="80%" height={14} />
        </Stack>
      </Stack>

      <EmptyState
        icon={Wallet}
        tone="payub"
        title="No transactions yet"
        description="Add money to your balance to get started."
        action={<Button>Add money</Button>}
      />
      <ErrorState title="Couldn’t load your activity" description="Check your connection and try again." onRetry={() => {}} />
    </ScreenContainer>
  );
}
