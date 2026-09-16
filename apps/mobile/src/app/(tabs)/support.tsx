import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import { SectionHeader, Button, Card, EmptyState } from '../../components';
import { colors, spacing, typography, fontSizes } from '../../constants/tokens';
import { EMERGENCY_CONTACTS } from '@config/emergencyContacts';

export default function SupportScreen() {
    // In a real app we load this from the backend / zustand store.
    // Using static mock data for layout purposes.
    const mockContacts = [
        { type: 'TRUSTED_PERSON', name: 'Mum', phone: '0400000000' },
        { type: 'WORKER', name: 'Sam (On-call team)', phone: '0200000000' }
    ];

    const handleCall = async (phone: string) => {
        const url = `tel:${phone}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Error', 'Calling is not supported on this device');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerLabel}>SAFETY FIRST</Text>

            <SectionHeader
                title="You do not have to manage this alone."
                subtitle="Choose a trusted person from your plan or ask a worker to stay nearby."
            />

            <Card style={styles.card}>
                <SectionHeader title="My Trusted Support" align="left" style={{ marginBottom: spacing.md }} />

                {mockContacts.length === 0 ? (
                    <EmptyState
                        title="No support contacts"
                        message="Add someone to your plan so they appear here."
                        actionLabel="Add someone to my plan"
                        onAction={() => {/* navigate to plan */ }}
                    />
                ) : (
                    <View style={styles.contactList}>
                        {mockContacts.map((contact, idx) => (
                            <View key={idx} style={styles.contactRow}>
                                <View style={styles.contactDetails}>
                                    <Text style={styles.contactName}>{contact.name}</Text>
                                    <Text style={styles.contactType}>{contact.type === 'TRUSTED_PERSON' ? 'Trusted person' : 'Worker / On-call'}</Text>
                                </View>
                                <Button
                                    label="Call"
                                    variant="outline"
                                    onPress={() => handleCall(contact.phone)}
                                />
                            </View>
                        ))}
                    </View>
                )}
            </Card>

            <View style={styles.emergencySection}>
                <SectionHeader title="Need urgent help?" align="left" />

                <View style={styles.emergencyList}>
                    {EMERGENCY_CONTACTS.map((contact) => (
                        <Button
                            key={contact.id}
                            label={contact.label}
                            variant={contact.isCrisis ? 'danger' : 'secondary'}
                            onPress={() => handleCall(contact.phone)}
                            style={styles.emergencyButton}
                        />
                    ))}
                </View>
            </View>

        </ScrollView>
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
        paddingBottom: spacing['4xl'],
    },
    headerLabel: {
        ...typography.sansBold,
        fontSize: fontSizes.xs,
        color: colors.crisisRed, // Explicitly safe color for this
        letterSpacing: 2,
        marginBottom: spacing.xs,
    },
    card: {
        marginBottom: spacing['2xl'],
    },
    contactList: {
        gap: spacing.lg,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.softBorder,
    },
    contactDetails: {
        flex: 1,
    },
    contactName: {
        ...typography.sansSemiBold,
        fontSize: fontSizes.lg,
        color: colors.primaryText,
        marginBottom: 2,
    },
    contactType: {
        ...typography.sans,
        fontSize: fontSizes.sm,
        color: colors.secondaryText,
    },
    emergencySection: {
        marginTop: spacing.md,
    },
    emergencyList: {
        gap: spacing.md,
    },
    emergencyButton: {
        justifyContent: 'center',
    }
});
