import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, fontSizes } from '../constants/tokens';

export interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    style?: any;
}

export function SectionHeader({ title, subtitle, align = 'left', style }: SectionHeaderProps) {
    return (
        <View style={[styles.container, { alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }, style]}>
            <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
            {subtitle && <Text style={[styles.subtitle, { textAlign: align }]}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.serifMedium,
        fontSize: fontSizes['2xl'],
        color: colors.primaryText,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.sans,
        fontSize: fontSizes.base,
        color: colors.secondaryText,
        lineHeight: 22,
    },
});
