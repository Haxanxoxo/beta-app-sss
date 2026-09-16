import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResetEngine } from '../../store/resetEngine';
import { colors, spacing, typography, fontSizes, radii } from '../../constants/tokens';
import { Button, SectionHeader, Card, Input, SudsResetCurve } from '../../components';
import { getSudsCategory, CATEGORY_GUIDANCE } from '@config/index';



export default function InitialCheckInScreen() {
    const router = useRouter();
    const { currentSudsValue, setSudsValue, selectedSensations, addSensations, submitInitialCheckIn, currentSession } = useResetEngine();
    const insets = useSafeAreaInsets();

    const [sensationInput, setSensationInput] = useState('');

    const handleContinue = () => {
        // Add pending sensation if any
        if (sensationInput.trim() !== '') {
            addSensations([...selectedSensations, sensationInput.trim()]);
        }
        submitInitialCheckIn();

        // Route based on category
        const category = getSudsCategory(currentSudsValue);
        if (category === 'CALM') {
            router.push('/check-in/step-forward');
        } else if (category === 'RISING') {
            router.push('/check-in/soften');
        } else if (category === 'HIGH') {
            router.push('/check-in/stabilise');
        } else if (category === 'CRISIS') {
            // Create DistressAlert under the hood (simulated in store/backend)
            router.push('/(tabs)/support'); // Or to a specific crisis view
        }
    };

    const guidance = CATEGORY_GUIDANCE[getSudsCategory(currentSudsValue)];

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.xl), paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.stageLabel}>CHECK IN</Text>
                    <Button label="Close" variant="ghost" size="sm" onPress={() => router.push('/(tabs)')} />
                </View>

                <SectionHeader
                    title="How strong is it right now?"
                    subtitle="Choose the number that feels closest. It does not need to be exact."
                />

                <Card noPadding style={styles.graphCard}>
                    <SudsResetCurve value={currentSudsValue} onValueChange={setSudsValue} />

                    <View style={styles.graphInfo}>
                        <Text style={styles.guidanceTitle}>{guidance.recommendationHeading}</Text>
                        <Text style={styles.guidanceDescription}>{guidance.recommendation}</Text>
                        <View style={styles.tags}>
                            {guidance.guidanceLabels.map(label => (
                                <View key={label} style={styles.tag}>
                                    <Text style={styles.tagText}>{label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </Card>

                <View style={styles.bodySensations}>
                    <Text style={styles.sensationsTitle}>Body sensations</Text>
                    <Input
                        placeholder="Add sensations..."
                        value={sensationInput}
                        onChangeText={setSensationInput}
                    />
                    <View style={styles.tagRow}>
                        {selectedSensations.map((sens, idx) => (
                            <View key={idx} style={styles.tag}>
                                <Text style={styles.tagText}>{sens}</Text>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerInfo}>
                    <Text style={styles.footerScore}>{currentSudsValue}</Text>
                    <View>
                        <Text style={[styles.footerCategory, { color: colors.primaryText }]}>{guidance.label}</Text>
                        <Text style={styles.footerExplanation}>{guidance.explanation}</Text>
                    </View>
                </View>

                <Button
                    label={guidance.primaryActionLabel}
                    onPress={handleContinue}
                    style={styles.continueButton}
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
        color: colors.secondaryText,
    },
    graphCard: {
        marginBottom: spacing.xl,
        overflow: 'hidden',
    },

    graphInfo: {
        padding: spacing.xl,
        backgroundColor: colors.warmSurface,
    },
    guidanceTitle: {
        ...typography.sansBold,
        fontSize: fontSizes.sm,
        color: colors.deepNavy,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.xs,
    },
    guidanceDescription: {
        ...typography.sans,
        fontSize: fontSizes.base,
        color: colors.secondaryText,
        marginBottom: spacing.md,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    tag: {
        backgroundColor: colors.softTeal,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xxs,
        borderRadius: radii.full,
    },
    tagText: {
        ...typography.sansMedium,
        fontSize: fontSizes.xs,
        color: colors.softenTeal,
    },
    bodySensations: {
        marginBottom: spacing.xl,
    },
    sensationsTitle: {
        ...typography.sansMedium,
        fontSize: fontSizes.sm,
        color: colors.primaryText,
        marginBottom: spacing.sm,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    footer: {
        padding: spacing.xl,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.softBorder,
    },
    footerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    footerScore: {
        ...typography.serifBold,
        fontSize: 48,
        color: colors.primaryText,
        marginRight: spacing.lg,
    },
    footerCategory: {
        ...typography.sansBold,
        fontSize: fontSizes.xs,
        letterSpacing: 1,
        marginBottom: 4,
    },
    footerExplanation: {
        ...typography.sans,
        fontSize: fontSizes.sm,
        color: colors.secondaryText,
        paddingRight: 60, // accommodate the big number
    },
    continueButton: {
        width: '100%',
    }
});
