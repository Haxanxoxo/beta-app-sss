import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, type TextInputProps } from 'react-native';
import { colors, spacing, radii, typography, fontSizes, MIN_TOUCH_TARGET } from '../constants/tokens';

export interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    isTextArea?: boolean;
}

export function Input({
    label,
    error,
    isTextArea = false,
    style,
    onFocus,
    onBlur,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text nativeID="inputLabel" style={styles.label}>{label}</Text>}

            <TextInput
                style={[
                    styles.input,
                    isTextArea && styles.textArea,
                    isFocused && styles.focused,
                    !!error && styles.error,
                    style,
                ]}
                placeholderTextColor={colors.secondaryText}
                multiline={isTextArea}
                numberOfLines={isTextArea ? 4 : 1}
                onFocus={(e) => {
                    setIsFocused(true);
                    onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    onBlur?.(e);
                }}
                accessible={true}
                accessibilityLabel={label || props.placeholder}
                accessibilityHint={error}
                aria-invalid={!!error}
                accessibilityState={{ disabled: props.editable === false }}
                accessibilityLabelledBy={label ? "inputLabel" : undefined}
                {...props}
            />

            {error && <Text nativeID="inputError" style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.base,
    },
    label: {
        ...typography.sansMedium,
        fontSize: fontSizes.sm,
        color: colors.primaryText,
        marginBottom: spacing.xs,
    },
    input: {
        ...typography.sans,
        fontSize: fontSizes.base,
        color: colors.primaryText,
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.softBorder,
        borderRadius: radii.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        minHeight: MIN_TOUCH_TARGET,
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    focused: {
        borderColor: colors.deepNavy,
    },
    error: {
        borderColor: colors.error,
    },
    errorText: {
        ...typography.sans,
        fontSize: fontSizes.sm,
        color: colors.error,
        marginTop: spacing.xs,
    },
});
