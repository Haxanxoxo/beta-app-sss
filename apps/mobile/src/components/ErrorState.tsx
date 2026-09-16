import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, fontSizes } from '../constants/tokens';
import { Button } from './Button';

export interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    fullScreen?: boolean;
}

export function ErrorState({
    title = 'Something went wrong',
    message,
    onRetry,
    fullScreen = false
}: ErrorStateProps) {
    return (
        <View style={[styles.container, fullScreen && styles.fullScreen]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <Button
                    label="Try Again"
                    onPress={onRetry}
                    variant="outline"
                    style={styles.button}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.warmSurface,
        borderRadius: spacing.base,
    },
    fullScreen: {
        flex: 1,
        backgroundColor: colors.mainBackground,
        borderRadius: 0,
    },
    title: {
        ...typography.sansMedium,
        fontSize: fontSizes.lg,
        color: colors.primaryText,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    message: {
        ...typography.sans,
        fontSize: fontSizes.base,
        color: colors.secondaryText,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    button: {
        minWidth: 120,
    }
});
