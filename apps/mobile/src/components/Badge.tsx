import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radii, spacing, typography, fontSizes } from '../constants/tokens';

export interface BadgeProps {
    label: string;
    color: string;
    backgroundColor: string;
    style?: any;
}

export function Badge({ label, color, backgroundColor, style }: BadgeProps) {
    return (
        <View style={[styles.container, { backgroundColor }, style]}>
            <Text style={[styles.text, { color }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xxs,
        borderRadius: radii.full,
        alignSelf: 'flex-start',
    },
    text: {
        ...typography.sansBold,
        fontSize: fontSizes.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
