import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';

export function LoginScreen({ onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        const result = await login(email, password);
        if (result.success) {
            toast.success('Başarıyla giriş yapıldı.');
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    return (
        <AuthLayout
            title="Tekrar Hoşgeldin!"
            subtitle="Devam etmek için giriş yap."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="login-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        E-posta Adresi
                    </label>
                    <input
                        id="login-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="ornek@email.com"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="login-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Şifre
                    </label>
                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                    />
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Giriş Yap
                </Button>

                <div className="text-center mt-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Hesabın yok mu?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Kayıt Ol
                        </button>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
