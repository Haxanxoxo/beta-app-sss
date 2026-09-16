import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResetEngine } from '../../store/resetEngine';
import { colors, spacing, typography, fontSizes, radii } from '../../constants/tokens';
import { Button, SectionHeader } from '../../components';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    const router = useRouter();
    const { currentSession, startNewSession } = useResetEngine();
    const insets = useSafeAreaInsets();

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
            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, spacing.xl), paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
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

                {/* Primary Action (Interactive Surface) */}
                <Pressable onPress={handleResetPress} style={styles.primarySurface}>
                    <View style={styles.primaryContent}>
                        <View style={styles.primaryTextGroup}>
                            <Text style={styles.primaryTitle}>
                                {currentSession && currentSession.status !== 'COMPLETED' ? "Continue my reset" : "I need help resetting"}
                            </Text>
                            <Text style={styles.primarySubtitle}>Check in and choose a support</Text>
                        </View>
                        <View style={styles.primaryIconContainer}>
                            <Ionicons name="arrow-forward" size={24} color={colors.deepNavy} />
                        </View>
                    </View>
                </Pressable>

                {/* Secondary Destinations (Interactive Rows) */}
                <View style={styles.secondarySection}>
                    <Pressable onPress={() => router.push('/(tabs)/plan')} style={styles.navRow}>
                        <View style={styles.navRowIcon}>
                            <Ionicons name="clipboard-outline" size={24} color={colors.deepNavy} />
                        </View>
                        <View style={styles.navRowContent}>
                            <Text style={styles.navRowTitle}>My Personal Reset Plan</Text>
                            <Text style={styles.navRowSubtitle}>My signs, choices and supports</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
                    </Pressable>

                    <Pressable onPress={() => router.push('/(tabs)/support')} style={styles.navRow}>
                        <View style={styles.navRowIcon}>
                            <Ionicons name="people-outline" size={24} color={colors.deepNavy} />
                        </View>
                        <View style={styles.navRowContent}>
                            <Text style={styles.navRowTitle}>My Support People</Text>
                            <Text style={styles.navRowSubtitle}>Connect with someone safe</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
                    </Pressable>
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
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing['3xl'],
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
    primarySurface: {
        backgroundColor: colors.deepNavy,
        borderRadius: radii.card,
        padding: spacing.xl,
        marginBottom: spacing.xl,
        overflow: 'hidden',
    },
    primaryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    primaryTextGroup: {
        flex: 1,
        paddingRight: spacing.md,
    },
    primaryTitle: {
        ...typography.serifMedium,
        fontSize: fontSizes['2xl'],
        color: colors.white,
        marginBottom: spacing.xs,
    },
    primarySubtitle: {
        ...typography.sans,
        fontSize: fontSizes.base,
        color: colors.softBlue,
    },
    primaryIconContainer: {
        width: 44,
        height: 44,
        borderRadius: radii.full,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondarySection: {
        backgroundColor: colors.white,
        borderRadius: radii.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.softBorder,
        marginBottom: spacing.xl,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.mainBackground,
    },
    navRowIcon: {
        width: 44,
        height: 44,
        borderRadius: radii.button,
        backgroundColor: colors.softBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    navRowContent: {
        flex: 1,
    },
    navRowTitle: {
        ...typography.sansSemiBold,
        fontSize: fontSizes.base,
        color: colors.deepNavy,
        marginBottom: 2,
    },
    navRowSubtitle: {
        ...typography.sans,
        fontSize: fontSizes.sm,
        color: colors.secondaryText,
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        paddingTop: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.softBorder,
    }
});
