"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    email: string;
    organization_name: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, organizationName: string, inviteToken: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        // Check for existing token on mount
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUser = async (authToken: string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                // Token invalid, clear it
                localStorage.removeItem("auth_token");
                setToken(null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
        setIsLoading(false);
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("auth_token", data.token);
                setToken(data.token);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || "Login failed" };
            }
        } catch (error) {
            return { success: false, error: "Network error" };
        }
    };

    const register = async (email: string, password: string, organizationName: string, inviteToken: string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    organization_name: organizationName,
                    invite_token: inviteToken,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("auth_token", data.token);
                setToken(data.token);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || "Registration failed" };
            }
        } catch (error) {
            return { success: false, error: "Network error" };
        }
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
