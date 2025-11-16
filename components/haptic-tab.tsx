import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Trigger haptic feedback on native platforms (iOS/Android) but skip web.
        try {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        } catch (e) {
          // No-op if haptics isn't available on the platform/runtime.
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
