import React, { useEffect, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    Easing,
    AppState,
    AppStateStatus,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';

const TooltipAlert = () => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [lastActiveTime, setLastActiveTime] = useState<Date | null>(null);
    const [timeAwayMessage, setTimeAwayMessage] = useState('');
    const translateY = useState(new Animated.Value(-100))[0]; // Inicia fuera de la pantalla
    const insets = useSafeAreaInsets();
    const { language } = useLanguage();

    // Manejar AppState
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'background') {
                // Registra el tiempo al irse al fondo
                setLastActiveTime(new Date());
            } else if (nextAppState === 'active' && lastActiveTime) {
                // Calcula el tiempo transcurrido
                const now = new Date();
                const diff = Math.floor((now.getTime() - lastActiveTime.getTime()) / 1000);
                const message = formatTimeAway(diff);

                setTimeAwayMessage(message);
                showTooltip();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [lastActiveTime]);

    // Formatear tiempo transcurrido
    const formatTimeAway = (seconds: number): string => {
        if (language === 'es') {
            if (seconds === 1) return 'Estuviste ausente por 1 segundo.';
            if (seconds < 60) return `Estuviste ausente por ${seconds} segundos.`;
            const minutes = Math.floor(seconds / 60);
            if (minutes === 1) return 'Estuviste ausente por 1 minuto.';
            if (minutes < 60) return `Estuviste ausente por ${minutes} minutos.`;
            const hours = Math.floor(minutes / 60);
            if (hours === 1) return 'Estuviste ausente por 1 hora.';
            return `Estuviste ausente por ${hours} horas.`;
        }

        if (seconds === 1) return 'You were away for 1 second.';
        if (seconds < 60) return `You were away for ${seconds} seconds.`;
        const minutes = Math.floor(seconds / 60);
        if (minutes === 1) return 'You were away for 1 minute.';
        if (minutes < 60) return `You were away for ${minutes} minutes.`;
        const hours = Math.floor(minutes / 60);
        if (hours === 1) return 'You were away for 1 hour.';
        return `You were away for ${hours} hours.`;
    };

    // Mostrar el tooltip
    const showTooltip = () => {
        setTooltipVisible(true);
        Animated.timing(translateY, {
            toValue: 0, // Aparece en la pantalla
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        // Ocultar automáticamente después de 3 segundos
        setTimeout(() => {
            Animated.timing(translateY, {
                toValue: -100, // Se oculta fuera de la pantalla
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start(() => setTooltipVisible(false));
        }, 3000);
    };

    if (!tooltipVisible) return null;

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
            <Animated.View
                style={[styles.tooltipContainer, { transform: [{ translateY }] }]}
            >
                <Text style={styles.tooltipText}>{timeAwayMessage}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 1000,
    },
    tooltipContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    tooltipText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default TooltipAlert;