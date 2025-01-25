import { Image, StyleSheet, Platform, useColorScheme } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLanguage } from '../../contexts/LanguageContext';

import { useThemeColor } from '../../hooks/useThemeColor';
import FilledButton from '../../components/ui/FilledButton';
import { useAccentStyle } from '../../contexts/HeaderStyleContext';
import Button from '../../components/ui/Button';
import { IconSymbol } from '../../components/ui/IconSymbol';

export default function HomeScreen() {
  const { t } = useLanguage();
  const { color } = useAccentStyle();
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={require('@/assets/images/42.png')}
          style={styles.ftLogo}
        />
      }

    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t("contacts")}</ThemedText>
        <HelloWave />
        <ThemedView style={{ flex: 1 }} />
        <Button
          onPress={() => { }}>
          <IconSymbol name='plus' size={24} color={color[colorScheme]} />
        </Button>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  ftLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
