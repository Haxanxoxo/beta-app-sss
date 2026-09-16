import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SectionHeader, EmptyState, Button } from '../components';
import { colors, spacing } from '../constants/tokens';
import { useRouter } from 'expo-router';
// import { STAFF_GUIDANCE_SECTIONS } from '@config/index';

export default function StaffGuidanceScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <SectionHeader
                    title="Staff Guidance"
                    subtitle="Clinical instructions and protocols for workers supporting a reset."
                />

                {/* Placeholder as specified "Create restrained placeholder states where approved guidance content is still required." */}
                <EmptyState
                    title="Content Pending"
                    message="Approved clinical guidance for this section has not yet been provided."
                />
            </ScrollView>
            <View style={styles.footer}>
                <Button label="Back" variant="outline" onPress={() => router.back()} />
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
        paddingTop: spacing.xl,
    },
    footer: {
        padding: spacing.xl,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.softBorder,
        paddingBottom: spacing['4xl'], // Safe area
    }
});
