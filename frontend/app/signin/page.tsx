"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            router.push("/profile");
        } else {
            setError(result.error || "Login failed");
        }
        setIsLoading(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Organization Sign In</span>
                    </h1>
                    <p className="mt-3 text-gray-600">Sign in to manage your charity events</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                    <div className="p-8">
                        {/* Info Box */}
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-blue-800 font-medium">For Organizations Only</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        This login is only for organizations that have been invited to add charity events.
                                        Regular users can browse events without signing in.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl p-4 font-semibold hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Have an invite link?{" "}
                            <Link href="/register" className="text-rose-500 hover:text-rose-600 font-medium">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
