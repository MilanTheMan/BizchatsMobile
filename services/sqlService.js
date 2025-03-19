import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import serverConstants from "./serverConstants";
import { serverResponseErrActions } from "./requestActions.js";

axios.defaults.withCredentials = false;

// Helper function to get the user from AsyncStorage
async function getUserFromStorage() {
    try {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Failed to retrieve user from storage:", error);
        return null;
    }
}



// Login function
async function login(data = {}) {
    try {
        const response = await axios.post(`${serverConstants.baseURL}/login`, data);

        if (response.data && response.data.data) {
            let userData = response.data.data;
            delete userData.password;

            // ✅ Store user session in AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            return { success: true, data: userData };
        } else {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        console.error("Login Error:", error);
        serverResponseErrActions(error);
        return { success: false, message: "Login failed. Please try again." };
    }
}


// Signup function
async function signup(data = {}) {
    try {
        console.log("📤 Sending signup request:", data);

        const response = await axios.post(`${serverConstants.baseURL}/signup`, data, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("✅ Signup success response:", response.data);

        if (response.data && response.data.data) {
            let userData = response.data.data;
            delete userData.password;

            // Store user session in AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            return { success: true, data: userData };
        } else {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        console.error("❌ Signup Error:", error.response?.data || error.message);

        return {
            success: false,
            message: error.response?.data?.message || "Signup failed. Please try again."
        };
    }
}



// Logout function
async function logout() {
    try {
        await AsyncStorage.removeItem('user');
    } catch (error) {
        console.error("Failed to clear user session:", error);
    }
}

// Fetch all users
async function getAllUsers(data = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await getUserFromStorage();
            if (!data.user) {
                data["user"] = user;
            }
            axios
                .post(`${serverConstants.baseURL}/getAllUsers`, { "data": data })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    serverResponseErrActions(err);
                    reject(err);
                });
        } catch (err) {
            reject(err);
        }
    });
}

// Fetch user channels
async function getUserChannels(userId) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${serverConstants.baseURL}/getUserChannels`, { userId })
            .then((response) => {
                console.log("📡 API Response (getUserChannels):", response.data);
                resolve(response.data.data || []);
            })
            .catch((err) => {
                console.error("❌ Error fetching channels:", err.response?.data || err.message);
                serverResponseErrActions(err);
                reject(err);
            });
    });
}


// Create a new channel
async function createChannel(data = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await getUserFromStorage();
            if (!data.userId) {
                data["userId"] = user.id;
            }


            if (!data.role_id) {
                data["role_id"] = 1;
            }

            axios
                .post(`${serverConstants.baseURL}/createChannel`, data)
                .then((response) => resolve(response.data))
                .catch((err) => {
                    serverResponseErrActions(err);
                    reject(err);
                });
        } catch (err) {
            reject(err);
        }
    });
}


// Join a channel
async function joinChannel(data = {}) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${serverConstants.baseURL}/joinChannel`, data)
            .then((response) => resolve(response.data))
            .catch((err) => {
                serverResponseErrActions(err);
                reject(err);
            });
    });
}

// Fetch channel details
async function getChannelById(channelId) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${serverConstants.baseURL}/getChannelById`, { channelId })
            .then((response) => resolve(response.data))
            .catch((err) => {
                serverResponseErrActions(err);
                reject(err);
            });
    });
}

// Fetch channel announcements
async function getChannelAnnouncements(channelId) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${serverConstants.baseURL}/getChannelAnnouncements`, { channelId })
            .then((response) => resolve(response.data))
            .catch((err) => {
                serverResponseErrActions(err);
                reject(err);
            });
    });
}

// Fetch channel assignments
async function getChannelAssignments(channelId) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${serverConstants.baseURL}/getChannelAssignments`, { channelId })
            .then((response) => resolve(response.data))
            .catch((err) => {
                serverResponseErrActions(err);
                reject(err);
            });
    });
}

// Fetch channel marks
async function getChannelMarks(channelId) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${serverConstants.baseURL}/getChannelMarks`, { channelId })
            .then((response) => resolve(response.data))
            .catch((err) => {
                serverResponseErrActions(err);
                reject(err);
            });
    });
}

// Fetch channel members
async function getChannelMembers(channelId) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${serverConstants.baseURL}/getChannelMembers`, { channelId })
            .then((response) => resolve(response.data))
            .catch((err) => {
                serverResponseErrActions(err);
                reject(err);
            });
    });
}

// Update user role
async function updateUserRole(data = {}) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${serverConstants.baseURL}/updateUserRole`, data)
            .then((response) => resolve(response.data))
            .catch((err) => {
                serverResponseErrActions(err);
                reject(err);
            });
    });
}

// Remove a member from a channel
async function removeMember(data = {}) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${serverConstants.baseURL}/removeMember`, data)
            .then((response) => resolve(response.data))
            .catch((err) => {
                serverResponseErrActions(err);
                reject(err);
            });
    });
}

// Fetch user details by ID
async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${serverConstants.baseURL}/getUserById`, { userId })
            .then((response) => resolve(response.data))
            .catch((err) => {
                serverResponseErrActions(err);
                reject(err);
            });
    });
}

// Export all functions
const sqlService = {
    login,
    signup,
    logout,
    getAllUsers,
    getUserChannels,
    createChannel,
    joinChannel,
    getChannelById,
    getChannelAnnouncements,
    getChannelAssignments,
    getChannelMarks,
    getChannelMembers,
    updateUserRole,
    removeMember,
    getUserById,
};

export default sqlService;