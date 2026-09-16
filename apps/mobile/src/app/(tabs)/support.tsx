import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SectionHeader, Button, Card, EmptyState } from '../../components';
import { colors, spacing, typography, fontSizes, radii } from '../../constants/tokens';
import { EMERGENCY_CONTACTS, EMERGENCY_CONTACTS_DISPLAY } from '@config/emergencyContacts';
import { usePlanStore } from '../../store/planStore';
import { Ionicons } from '@expo/vector-icons';

export default function SupportScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { plan, hasSavedPlan } = usePlanStore();

    // Build contacts from real plan data
    const contacts: { type: string; name: string; phone: string }[] = [];
    if (plan.trustedPersonName.trim()) {
        contacts.push({
            type: 'TRUSTED_PERSON',
            name: plan.trustedPersonName,
            phone: plan.trustedPersonPhone,
        });
    }
    if (plan.workerName.trim()) {
        contacts.push({
            type: 'WORKER',
            name: plan.workerName,
            phone: plan.workerPhone,
        });
    }

    const handleCall = async (phone: string) => {
        if (!phone.trim()) {
            Alert.alert('No number', 'No phone number has been set for this contact. Add one in your Personal Reset Plan.');
            return;
        }
        const url = `tel:${phone}`;
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Calling is not supported on this device');
            }
        } catch (err) {
            Alert.alert('Error', 'Could not place the call');
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, spacing.xl), paddingBottom: Math.max(insets.bottom, spacing['4xl']) }]}
        >
            <Text style={styles.headerLabel}>SAFETY FIRST</Text>

            <SectionHeader
                title="You do not have to manage this alone."
                subtitle="Choose a trusted person from your plan or ask a worker to stay nearby."
            />

            <Card style={styles.card}>
                <SectionHeader title="My Trusted Support" align="left" style={{ marginBottom: spacing.md }} />

                {contacts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {hasSavedPlan
                                ? "No support contacts have been added to your plan yet."
                                : "Create your Personal Reset Plan to add support contacts."}
                        </Text>
                        <Button
                            label="Add to my plan"
                            variant="outline"
                            size="sm"
                            onPress={() => router.push('/(tabs)/plan')}
                            style={{ alignSelf: 'flex-start', marginTop: spacing.md }}
                        />
                    </View>
                ) : (
                    <View style={styles.contactList}>
                        {contacts.map((contact, idx) => (
                            <View key={idx} style={styles.contactRow}>
                                <View style={styles.contactDetails}>
                                    <Text style={styles.contactName}>{contact.name}</Text>
                                    <Text style={styles.contactType}>{contact.type === 'TRUSTED_PERSON' ? 'Trusted person' : 'Worker / On-call'}</Text>
                                    {contact.phone.trim() ? (
                                        <Text style={styles.contactPhone}>{contact.phone}</Text>
                                    ) : null}
                                </View>
                                <Pressable
                                    style={styles.callButton}
                                    onPress={() => handleCall(contact.phone)}
                                >
                                    <Ionicons name="call-outline" size={20} color={colors.deepNavy} />
                                    <Text style={styles.callText}>Call</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}
            </Card>

            <View style={styles.emergencySection}>
                <SectionHeader title="Need urgent help?" align="left" />

                <View style={styles.emergencyList}>
                    {EMERGENCY_CONTACTS.map((contact) => {
                        const displayPhone = EMERGENCY_CONTACTS_DISPLAY[contact.id] || contact.phone;
                        return (
                            <Pressable
                                key={contact.id}
                                style={[styles.emergencyRow, contact.isCrisis && styles.emergencyRowCrisis]}
                                onPress={() => handleCall(contact.phone)}
                            >
                                <View style={styles.emergencyInfo}>
                                    <Text style={[styles.emergencyName, contact.isCrisis && styles.emergencyNameCrisis]}>
                                        {contact.label}
                                    </Text>
                                    <Text style={[styles.emergencyPhone, contact.isCrisis && styles.emergencyPhoneCrisis]}>
                                        {displayPhone}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="call"
                                    size={20}
                                    color={contact.isCrisis ? colors.crisisRed : colors.deepNavy}
                                />
                            </Pressable>
                        );
                    })}
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
        paddingHorizontal: spacing.xl,
    },
    headerLabel: {
        ...typography.sansBold,
        fontSize: fontSizes.xs,
        color: colors.crisisRed,
        letterSpacing: 2,
        marginBottom: spacing.xs,
    },
    card: {
        marginBottom: spacing['2xl'],
    },
    emptyContainer: {
        paddingVertical: spacing.md,
    },
    emptyText: {
        ...typography.sans,
        fontSize: fontSizes.base,
        color: colors.secondaryText,
        lineHeight: 22,
    },
    contactList: {
        gap: spacing.sm,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
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
    contactPhone: {
        ...typography.sansMedium,
        fontSize: fontSizes.sm,
        color: colors.deepNavy,
        marginTop: 2,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: colors.softBorder,
        backgroundColor: colors.white,
        minHeight: 44,
    },
    callText: {
        ...typography.sansSemiBold,
        fontSize: fontSizes.sm,
        color: colors.deepNavy,
    },
    emergencySection: {
        marginTop: spacing.md,
    },
    emergencyList: {
        gap: spacing.sm,
    },
    emergencyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        backgroundColor: colors.white,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.softBorder,
    },
    emergencyRowCrisis: {
        borderColor: colors.crisisRed + '40',
        backgroundColor: colors.crisisRed + '08',
    },
    emergencyInfo: {
        flex: 1,
    },
    emergencyName: {
        ...typography.sansSemiBold,
        fontSize: fontSizes.base,
        color: colors.deepNavy,
        marginBottom: 2,
    },
    emergencyNameCrisis: {
        color: colors.crisisRed,
    },
    emergencyPhone: {
        ...typography.sansMedium,
        fontSize: fontSizes.lg,
        color: colors.deepNavy,
    },
    emergencyPhoneCrisis: {
        color: colors.crisisRed,
    },
});
