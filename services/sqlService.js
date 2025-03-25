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

// Auth
async function login(data = {}) {
    try {
        const response = await axios.post(`${serverConstants.baseURL}/login`, data);
        if (response.data && response.data.data) {
            let userData = response.data.data;
            delete userData.password;
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

async function signup(data = {}) {
    try {
        const response = await axios.post(`${serverConstants.baseURL}/signup`, data, {
            headers: { "Content-Type": "application/json" }
        });
        if (response.data && response.data.data) {
            let userData = response.data.data;
            delete userData.password;
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            return { success: true, data: userData };
        } else {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        console.error("Signup Error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Signup failed. Please try again."
        };
    }
}

async function logout() {
    try {
        await AsyncStorage.removeItem('user');
    } catch (error) {
        console.error("Failed to clear user session:", error);
    }
}

// User & Friends
async function getAllUsers(data = {}) {
    try {
        const user = await getUserFromStorage();
        if (!data.user) data.user = user;
        const response = await axios.post(`${serverConstants.baseURL}/getAllUsers`, { data });
        return response.data;
    } catch (err) {
        serverResponseErrActions(err);
        throw err;
    }
}

async function getUserById(userId) {
  return axios.post(`${serverConstants.baseURL}/getUserById`, { data: userId }) // 👈 match web format
    .then(res => res.data)
    .catch(err => {
      serverResponseErrActions(err);
      throw err;
    });
}

async function getFriends(userId) {
    return axios.post(`${serverConstants.baseURL}/getFriends`, { userId })
        .then(res => res.data.data || [])
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function addFriend(data) {
    return axios.post(`${serverConstants.baseURL}/addFriend`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function deleteFriend(data) {
    return axios.post(`${serverConstants.baseURL}/deleteFriend`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

// Channels
async function getUserChannels(userId) {
    return axios.post(`${serverConstants.baseURL}/getUserChannels`, { userId })
        .then(res => res.data.data || [])
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function createChannel(data = {}) {
    const user = await getUserFromStorage();
    if (!data.userId) data.userId = user.id;
    if (!data.profile_picture) {
        const randomNumber = Math.floor(Math.random() * 30) + 1;
        data.profile_picture = `https://bizchats.s3.us-east-2.amazonaws.com/channels/wallpapers/generic/Wallpaper+(${randomNumber}).jpg`;
    }
    return axios.post(`${serverConstants.baseURL}/createChannel`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function joinChannel(data = {}) {
    return axios.post(`${serverConstants.baseURL}/joinChannel`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function getChannelById(channelId) {
    return axios.post(`${serverConstants.baseURL}/getChannelById`, { channelId })
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function getChannelAnnouncements(channelId) {
    return axios.post(`${serverConstants.baseURL}/getChannelAnnouncements`, { channelId })
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function getChannelAssignments(channelId) {
    return axios.post(`${serverConstants.baseURL}/getChannelAssignments`, { channelId })
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function getChannelMarks(channelId) {
    return axios.post(`${serverConstants.baseURL}/getChannelMarks`, { channelId })
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function getChannelMembers(channelId) {
    return axios.post(`${serverConstants.baseURL}/getChannelMembers`, { channelId })
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

// New Functions from Web
async function createAnnouncement(data = {}) {
    return axios.post(`${serverConstants.baseURL}/createAnnouncement`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function createAssignment(data = {}) {
    return axios.post(`${serverConstants.baseURL}/createAssignment`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function createChat(data = {}) {
    return axios.post(`${serverConstants.baseURL}/createChat`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function getChats(userId) {
    return axios.post(`${serverConstants.baseURL}/getChats`, { userId })
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function updateUserEmail(data = {}) {
    return axios.post(`${serverConstants.baseURL}/updateUserEmail`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function resetUserPassword(data = {}) {
    return axios.post(`${serverConstants.baseURL}/resetUserPassword`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function updateProfilePicture(data = {}) {
    return axios.post(`${serverConstants.baseURL}/updateProfilePicture`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function getChannelMessages(channelId) {
    return axios.post(`${serverConstants.baseURL}/getChannelMessages`, { channelId })
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function updateUserRole(data = {}) {
    return axios.post(`${serverConstants.baseURL}/updateUserRole`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

async function removeMember(data = {}) {
    return axios.post(`${serverConstants.baseURL}/removeMember`, data)
        .then(res => res.data)
        .catch(err => {
            serverResponseErrActions(err);
            throw err;
        });
}

// Export everything
const sqlService = {
    login,
    signup,
    logout,
    getAllUsers,
    getUserById,
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
    addFriend,
    getFriends,
    deleteFriend,
    createAnnouncement,
    createAssignment,
    createChat,
    getChats,
    updateUserEmail,
    resetUserPassword,
    updateProfilePicture,
    getChannelMessages
};

export default sqlService;
