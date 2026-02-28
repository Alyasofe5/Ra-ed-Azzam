import React, { useState } from 'react';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
    onLoginSuccess: () => void;
    onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded credentials as requested by the user
        if (username === 'RAED' && password === 'raed182214') {
            setError('');
            onLoginSuccess();
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-4 h-screen w-screen">
            <button
                onClick={onBack}
                className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Site
            </button>

            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-fade-in-up">
                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none z-0"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 mb-8">
                        <Lock className="w-8 h-8 text-indigo-500" />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Admin Access</h2>
                    <p className="text-zinc-500 mb-8 text-center text-sm">Please authenticate to continue.</p>

                    <form onSubmit={handleLogin} className="w-full space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center font-medium animate-pulse">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 mt-4 bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all group"
                        >
                            Sign In
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
