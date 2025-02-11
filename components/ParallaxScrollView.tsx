import type { PropsWithChildren, ReactElement } from 'react';
import { Dimensions, Platform, StatusBar, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useAccentStyle } from '@/contexts/HeaderStyleContext';
import { useBottomTabOverflow } from './ui/TabBarBackground';

const HEADER_HEIGHT = 240;

type Props = PropsWithChildren<{
  header: ReactElement;
  nestedScrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export default function ParallaxScrollView({
  children,
  header,
  nestedScrollEnabled = false,
  style = {},
}: Props) {

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const { color } = useAccentStyle();
  const windowDimensions = Dimensions.get('window');
  const extraHeight = StatusBar.currentHeight || 0;
  const availableHeight = windowDimensions.height - extraHeight;

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        nestedScrollEnabled={nestedScrollEnabled}
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom: bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: color },
            headerAnimatedStyle,
          ]}
        >
          {header}
        </Animated.View>
        <ThemedView style={[styles.content, { minHeight: availableHeight - HEADER_HEIGHT - bottom }, style]}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  }
});
