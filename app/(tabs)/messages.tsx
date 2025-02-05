import { StyleSheet, NativeModules } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '../../contexts/LanguageContext';
import { sendSms } from '../../modules/sms';


export default function TabTwoScreen() {

  const { t } = useLanguage();

  return (
    <ParallaxScrollView
      header={
        <IconSymbol
          size={240}
          color="#000"
          name="message"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t("messages")}</ThemedText>
      </ThemedView>

      <ThemedText type="title">{sendSms("hola")}</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#000',
    bottom: -50,
    left: 20,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
