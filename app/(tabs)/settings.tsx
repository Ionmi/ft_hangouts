import ChangeColorButton from "@/components/ChangeHeaderColorButton";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { StyleSheet } from "react-native";

export default function SettingsScreen() {
    return (
        <ParallaxScrollView
            headerImage={
                <IconSymbol size={310} name="gear" color="#808080" style={styles.gearLogo} />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Settings</ThemedText>
            </ThemedView>
            <ThemedText>Customize your app settings here.</ThemedText>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Change header color</ThemedText>
                <ChangeColorButton />
            </ThemedView>
        </ParallaxScrollView>
    );
}


const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    gearLogo: {
        color: '#808080',
        bottom: -90,
        left: 0,
        position: 'absolute',
    },
});