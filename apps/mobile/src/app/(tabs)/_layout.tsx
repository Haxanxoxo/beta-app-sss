import { Tabs } from 'expo-router';
import { colors, typography, fontSizes } from '../../constants/tokens';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.deepNavy,
                tabBarInactiveTintColor: colors.secondaryText,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopColor: colors.softBorder,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    ...typography.sansMedium,
                    fontSize: fontSizes.xs,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="reset"
                options={{
                    title: 'Reset',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'sync' : 'sync-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="plan"
                options={{
                    title: 'My Plan',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'clipboard' : 'clipboard-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="support"
                options={{
                    title: 'Support',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
