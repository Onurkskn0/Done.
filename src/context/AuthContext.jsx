import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const translateError = (message) => {
        if (message.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.';
        if (message.includes('User already registered')) return 'Bu e-posta adresi zaten kayıtlı.';
        if (message.includes('Password should be at least')) return 'Şifre en az 6 karakter olmalı.';
        if (message.includes('Email not confirmed')) return 'Lütfen e-posta adresinizi doğrulayın.';

        // Rate limit translation
        if (message.includes('For security purposes, you can only request this after')) {
            const seconds = message.match(/\d+/)[0];
            return `Güvenlik nedeniyle, lütfen ${seconds} saniye bekleyip tekrar deneyin.`;
        }

        return message; // Fallback
    };

    const login = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, message: translateError(error.message) };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    },
                },
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, message: translateError(error.message) };
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
