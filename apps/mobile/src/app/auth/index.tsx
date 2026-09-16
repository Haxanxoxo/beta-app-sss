import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, fontSizes, MIN_TOUCH_TARGET, radii } from '../../constants/tokens';
import { Button, Input } from '../../components';

export default function AuthScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        // Basic mock authentication
        if (pin.length === 4) {
            router.replace('/(tabs)');
        } else {
            setError('PIN must be 4 digits');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.brandContainer}>
                    <Text style={styles.brandTitle}>SSS RESET KIT</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.welcomeText}>Welcome back</Text>
                    <Text style={styles.instructionText}>Enter your 4-digit PIN to continue</Text>

                    <Input
                        value={pin}
                        onChangeText={(t) => {
                            setPin(t.replace(/[^0-9]/g, '').slice(0, 4));
                            setError('');
                        }}
                        error={error}
                        keyboardType="number-pad"
                        style={styles.pinInput}
                        secureTextEntry
                    />

                    <Button
                        label="Enter"
                        onPress={handleLogin}
                        disabled={pin.length < 4}
                        style={styles.submitButton}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBackground,
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: spacing.xl,
    },
    brandContainer: {
        alignItems: 'center',
        marginBottom: spacing['4xl'],
    },
    brandTitle: {
        ...typography.sansBold,
        fontSize: fontSizes['2xl'],
        color: colors.deepNavy,
        letterSpacing: 2,
    },
    formContainer: {
        backgroundColor: colors.white,
        padding: spacing.xl,
        paddingVertical: spacing['3xl'],
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.softBorder,
    },
    welcomeText: {
        ...typography.serifBold,
        fontSize: fontSizes['2xl'],
        color: colors.primaryText,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    instructionText: {
        ...typography.sans,
        fontSize: fontSizes.base,
        color: colors.secondaryText,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    pinInput: {
        ...typography.sansBold,
        fontSize: fontSizes['2xl'],
        textAlign: 'center',
        letterSpacing: 8,
        marginBottom: spacing.xl,
        minHeight: 60,
    },
    submitButton: {
        width: '100%',
    }
});
