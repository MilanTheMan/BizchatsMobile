import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error loading user:', error);
            }
        };
        loadUser();
    }, []);

    const updateUser = async (userData) => {
        try {
            if (userData) {
                await AsyncStorage.setItem('user', JSON.stringify(userData));
            } else {
                await AsyncStorage.removeItem('user');
            }
            setUser(userData);
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser: updateUser }}>

            {children}
        </UserContext.Provider>
    );
};