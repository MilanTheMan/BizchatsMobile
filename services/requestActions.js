import AsyncStorage from "@react-native-async-storage/async-storage";

async function getUserFromStorage() {
    try {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error('Failed to retrieve user from storage:', e);
        return null;
    }
}

function serverResponseErrActions(err) {
    // Implement the logic to handle server response errors
    console.error(err);
}

export { getUserFromStorage, serverResponseErrActions };
