import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, fontSizes } from '../constants/tokens';
import { Button } from './Button';

export interface EmptyStateProps {
    title: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

export function EmptyState({ title, message, actionLabel, onAction, icon }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            {actionLabel && onAction && (
                <Button
                    label={actionLabel}
                    onPress={onAction}
                    variant="outline"
                    style={styles.button}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['2xl'],
        backgroundColor: colors.transparent,
    },
    iconContainer: {
        marginBottom: spacing.lg,
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
        marginBottom: spacing.xl,
    },
    button: {
        minWidth: 160,
    }
});
