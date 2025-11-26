import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';

export function RegisterScreen({ onSwitchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor.');
            return;
        }

        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalı.');
            return;
        }

        const result = await register(name, email, password);
        if (result.success) {
            toast.success('Kayıt başarıyla oluşturuldu! Giriş yapabilirsiniz.');
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    return (
        <AuthLayout
            title="Aramıza Katıl"
            subtitle="Hemen ücretsiz hesabını oluştur."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="register-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Ad Soyad
                    </label>
                    <input
                        id="register-name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Adınız Soyadınız"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        E-posta Adresi
                    </label>
                    <input
                        id="register-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="ornek@email.com"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Şifre
                    </label>
                    <input
                        id="register-password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="register-confirm-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Şifre Tekrar
                    </label>
                    <input
                        id="register-confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                    />
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Kayıt Ol
                </Button>

                <div className="text-center mt-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Zaten hesabın var mı?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Giriş Yap
                        </button>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
