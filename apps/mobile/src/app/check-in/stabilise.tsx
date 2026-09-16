import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResetEngine } from '../../store/resetEngine';
import { colors, spacing, typography, fontSizes, radii } from '../../constants/tokens';
import { Button, SectionHeader, Input } from '../../components';
import { PRESET_STABILISE_STRATEGIES } from '@config/index';

export default function StabiliseScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { markStabiliseAttempted, markStabiliseCompleted, stabiliseAttempts } = useResetEngine();

    const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

    const toggleStrategy = (id: string) => {
        setSelectedStrategy(prev => prev === id ? null : id);
        if (id) {
            try {
                markStabiliseAttempted(id, false);
            } catch (_) { /* ignore duplicate errors */ }
        }
    };

    const handleTryThis = (id: string) => {
        try {
            markStabiliseCompleted(id);
        } catch (_) { /* ignore duplicate errors */ }
    };

    const hasCompletedOne = stabiliseAttempts.some(a => a.completedAt != null);

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.xl), paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.stageLabel}>STABILISE</Text>
                    <Button label="Get Help" variant="ghost" size="sm" onPress={() => router.push('/(tabs)/support')} />
                </View>

                <SectionHeader
                    title="Choose one thing to try."
                    subtitle="There is no perfect choice. Pick what feels most possible right now."
                />

                <View style={styles.strategiesList}>
                    {PRESET_STABILISE_STRATEGIES.map(strat => {
                        const isSelected = selectedStrategy === strat.id;
                        const isDone = stabiliseAttempts.find(a => a.strategy === strat.id)?.completedAt != null;

                        return (
                            <View key={strat.id} style={styles.cardContainer}>
                                <TouchableOpacity
                                    style={[styles.strategyHeader, isSelected && styles.strategyHeaderSelected, isDone && styles.strategyHeaderDone]}
                                    onPress={() => toggleStrategy(strat.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.strategyTitle, isSelected && styles.strategyTitleSelected]}>
                                        {strat.label}
                                    </Text>
                                    {isDone && <Text style={styles.doneLabel}>DONE</Text>}
                                </TouchableOpacity>

                                {isSelected && (
                                    <View style={styles.detailArea}>
                                        <Text style={styles.detailTitle}>{strat.label}</Text>
                                        <Text style={styles.detailDescription}>{strat.description}</Text>

                                        <Button
                                            label="I've tried this"
                                            onPress={() => handleTryThis(strat.id)}
                                            variant={isDone ? 'outline' : 'primary'}
                                            style={styles.tryButton}
                                        />
                                    </View>
                                )}
                            </View>
                        )
                    })}
                </View>

                <View style={styles.customSection}>
                    <Input label="MY OWN STRATEGY 1" placeholder="Add something that works for me..." />
                    <Input label="MY OWN STRATEGY 2" placeholder="Add another strategy..." />
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button
                    label="Check in again"
                    onPress={() => router.push('/check-in/follow-up')}
                    style={styles.continueButton}
                    disabled={!hasCompletedOne}
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
        color: colors.stabiliseBlue,
    },
    strategiesList: {
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    cardContainer: {
        borderRadius: radii.card,
        backgroundColor: colors.white,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.softBorder,
    },
    strategyHeader: {
        padding: spacing.xl,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    strategyHeaderSelected: {
        backgroundColor: colors.softBlue,
        borderBottomWidth: 1,
        borderBottomColor: colors.softBorder,
    },
    strategyHeaderDone: {
        backgroundColor: colors.softBlue,
    },
    strategyTitle: {
        ...typography.sansSemiBold,
        fontSize: fontSizes.lg,
        color: colors.primaryText,
    },
    strategyTitleSelected: {
        color: colors.deepNavy,
    },
    doneLabel: {
        ...typography.sansBold,
        fontSize: fontSizes.xs,
        color: colors.stabiliseBlue,
        letterSpacing: 1,
    },
    detailArea: {
        padding: spacing.xl,
        backgroundColor: colors.white,
    },
    detailTitle: {
        ...typography.sansBold,
        fontSize: fontSizes.sm,
        color: colors.secondaryText,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
    },
    detailDescription: {
        ...typography.serifMedium,
        fontSize: fontSizes.xl,
        color: colors.deepNavy,
        lineHeight: 28,
        marginBottom: spacing.xl,
    },
    tryButton: {
        alignSelf: 'stretch',
    },
    customSection: {
        marginTop: spacing.md,
    },
    footer: {
        padding: spacing.xl,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.softBorder,
    },
    continueButton: {
        width: '100%',
    }
});
