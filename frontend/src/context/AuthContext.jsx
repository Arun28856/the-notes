import { createContext, useContext, useState, useEffect } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

const defaultAuthValue = {
    currentUser: null,
    loading: true,
    signup: async () => {},
    login: async () => {},
    loginWithGoogle: async () => {},
    logout: async () => {},
};

const AuthContext = createContext(defaultAuthValue);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setCurrentUser(userCredential.user);
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setCurrentUser(userCredential.user);
        } catch (error) {
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            if (
                error.code === "auth/popup-blocked" ||
                error.code === "auth/popup-closed-by-user" ||
                error.code === "auth/cancelled-popup-request" ||
                error.message?.includes("Cross-Origin-Opener-Policy")
            ) {
                await signInWithRedirect(auth, provider);
            } else {
                throw error;
            }
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        let cancelled = false;

        const initAuth = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (!cancelled && result?.user) {
                    setCurrentUser(result.user);
                }
            } catch (err) {
                if (!cancelled && err?.code) {
                    console.error("Google redirect error:", err.code, err.message);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        initAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!cancelled) {
                setCurrentUser(user);
                setLoading(false);
            }
        });

        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, []);

    const value = {
        currentUser,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
