import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SectionHeader, Input, Button, Card } from '../../components';
import { colors, spacing } from '../../constants/tokens';
import { usePlanStore } from '../../store/planStore';

export default function PlanScreen() {
    const insets = useSafeAreaInsets();
    const { plan, hasSavedPlan, savePlan, updatePlan } = usePlanStore();

    // Local editing state — starts from saved plan
    const [draft, setDraft] = useState(plan);
    const [isEditing, setIsEditing] = useState(!hasSavedPlan);

    // Sync draft when plan changes externally (e.g. store rehydration)
    useEffect(() => {
        setDraft(plan);
        setIsEditing(!hasSavedPlan);
    }, [hasSavedPlan]);

    const handleSave = () => {
        savePlan(draft);
        setIsEditing(false);
        Alert.alert('Plan saved', 'Your personal reset plan has been saved.');
    };

    const handleEdit = () => {
        setDraft(plan);
        setIsEditing(true);
    };

    const canSave = isEditing;

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, spacing.xl), paddingBottom: Math.max(insets.bottom, spacing['4xl']) }]}
                keyboardShouldPersistTaps="handled"
            >
                <SectionHeader
                    title="My Personal Reset Plan"
                    subtitle="This plan belongs to me. It records what helps and what does not."
                />

                <Card style={styles.card}>
                    <Input
                        label="MY EARLY WARNING SIGNS"
                        placeholder="e.g. going quiet, racing thoughts, tight shoulders"
                        value={draft.earlyWarningSigns}
                        onChangeText={t => setDraft({ ...draft, earlyWarningSigns: t })}
                        isTextArea
                        editable={isEditing}
                    />
                    <Input
                        label="THINGS THAT CAN TRIGGER ME"
                        placeholder="What might start or increase the distress?"
                        value={draft.triggers}
                        onChangeText={t => setDraft({ ...draft, triggers: t })}
                        isTextArea
                        editable={isEditing}
                    />
                    <Input
                        label="WHAT MAKES THINGS WORSE"
                        placeholder="Words, actions, noise, questions or demands to avoid"
                        value={draft.thingsThatMakeItWorse}
                        onChangeText={t => setDraft({ ...draft, thingsThatMakeItWorse: t })}
                        isTextArea
                        editable={isEditing}
                    />
                    <Input
                        label="WORDS THAT HELP ME"
                        placeholder="What would I like a trusted person to say?"
                        value={draft.helpfulWords}
                        onChangeText={t => setDraft({ ...draft, helpfulWords: t })}
                        isTextArea
                        editable={isEditing}
                    />
                    <Input
                        label="MY PREFERRED SUPPORTS"
                        placeholder="People, places, sensory tools and cultural supports"
                        value={draft.preferredSupports}
                        onChangeText={t => setDraft({ ...draft, preferredSupports: t })}
                        isTextArea
                        editable={isEditing}
                    />
                </Card>

                <SectionHeader
                    title="My support contacts"
                    subtitle="Add the numbers you want the call buttons to use."
                    style={{ marginTop: spacing['2xl'] }}
                />
                <Card style={styles.card}>
                    <SectionHeader title="Trusted Person" subtitle="" style={{ marginBottom: spacing.md }} />
                    <Input
                        label="Name"
                        placeholder="e.g. Mum, Alex"
                        value={draft.trustedPersonName}
                        onChangeText={t => setDraft({ ...draft, trustedPersonName: t })}
                        editable={isEditing}
                    />
                    <Input
                        label="Phone number"
                        placeholder="e.g. 0400 000 000"
                        keyboardType="phone-pad"
                        value={draft.trustedPersonPhone}
                        onChangeText={t => setDraft({ ...draft, trustedPersonPhone: t })}
                        editable={isEditing}
                    />

                    <SectionHeader title="Worker / On Call Support" subtitle="" style={{ marginTop: spacing.xl, marginBottom: spacing.md }} />
                    <Input
                        label="Name or service"
                        placeholder="e.g. Sam, On-call team"
                        value={draft.workerName}
                        onChangeText={t => setDraft({ ...draft, workerName: t })}
                        editable={isEditing}
                    />
                    <Input
                        label="Phone number"
                        placeholder="e.g. 02 0000 0000"
                        value={draft.workerPhone}
                        keyboardType="phone-pad"
                        onChangeText={t => setDraft({ ...draft, workerPhone: t })}
                        editable={isEditing}
                    />
                </Card>

                <View style={styles.footer}>
                    {canSave ? (
                        <Button label="Save my plan" onPress={handleSave} />
                    ) : (
                        <Button label="Edit my plan" variant="outline" onPress={handleEdit} />
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: colors.mainBackground,
    },
    container: {
        flex: 1,
        backgroundColor: colors.mainBackground,
    },
    content: {
        paddingHorizontal: spacing.xl,
    },
    card: {
        gap: spacing.base,
    },
    footer: {
        marginTop: spacing['2xl'],
    }
});
