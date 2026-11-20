import { useState } from 'react';
import { Bell, Lock } from '@nexub/icons/native';
import { Icon } from '@nexub/react-native';
import { ProfileHeader, SettingsScreen } from '@nexub/react-native/patterns';
import { useDemoAuth } from '../../../demo/auth';
import { USER } from '../../../demo/data';

export default function DemoSettings() {
  const { email, signOut } = useDemoAuth();
  const [faceId, setFaceId] = useState(true);
  const [alerts, setAlerts] = useState(true);
  return (
    <SettingsScreen
      header={<ProfileHeader name={USER.name} detail={email || undefined} />}
      groups={[
        {
          header: 'Security',
          footer: 'Face ID approves payments over $500.',
          items: [{ variant: 'switch', title: 'Face ID', leading: <Icon icon={Lock} />, checked: faceId, onCheckedChange: setFaceId }],
        },
        {
          header: 'Notifications',
          items: [{ variant: 'switch', title: 'Payment alerts', leading: <Icon icon={Bell} />, checked: alerts, onCheckedChange: setAlerts }],
        },
        // The tabs layout sees the session end and returns to /demo.
        { items: [{ variant: 'button', title: 'Sign out', destructive: true, onPress: signOut }] },
      ]}
    />
  );
}
