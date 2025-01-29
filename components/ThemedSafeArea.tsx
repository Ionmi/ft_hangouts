
import { ViewProps, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThemedView } from './ThemedView';

export type ThemedSafeAreaProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSafeArea({ style, lightColor, darkColor, children, ...otherProps }: ThemedSafeAreaProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]} {...otherProps}>
      <SafeAreaView children={children} style={style} />
    </ThemedView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});