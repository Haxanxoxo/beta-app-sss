import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SectionHeader, Input, Button, Card } from '../../components';
import { colors, spacing } from '../../constants/tokens';

export default function PlanScreen() {
    const [isEditing, setIsEditing] = useState(false);

    // Todo: Connect to backend. Using local state for now.
    const [plan, setPlan] = useState({
        earlyWarningSigns: '',
        triggers: '',
        thingsThatMakeItWorse: '',
        helpfulWords: '',
        preferredSupports: '',
        trustedPersonName: '',
        trustedPersonPhone: '',
        workerName: '',
        workerPhone: ''
    });

    const handleSave = () => {
        // 1. Save to Supabase (TODO)
        // 2. Change state
        setIsEditing(false);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <SectionHeader
                title="My Personal Reset Plan"
                subtitle="This plan belongs to me. It records what helps and what does not."
            />

            <Card style={styles.card}>
                <Input
                    label="MY EARLY WARNING SIGNS"
                    placeholder="e.g. going quiet, racing thoughts, tight shoulders"
                    value={plan.earlyWarningSigns}
                    onChangeText={t => setPlan({ ...plan, earlyWarningSigns: t })}
                    isTextArea
                    editable={isEditing}
                />
                <Input
                    label="THINGS THAT CAN TRIGGER ME"
                    placeholder="What might start or increase the distress?"
                    value={plan.triggers}
                    onChangeText={t => setPlan({ ...plan, triggers: t })}
                    isTextArea
                    editable={isEditing}
                />
                <Input
                    label="WHAT MAKES THINGS WORSE"
                    placeholder="Words, actions, noise, questions or demands to avoid"
                    value={plan.thingsThatMakeItWorse}
                    onChangeText={t => setPlan({ ...plan, thingsThatMakeItWorse: t })}
                    isTextArea
                    editable={isEditing}
                />
                <Input
                    label="WORDS THAT HELP ME"
                    placeholder="What would I like a trusted person to say?"
                    value={plan.helpfulWords}
                    onChangeText={t => setPlan({ ...plan, helpfulWords: t })}
                    isTextArea
                    editable={isEditing}
                />
                <Input
                    label="MY PREFERRED SUPPORTS"
                    placeholder="People, places, sensory tools and cultural supports"
                    value={plan.preferredSupports}
                    onChangeText={t => setPlan({ ...plan, preferredSupports: t })}
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
                    value={plan.trustedPersonName}
                    onChangeText={t => setPlan({ ...plan, trustedPersonName: t })}
                    editable={isEditing}
                />
                <Input
                    label="Phone number"
                    placeholder="e.g. 0400 000 000"
                    keyboardType="phone-pad"
                    value={plan.trustedPersonPhone}
                    onChangeText={t => setPlan({ ...plan, trustedPersonPhone: t })}
                    editable={isEditing}
                />

                <SectionHeader title="Worker / On Call Support" subtitle="" style={{ marginTop: spacing.xl, marginBottom: spacing.md }} />
                <Input
                    label="Name or service"
                    placeholder="e.g. Sam, On-call team"
                    value={plan.workerName}
                    onChangeText={t => setPlan({ ...plan, workerName: t })}
                    editable={isEditing}
                />
                <Input
                    label="Phone number"
                    placeholder="e.g. 02 0000 0000"
                    value={plan.workerPhone}
                    keyboardType="phone-pad"
                    onChangeText={t => setPlan({ ...plan, workerPhone: t })}
                    editable={isEditing}
                />
            </Card>

            <View style={styles.footer}>
                {isEditing ? (
                    <Button label="Save my plan" onPress={handleSave} />
                ) : (
                    <Button label="Edit Plan" variant="outline" onPress={() => setIsEditing(true)} />
                )}
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
    card: {
        gap: spacing.base,
    },
    footer: {
        marginTop: spacing['2xl'],
    }
});
