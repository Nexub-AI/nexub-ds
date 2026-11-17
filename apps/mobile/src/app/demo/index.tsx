import { Stack as Screen, router } from 'expo-router';
import { Wallet } from '@nexub/icons/native';
import { Button, Icon, useToast } from '@nexub/react-native';
import { SignInScreen } from '@nexub/react-native/patterns';
import { useDemoAuth } from '../../demo/auth';

export default function DemoSignIn() {
  const { begin } = useDemoAuth();
  const toast = useToast();
  return (
    <>
      <Screen.Screen
        options={{
          title: 'Demo app',
          // First screen of its own stack, so there is no system back button to the gallery.
          headerLeft: () => (
            <Button variant="text" size="sm" onPress={() => router.back()}>
              Gallery
            </Button>
          ),
        }}
      />
      <SignInScreen
        logo={<Icon icon={Wallet} color="tertiary" size="xl" />}
        title="Welcome back"
        onSubmit={(email) => {
          begin(email);
          router.push('/demo/verify');
        }}
        onForgotPassword={() => toast({ message: 'Any email and password work in the demo' })}
      />
    </>
  );
}
