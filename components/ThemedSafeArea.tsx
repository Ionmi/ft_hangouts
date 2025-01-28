
import { ViewProps } from 'react-native';
import { ThemedView } from './ThemedView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ThemedSafeAreaProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSafeArea({ style, lightColor, darkColor, ...otherProps }: ThemedSafeAreaProps) {
  const insets = useSafeAreaInsets();
  return <ThemedView style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }, style]} lightColor={lightColor} darkColor={darkColor} {...otherProps} />;
}
