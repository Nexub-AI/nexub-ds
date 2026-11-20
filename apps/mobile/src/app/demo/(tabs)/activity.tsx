import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { ActivityList, TransactionDetail } from '@nexub/react-native/patterns';
import { REFERENCES, TRANSACTIONS } from '../../../demo/data';

export default function DemoActivity() {
  // ponytail: same rule as useBreakpoint().isTablet (shortest side ≥ 600) in
  // packages/react-native/src/theme/layout.ts; switch to the hook once the package exports it.
  const { width, height } = useWindowDimensions();
  const twoPane = Math.min(width, height) >= 600;
  const [selected, setSelected] = useState(TRANSACTIONS[0]!);

  if (!twoPane) return <ActivityList transactions={TRANSACTIONS} onPress={(t) => router.push(`/demo/transaction/${t.id}`)} />;
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ flex: 2 }}>
        <ActivityList transactions={TRANSACTIONS} onPress={setSelected} />
      </View>
      <View style={{ flex: 3 }}>
        <TransactionDetail transaction={selected} rows={[{ label: 'Reference', value: REFERENCES[selected.id] ?? '—' }]} />
      </View>
    </View>
  );
}
