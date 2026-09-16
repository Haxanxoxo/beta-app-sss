import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResetEngine } from '../../store/resetEngine';
import { colors, spacing, typography, fontSizes, radii } from '../../constants/tokens';
import { Button, SectionHeader, Input } from '../../components';
import { PRESET_NEXT_STEPS } from '@config/index';

export default function StepForwardScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { submitNextSteps, completeSession, resetEngine, currentSession } = useResetEngine();

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [custom1, setCustom1] = useState('');
    const [custom2, setCustom2] = useState('');

    const toggleOption = (id: string) => {
        setSelectedOptions(prev =>
            prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
        );
    };

    const handleFinish = () => {
        const sessionId = currentSession?.id || 'unknown';
        const steps = selectedOptions.map(opt => ({
            id: `temp_${Date.now()}_${opt}`,
            sessionId: sessionId,
            value: PRESET_NEXT_STEPS.find(s => s.id === opt)?.label || opt,
            isCustom: false,
        }));
        if (custom1.trim() !== '') steps.push({ id: `ts1_${Date.now()}`, sessionId: sessionId, value: custom1, isCustom: true });
        if (custom2.trim() !== '') steps.push({ id: `ts2_${Date.now()}`, sessionId: sessionId, value: custom2, isCustom: true });

        submitNextSteps(steps);
        completeSession();

        Alert.alert(
            "Your reset is saved.",
            "Movement can be small. It still counts.",
            [
                {
                    text: "Return Home", onPress: () => {
                        router.replace('/(tabs)');
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.xl), paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.stageLabel}>STEP FORWARD</Text>
                    <Button label="Get Help" variant="ghost" size="sm" onPress={() => router.push('/(tabs)/support')} />
                </View>

                <SectionHeader
                    title="One small step is enough."
                    subtitle="You do not need to solve everything. What feels manageable next?"
                />

                <View style={styles.optionsList}>
                    {PRESET_NEXT_STEPS.map(opt => {
                        const isSelected = selectedOptions.includes(opt.id);
                        return (
                            <TouchableOpacity
                                key={opt.id}
                                style={[styles.optionButton, isSelected && styles.optionSelected]}
                                onPress={() => toggleOption(opt.id)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <View style={styles.customSection}>
                    <Input
                        label="MY OWN NEXT STEP 1"
                        placeholder="What small step feels right for me?"
                        value={custom1}
                        onChangeText={setCustom1}
                    />
                    <Input
                        label="MY OWN NEXT STEP 2"
                        placeholder="Add another next step..."
                        value={custom2}
                        onChangeText={setCustom2}
                    />
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button
                    label="Finish my reset"
                    onPress={handleFinish}
                    style={styles.continueButton}
                />
                <Text style={styles.subtext}>Movement can be small. It still counts.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBackground,
    },
    content: {
        padding: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    stageLabel: {
        ...typography.sansBold,
        fontSize: fontSizes.sm,
        letterSpacing: 2,
        color: colors.stepForwardCoral,
    },
    optionsList: {
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    optionButton: {
        padding: spacing.lg,
        backgroundColor: colors.white,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: colors.softBorder,
    },
    optionSelected: {
        backgroundColor: colors.stepForwardCoral,
        borderColor: colors.stepForwardCoral,
    },
    optionText: {
        ...typography.sansSemiBold,
        fontSize: fontSizes.base,
        color: colors.primaryText,
    },
    optionTextSelected: {
        color: colors.white,
    },
    customSection: {
        marginTop: spacing.sm,
    },
    footer: {
        padding: spacing.xl,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.softBorder,
        alignItems: 'center',
        gap: spacing.md,
    },
    continueButton: {
        width: '100%',
    },
    subtext: {
        ...typography.sans,
        fontSize: fontSizes.sm,
        color: colors.secondaryText,
    }
});
