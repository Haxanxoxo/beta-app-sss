import { Stack } from 'expo-router';
import { colors } from '../../constants/tokens';

export default function CheckInLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // We'll build custom headers for close actions
                contentStyle: { backgroundColor: colors.mainBackground },
                animation: 'slide_from_right'
            }}
        />
    );
}
