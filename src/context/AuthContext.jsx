import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../services/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsLoading(false);
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            setIsLoading(false);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setIsLoading(false);
            throw error;
        }
        return data;
    };

    const logout = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
