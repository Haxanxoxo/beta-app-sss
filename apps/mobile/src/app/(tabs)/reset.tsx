import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useResetEngine } from '../../store/resetEngine';
import { View } from 'react-native';

export default function ResetRedirectScreen() {
    const router = useRouter();
    const { currentSession, startNewSession } = useResetEngine();

    useEffect(() => {
        // Basic redirect logic. If we have an active session, continue it, else start new.
        if (currentSession && currentSession.status !== 'COMPLETED') {
            router.replace('/check-in');
        } else {
            startNewSession();
            router.replace('/check-in');
        }
    }, [currentSession, startNewSession, router]);

    return <View style={{ flex: 1, backgroundColor: '#F7FAF9' }} />;
}
