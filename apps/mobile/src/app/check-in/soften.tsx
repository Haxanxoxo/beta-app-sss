import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResetEngine } from '../../store/resetEngine';
import { colors, spacing, typography, fontSizes, radii } from '../../constants/tokens';
import { Button, SectionHeader, Input } from '../../components';
import { PRESET_SOFTEN_OPTIONS } from '@config/index';

export default function SoftenScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { markSoftenComplete, currentSession } = useResetEngine();

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [custom1, setCustom1] = useState('');
    const [custom2, setCustom2] = useState('');

    const toggleOption = (id: string) => {
        setSelectedOptions(prev =>
            prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
        );
    };

    const handleContinue = () => {
        const sessionId = currentSession?.id || 'unknown';
        const selections = selectedOptions.map(opt => ({
            id: `temp_${Date.now()}_${opt}`,
            sessionId: sessionId,
            option: opt,
            isCustom: false,
            createdAt: new Date().toISOString(),
        }));

        if (custom1.trim() !== '') {
            selections.push({
                id: `temp_c1_${Date.now()}`, sessionId: sessionId, option: custom1.trim(), isCustom: true, createdAt: new Date().toISOString()
            });
        }
        if (custom2.trim() !== '') {
            selections.push({
                id: `temp_c2_${Date.now()}`, sessionId: sessionId, option: custom2.trim(), isCustom: true, createdAt: new Date().toISOString()
            });
        }

        markSoftenComplete(selections);
        router.push('/check-in/stabilise');
    };

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.xl), paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.stageLabel}>SOFTEN</Text>
                    <Button label="Get Help" variant="ghost" size="sm" onPress={() => router.push('/(tabs)/support')} />
                </View>

                <SectionHeader
                    title="This feeling makes sense."
                    subtitle="You do not need to fight it or explain it. Let's make this moment a little gentler."
                />

                <View style={styles.promptBox}>
                    <Text style={styles.promptIntro}>Try saying to yourself:</Text>
                    <Text style={styles.promptText}>"This is hard right now. I can take one small step at a time."</Text>
                </View>

                <Text style={styles.question}>What might feel supportive?</Text>

                <View style={styles.optionsList}>
                    {PRESET_SOFTEN_OPTIONS.map(opt => {
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
                        label="MY OWN SUPPORT 1"
                        placeholder="What else might help?"
                        value={custom1}
                        onChangeText={setCustom1}
                    />
                    <Input
                        label="MY OWN SUPPORT 2"
                        placeholder="Add another support..."
                        value={custom2}
                        onChangeText={setCustom2}
                    />
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button
                    label="I'm ready to stabilise"
                    onPress={handleContinue}
                    style={styles.continueButton}
                />
                <Button
                    label="I need someone now"
                    variant="outline"
                    onPress={() => router.push('/(tabs)/support')}
                    style={styles.urgentButton}
                />
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
        color: colors.softenTeal,
    },
    promptBox: {
        backgroundColor: colors.softTeal,
        padding: spacing.xl,
        borderRadius: radii.card,
        marginBottom: spacing['2xl'],
    },
    promptIntro: {
        ...typography.sansMedium,
        fontSize: fontSizes.sm,
        color: colors.deepNavy,
        marginBottom: spacing.xs,
    },
    promptText: {
        ...typography.serifMedium,
        fontSize: fontSizes.lg,
        color: colors.deepNavy,
        lineHeight: 28,
    },
    question: {
        ...typography.serifMedium,
        fontSize: fontSizes.xl,
        color: colors.primaryText,
        marginBottom: spacing.lg,
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
        backgroundColor: colors.softenTeal,
        borderColor: colors.softenTeal,
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
        gap: spacing.md,
    },
    continueButton: {
        width: '100%',
    },
    urgentButton: {
        width: '100%',
        borderColor: colors.softBorder,
    }
});
