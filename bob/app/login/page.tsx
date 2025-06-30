'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthCheck from '../components/AuthCheck';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleLogin = async () => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            router.push('/');
        } else {
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <AuthCheck />
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="username">
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleLogin();
                                }
                            }}
                        />
                    </div>
                </div>
                <Button
                    onClick={handleLogin}
                    className="mt-6 w-full cursor-pointer"
                >
                    Login
                </Button>
            </div>
        </div>
    );
}
