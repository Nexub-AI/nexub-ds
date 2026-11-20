import { Stack as Screen, useLocalSearchParams } from 'expo-router';
import { Button, ErrorState, useToast } from '@nexub/react-native';
import { TransactionDetail } from '@nexub/react-native/patterns';
import { REFERENCES, TRANSACTIONS } from '../../../demo/data';

export default function DemoTransaction() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const t = TRANSACTIONS.find((x) => x.id === id);
  return (
    <>
      <Screen.Screen options={{ title: 'Transaction' }} />
      {t ? (
        <TransactionDetail
          transaction={t}
          rows={[{ label: 'Reference', value: REFERENCES[t.id] ?? '—' }]}
          actions={
            <Button variant="tonal" fullWidth size="lg" onPress={() => toast({ message: 'Help is not part of the demo' })}>
              Get help
            </Button>
          }
        />
      ) : (
        <ErrorState title="Not found" description="This transaction is not in the sample data." />
      )}
    </>
  );
}
