import React from 'react';

export function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] p-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 transition-all duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
                        TaskFlow
                    </h1>
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                        {title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {subtitle}
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}
