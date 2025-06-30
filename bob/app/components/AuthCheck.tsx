'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCheck() {
    const router = useRouter();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/auth/status', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                router.push('/');
                return;
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
        }

        router.push('/login');
    };

    return null;
} 