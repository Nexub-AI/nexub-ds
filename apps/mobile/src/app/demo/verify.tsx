import { Stack as Screen, router } from 'expo-router';
import { useToast } from '@nexub/react-native';
import { VerifyCodeScreen } from '@nexub/react-native/patterns';
import { useDemoAuth } from '../../demo/auth';
import { USER } from '../../demo/data';

export default function DemoVerify() {
  const { signIn } = useDemoAuth();
  const toast = useToast();
  return (
    <>
      <Screen.Screen options={{ title: 'Verify code' }} />
      <VerifyCodeScreen
        destination={USER.phone}
        // Any code is accepted. Sign-in and this screen leave the stack, so back can't return to them.
        onComplete={() => {
          signIn();
          router.dismissAll();
          router.replace('/demo/home');
        }}
        onResend={() => toast({ message: 'Code sent again' })}
      />
    </>
  );
}
