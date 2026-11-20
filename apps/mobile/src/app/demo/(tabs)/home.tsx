import { router } from 'expo-router';
import { ArrowDown, CreditCard, Plus, Send } from '@nexub/icons/native';
import { useToast } from '@nexub/react-native';
import { HomeScreen } from '@nexub/react-native/patterns';
import { BALANCE, INSIGHTS, TRANSACTIONS, USER } from '../../../demo/data';

export default function DemoHome() {
  const toast = useToast();
  const soon = (label: string) => () => toast({ message: `${label} is not part of the demo` });
  return (
    <HomeScreen
      greeting={`Good morning, ${USER.name.split(' ')[0]}`}
      balance={BALANCE}
      quickActions={[
        { id: 'send', label: 'Send', icon: Send, onPress: soon('Send') },
        { id: 'add', label: 'Add money', icon: Plus, onPress: soon('Add money') },
        { id: 'request', label: 'Request', icon: ArrowDown, onPress: soon('Request') },
        { id: 'card', label: 'Card', icon: CreditCard, onPress: soon('Card') },
      ]}
      recent={TRANSACTIONS.slice(0, 3)}
      onTransactionPress={(t) => router.push(`/demo/transaction/${t.id}`)}
      onSeeAllActivity={() => router.navigate('/demo/activity')}
      insights={INSIGHTS}
    />
  );
}
