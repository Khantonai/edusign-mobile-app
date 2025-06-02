// import { createContext, useContext } from 'react';

// export const AuthContext = createContext<any>(null);
// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: any }>;
    logout: () => void;
    register?: (name: string, email: string, password: string, password_confirmation: string) => Promise<{ success: boolean; message?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Charger le token depuis SecureStore au démarrage
        SecureStore.getItemAsync('authToken').then(setToken);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:${process.env.EXPO_PUBLIC_APP_PORT}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                setToken(data.token);
                await SecureStore.setItemAsync('authToken', data.token);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Something went wrong' };
        }
    };

    const logout = async () => {
        setToken(null);
        await SecureStore.deleteItemAsync('authToken');
    };

    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:${process.env.EXPO_PUBLIC_APP_PORT}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, email, password, password_confirmation }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registration successful:', data);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Something went wrong' + error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};