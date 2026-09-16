import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, spacing, shadows } from '../constants/tokens';

export interface CardProps extends ViewProps {
    variant?: 'elevated' | 'outline' | 'flat';
    noPadding?: boolean;
}

export function Card({
    children,
    variant = 'elevated',
    noPadding = false,
    style,
    ...props
}: CardProps) {
    return (
        <View
            style={[
                styles.container,
                !noPadding && styles.padding,
                styles[variant],
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: radii.card,
        backgroundColor: colors.cardBackground,
    },
    padding: {
        padding: spacing.xl,
    },
    elevated: {
        ...shadows.sm,
    },
    outline: {
        borderWidth: 1,
        borderColor: colors.softBorder,
    },
    flat: {
        // just background color
    },
});
