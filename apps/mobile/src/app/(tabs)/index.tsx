import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useResetEngine } from '../../store/resetEngine';
import { colors, spacing, typography, fontSizes } from '../../constants/tokens';
import { Button, SectionHeader, Card } from '../../components';

export default function HomeScreen() {
    const router = useRouter();
    const { currentSession, startNewSession } = useResetEngine();

    const handleResetPress = () => {
        if (currentSession && currentSession.status !== 'COMPLETED') {
            router.push('/check-in'); // Resume session
        } else {
            startNewSession();
            router.push('/check-in'); // Start new session
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.brandTitle}>SSS RESET KIT</Text>
                    <Button
                        variant="ghost"
                        label="Get help"
                        onPress={() => router.push('/(tabs)/support')}
                        labelStyle={styles.getHelpText}
                    />
                </View>

                <SectionHeader
                    title="What would help?"
                    subtitle="You are in control. Choose what feels useful. There is no wrong place to begin."
                    align="left"
                />

                {/* Primary Action */}
                <Card noPadding style={styles.primaryCard}>
                    <View style={styles.cardPadding}>
                        <Text style={styles.cardTitle}>
                            {currentSession && currentSession.status !== 'COMPLETED' ? "Continue my reset" : "I need help resetting"}
                        </Text>
                        <Text style={styles.cardSubtitle}>Check in and choose a support</Text>
                        <Button
                            label="Check in"
                            onPress={handleResetPress}
                            style={styles.primaryButton}
                            labelStyle={styles.primaryButtonText}
                        />
                    </View>
                </Card>

                {/* Secondary Destinations */}
                <View style={styles.rowCards}>
                    <Card style={styles.secondaryCard}>
                        <Text style={styles.secondaryTitle}>My Personal Reset Plan</Text>
                        <Text style={styles.secondarySubtitle}>My signs, choices and supports</Text>
                        <Button
                            label="View Plan"
                            variant="outline"
                            size="sm"
                            onPress={() => router.push('/(tabs)/plan')}
                            style={styles.secondaryButton}
                        />
                    </Card>

                    <Card style={styles.secondaryCard}>
                        <Text style={styles.secondaryTitle}>My Support People</Text>
                        <Text style={styles.secondarySubtitle}>Connect with someone safe</Text>
                        <Button
                            label="Get Support"
                            variant="outline"
                            size="sm"
                            onPress={() => router.push('/(tabs)/support')}
                            style={styles.secondaryButton}
                        />
                    </Card>
                </View>

                {/* Staff Guidance / Auth Controls (Development) */}
                <View style={styles.footerLinks}>
                    <Button
                        label="Staff Guidance"
                        variant="ghost"
                        size="sm"
                        onPress={() => router.push('/staff-guidance')}
                    />
                    <Button
                        label="Sign out"
                        variant="ghost"
                        size="sm"
                        onPress={() => router.replace('/auth')}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBackground,
    },
    scrollContent: {
        padding: spacing.xl,
        paddingTop: spacing['3xl'], // Safe area approx
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    brandTitle: {
        ...typography.sansBold,
        fontSize: fontSizes.lg,
        color: colors.deepNavy,
        letterSpacing: 2,
    },
    getHelpText: {
        color: colors.stepForwardCoral,
    },
    primaryCard: {
        backgroundColor: colors.deepNavy,
        marginBottom: spacing.xl,
    },
    cardPadding: {
        padding: spacing.xl,
        paddingVertical: spacing['2xl'],
    },
    cardTitle: {
        ...typography.serifMedium,
        fontSize: fontSizes['2xl'],
        color: colors.white,
        marginBottom: spacing.xs,
    },
    cardSubtitle: {
        ...typography.sans,
        fontSize: fontSizes.base,
        color: colors.softBlue,
        marginBottom: spacing.xl,
    },
    primaryButton: {
        backgroundColor: colors.white,
    },
    primaryButtonText: {
        color: colors.deepNavy,
    },
    rowCards: {
        gap: spacing.base,
        marginBottom: spacing.xl,
    },
    secondaryCard: {
        marginBottom: spacing.sm,
    },
    secondaryTitle: {
        ...typography.sansSemiBold,
        fontSize: fontSizes.lg,
        color: colors.deepNavy,
        marginBottom: spacing.xs,
    },
    secondarySubtitle: {
        ...typography.sans,
        fontSize: fontSizes.sm,
        color: colors.secondaryText,
        marginBottom: spacing.lg,
    },
    secondaryButton: {
        alignSelf: 'flex-start',
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xl,
        paddingTop: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.softBorder,
    }
});
