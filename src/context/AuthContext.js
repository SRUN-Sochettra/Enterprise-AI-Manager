"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    // Load user from localStorage (Spring Boot auth)
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");
            const savedToken = localStorage.getItem("token");

            if (savedUser && savedToken) {
                const parsed = JSON.parse(savedUser);
                // Only restore if it's NOT a google user
                // Google users are handled by useSession below
                if (parsed.provider !== "google") {
                    setUser(parsed);
                }
            } else {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        } catch (err) {
            console.error("Failed to load user:", err);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    }, []);

    // Sync Google session
    useEffect(() => {
        if (status === "loading") return;

        console.log("Session status:", status);
        console.log("Session data:", session);

        if (status === "authenticated" && session?.user) {
            // Google user is logged in → set user
            const googleUser = {
                username: session.user.name,
                email: session.user.email,
                image: session.user.image,
                role: "USER",
                provider: "google",
            };
            console.log("Setting Google user:", googleUser);
            setUser(googleUser);
            localStorage.setItem("user", JSON.stringify(googleUser));
            localStorage.setItem("token", "google-oauth");
        }

        if (status === "unauthenticated") {
            // Check if stored user was a Google user → clear it
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                try {
                    const parsed = JSON.parse(savedUser);
                    if (parsed.provider === "google") {
                        setUser(null);
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                    }
                } catch (err) {
                    console.error("Failed to parse user:", err);
                }
            }
        }
    }, [session, status]);

    // Listen for auth-expired events
    useEffect(() => {
        const onAuthExpired = () => setUser(null);
        window.addEventListener("auth-expired", onAuthExpired);
        return () => window.removeEventListener("auth-expired", onAuthExpired);
    }, []);

    const loginUser = (userData) => {
        if (userData.token) {
            localStorage.setItem("token", userData.token);
        }
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logoutUser = async () => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                if (parsed.provider === "google") {
                    await signOut({ redirect: false });
                }
            } catch (err) {
                console.error("Failed to parse user:", err);
            }
        }

        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const isAdmin = () => user?.role === "ADMIN";
    const isLoggedIn = () => user !== null;
    const isGoogleUser = () => user?.provider === "google";

    return (
        <AuthContext.Provider
            value={{
                user,
                loading: loading || status === "loading",
                loginUser,
                logoutUser,
                isAdmin,
                isLoggedIn,
                isGoogleUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}