function getUserFromCookie() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('user='));
    if (!cookie) {
        return null;
    }
    const user = cookie.split('=')[1];
    try {
        return JSON.parse(user);
    } catch (e) {
        console.error('Failed to parse user cookie:', e);
        return null;
    }
}

function serverResponseErrActions(err) {
    // Implement the logic to handle server response errors
    console.error(err);
}

export { getUserFromCookie, serverResponseErrActions };
