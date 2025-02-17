import ChangeColorButton from "@/components/ChangeHeaderColorButton";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLanguage } from "@/contexts/LanguageContext";
import React from "react";


import { StyleSheet } from "react-native";
import ChangeLanguageButton from "../../components/ChangeLanguageButton";

export default function SettingsScreen() {
    const { t } = useLanguage();
    return (
        <ParallaxScrollView
            header={
                <IconSymbol size={290} name="gear" color="#000" style={styles.gearLogo} />
            }
        >
            <ThemedText type="title">{t('settings')}</ThemedText>

            <ThemedText>{t('customize_settings')}</ThemedText>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="defaultSemiBold">{t('change_header_color')}</ThemedText>
                <ChangeColorButton />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="defaultSemiBold">{t('pick_language')}</ThemedText>
                <ChangeLanguageButton />
            </ThemedView>
        </ParallaxScrollView>
    );
}


const styles = StyleSheet.create({

    stepContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    gearLogo: {
        color: '#000',
        bottom: -90,
        left: 0,
        position: 'absolute',
    },
});