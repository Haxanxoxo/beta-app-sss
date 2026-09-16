import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResetEngine } from '../../store/resetEngine';
import { colors, spacing, typography, fontSizes } from '../../constants/tokens';
import { Button, SectionHeader, Card, SudsResetCurve } from '../../components';
import { getSudsCategory, CATEGORY_GUIDANCE } from '@config/index';

export default function FollowUpCheckInScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { currentSudsValue, setSudsValue, submitFollowUpCheckIn, checkIns } = useResetEngine();

    const beforeValue = checkIns[0]?.sudsRating ?? 0.5;
    const guidance = CATEGORY_GUIDANCE[getSudsCategory(currentSudsValue)];

    const handleContinue = () => {
        submitFollowUpCheckIn();

        const category = getSudsCategory(currentSudsValue);
        if (category === 'CALM') {
            router.push('/check-in/step-forward');
        } else if (category === 'RISING') {
            router.push('/check-in/soften');
        } else if (category === 'HIGH') {
            router.push('/check-in/stabilise');
        } else if (category === 'CRISIS') {
            router.push('/(tabs)/support');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.xl), paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.stageLabel}>CHECK AGAIN</Text>
                    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                        <Button label="Get Help" variant="ghost" size="sm" onPress={() => router.push('/(tabs)/support')} />
                        <Button label="Close" variant="ghost" size="sm" onPress={() => router.push('/(tabs)')} />
                    </View>
                </View>

                <SectionHeader
                    title="Where is the feeling now?"
                    subtitle="Choose the number that feels closest. It does not need to be exact."
                />

                <Card noPadding style={styles.graphCard}>
                    <SudsResetCurve
                        value={currentSudsValue}
                        onValueChange={setSudsValue}
                        initialRating={beforeValue}
                        followUpMode={true}
                    />

                    <View style={styles.graphInfo}>
                        <Text style={styles.guidanceTitle}>{guidance.recommendationHeading}</Text>
                        <Text style={styles.guidanceDescription}>{guidance.recommendation}</Text>
                    </View>
                </Card>

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
                    label={getSudsCategory(currentSudsValue) === 'CALM' ? 'Continue to Step Forward' : guidance.primaryActionLabel}
                    onPress={handleContinue}
                    style={styles.continueButton}
                />

                {getSudsCategory(currentSudsValue) === 'RISING' && (
                    <Button
                        label="Continue to Step Forward"
                        variant="ghost"
                        style={{ marginTop: spacing.md }}
                        onPress={() => {
                            submitFollowUpCheckIn();
                            router.push('/check-in/step-forward');
                        }}
                    />
                )}
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
        paddingRight: 60,
    },
    continueButton: {
        width: '100%',
    },
});
