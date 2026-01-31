"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

function RegisterForm() {
    const searchParams = useSearchParams();
    const inviteToken = searchParams.get("token") || "";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);

    const { register } = useAuth();
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        if (inviteToken) {
            validateToken();
        } else {
            setIsValidating(false);
        }
    }, [inviteToken]);

    const validateToken = async () => {
        try {
            const response = await fetch(`${baseUrl}/auth/verify-invite/${inviteToken}`);
            const data = await response.json();

            if (data.valid) {
                setIsValidToken(true);
                setEmail(data.email);
            } else {
                setError("Invalid or expired invite link");
            }
        } catch (err) {
            setError("Failed to verify invite link");
        }
        setIsValidating(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);
        const result = await register(email, password, organizationName, inviteToken);

        if (result.success) {
            router.push("/profile");
        } else {
            setError(result.error || "Registration failed");
        }
        setIsLoading(false);
    };

    if (isValidating) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying invite link...</p>
                </div>
            </main>
        );
    }

    if (!inviteToken || !isValidToken) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Invite Link</h1>
                            <p className="text-gray-600 mb-6">
                                {error || "You need a valid invite link to create an account. Please contact an administrator."}
                            </p>
                            <Link
                                href="/signin"
                                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl px-6 py-3 font-semibold hover:shadow-lg transition"
                            >
                                Go to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Create Account</span>
                    </h1>
                    <p className="mt-3 text-gray-600">Set up your organization account</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">Email is set by your invite</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                                <input
                                    type="text"
                                    value={organizationName}
                                    onChange={(e) => setOrganizationName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                    placeholder="Your organization name"
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
                                    placeholder="At least 8 characters"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                    placeholder="Confirm your password"
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
                                {isLoading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/signin" className="text-rose-500 hover:text-rose-600 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function Register() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
            </main>
        }>
            <RegisterForm />
        </Suspense>
    );
}
