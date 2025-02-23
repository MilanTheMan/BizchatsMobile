import axios from "axios";
import Cookies from "js-cookie";
import { userState } from "../App";
import { json } from "react-router-dom";
import serverConstants from "./serverConstants";
import { serverResponseErrActions, getUserFromCookie } from "./requestActions.js";
axios.defaults.withCredentials = true;

function getAllUsers(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            let user = getUserFromCookie();
            if (!data.user) {
                data["user"] = user;
            }
            axios
                .post(`${serverConstants.baseURL}/getAllUsers`, { "data": data })
                .then((data) => {
                    let ret = data.data;
                    resolve(ret);
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

function login(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            let user = getUserFromCookie();
            if (!data.user) {
                data["user"] = user;
            }
            axios
                .post(`${serverConstants.baseURL}/login`, data)
                .then((response) => {
                    let ret = response.data;
                    delete ret.data.password; // Remove password from response
                    Cookies.set('user', JSON.stringify(ret.data), { expires: 7 }); // Save user info in a cookie
                    resolve(ret);
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

function signup(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/signup`, data)
                .then((response) => {
                    let ret = response.data;
                    delete ret.data.password; // Remove password from response
                    Cookies.set('user', JSON.stringify(ret.data), { expires: 7 }); // Save user info in a cookie
                    resolve(ret);
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

function getUserChannels(userId) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post('/api/getUserChannels', { userId })
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function createChannel(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            let user = getUserFromCookie();
            if (!data.userId) {
                data["userId"] = user.id;
            }
            axios
                .post('/api/createChannel', data)
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function joinChannel(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post('/api/joinChannel', data)
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function getChannelById(channelId) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/getChannelById`, { channelId })
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function getChannelAnnouncements(channelId) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/getChannelAnnouncements`, { channelId })
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function getChannelAssignments(channelId) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/getChannelAssignments`, { channelId })
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function getChannelMarks(channelId) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/getChannelMarks`, { channelId })
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function createAnnouncement(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/createAnnouncement`, data)
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function createAssignment(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/createAssignment`, data)
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function getChannelMembers(channelId) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/getChannelMembers`, { channelId })
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function updateUserRole(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/updateUserRole`, data)
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function removeMember(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/removeMember`, data)
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function createChat(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/createChat`, data)
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function getChats(userId) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/getChats`, { userId })
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function addFriend(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/addFriend`, data)
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function getFriends(user_id) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/getFriends`, { user_id })
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function deleteFriend(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/deleteFriend`, data)
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

function getUserById(data = {}) {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(`${serverConstants.baseURL}/getUserById`, data)
                .then((response) => {
                    let ret = response.data;
                    resolve(ret);
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

const sqlService = {
    getAllUsers,
    login,
    signup,
    getUserChannels,
    createChannel,
    joinChannel,
    getChannelById,
    getChannelAnnouncements,
    getChannelAssignments,
    getChannelMarks,
    createAnnouncement,
    createAssignment,
    getChannelMembers,
    updateUserRole,
    removeMember,
    createChat,
    getChats,
    addFriend,
    getFriends,
    deleteFriend,
    getUserById // Add getUserById function
};

export default sqlService;
