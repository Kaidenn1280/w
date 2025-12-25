import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Address interface
export interface Address {
    street: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
}

// Login history entry interface
export interface LoginHistoryEntry {
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
    device?: string;
}

// User interface matching backend
export interface User {
    id: number;
    fullName: string;
    email: string;
    address?: Address;
    createdAt: string;
    lastLoginAt?: string;
    loginHistory?: LoginHistoryEntry[];
}

// Auth context type
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
}

// Register data interface
interface RegisterData {
    fullName: string;
    email: string;
    password: string;
    address: Address;
}

const API_BASE_URL = "http://localhost:3000";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem("authUser");
            }
        }
        setIsLoading(false);
    }, []);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("authUser", JSON.stringify(user));
        } else {
            localStorage.removeItem("authUser");
        }
    }, [user]);

    // Login function
    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, message: data.message || "Login failed" };
            }

            setUser(data.user);
            return { success: true, message: data.message || "Login successful" };
        } catch (error) {
            // Fallback demo mode for when backend is not running
            console.warn("Backend not available, using demo mode");

            // Demo user for testing
            const demoUser: User = {
                id: 1,
                fullName: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                email: email,
                address: {
                    street: "123 Demo Street",
                    city: "Demo City",
                    stateProvince: "Demo State",
                    postalCode: "12345",
                    country: "Demo Country",
                },
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                loginHistory: [
                    {
                        timestamp: new Date().toISOString(),
                        device: "Desktop",
                        ipAddress: "127.0.0.1",
                    },
                ],
            };

            setUser(demoUser);
            return { success: true, message: "Login successful (Demo Mode)" };
        }
    }, []);

    // Register function
    const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, message: result.message || "Registration failed" };
            }

            setUser(result.user);
            return { success: true, message: result.message || "Registration successful" };
        } catch (error) {
            // Fallback demo mode
            console.warn("Backend not available, using demo mode");

            const demoUser: User = {
                id: Date.now(),
                fullName: data.fullName,
                email: data.email,
                address: data.address,
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                loginHistory: [],
            };

            setUser(demoUser);
            return { success: true, message: "Registration successful (Demo Mode)" };
        }
    }, []);

    // Logout function
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("authUser");
        localStorage.removeItem("user"); // Clear old user data too
    }, []);

    // Update profile function
    const updateProfile = useCallback(async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
        if (!user) {
            return { success: false, message: "Not authenticated" };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/profile/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, message: result.message || "Update failed" };
            }

            setUser(prev => prev ? { ...prev, ...result } : null);
            return { success: true, message: "Profile updated successfully" };
        } catch (error) {
            // Demo mode fallback
            setUser(prev => prev ? { ...prev, ...data } : null);
            return { success: true, message: "Profile updated (Demo Mode)" };
        }
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
