import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    type TouchableOpacityProps,
    type StyleProp,
    type ViewStyle,
    type TextStyle,
} from 'react-native';
import { colors, spacing, radii, typography, fontSizes, MIN_TOUCH_TARGET } from '../constants/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
    label: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
}

export function Button({
    label,
    variant = 'primary',
    size = 'lg',
    isLoading = false,
    leftIcon,
    rightIcon,
    style,
    labelStyle,
    disabled,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    const getContainerStyle = (): StyleProp<ViewStyle> => {
        const baseStyle: ViewStyle = { ...styles.container, ...styles[`size_${size}`] };
        const variantStyle = styles[`variant_${variant}`];

        return [
            baseStyle,
            variantStyle,
            isDisabled && styles.disabled,
            style,
        ];
    };

    const getTextStyle = (): StyleProp<TextStyle> => {
        const baseStyle = styles.text;
        const variantTextStyle = styles[`text_${variant}`];

        return [
            baseStyle,
            variantTextStyle,
            isDisabled && styles.textDisabled,
            labelStyle,
        ];
    };

    return (
        <TouchableOpacity
            style={getContainerStyle()}
            disabled={isDisabled}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, busy: isLoading }}
            accessibilityLabel={label}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator
                    color={variant === 'primary' || variant === 'danger' ? colors.white : colors.deepNavy}
                />
            ) : (
                <>
                    {leftIcon}
                    <Text style={getTextStyle()}>{label}</Text>
                    {rightIcon}
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radii.button,
        minHeight: MIN_TOUCH_TARGET,
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
    },
    // Sizes
    size_sm: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        minHeight: 36,
    },
    size_md: {
        paddingVertical: spacing.sm,
    },
    size_lg: {
        paddingVertical: spacing.md,
    },
    // Variants (Container)
    variant_primary: {
        backgroundColor: colors.deepNavy,
    },
    variant_secondary: {
        backgroundColor: colors.softBlue,
    },
    variant_outline: {
        backgroundColor: colors.transparent,
        borderWidth: 1.5,
        borderColor: colors.deepNavy,
    },
    variant_ghost: {
        backgroundColor: colors.transparent,
    },
    variant_danger: {
        backgroundColor: colors.crisisRed,
    },

    disabled: {
        opacity: 0.5,
    },

    // Text
    text: {
        ...typography.sansSemiBold,
        fontSize: fontSizes.base,
        textAlign: 'center',
    },

    // Variants (Text)
    text_primary: {
        color: colors.white,
    },
    text_secondary: {
        color: colors.deepNavy,
    },
    text_outline: {
        color: colors.deepNavy,
    },
    text_ghost: {
        color: colors.deepNavy,
    },
    text_danger: {
        color: colors.white,
    },
    textDisabled: {
        // We already lower opacity on the container
    },
});
