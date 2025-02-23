const env = process.env.REACT_APP_ENV;

const serverConstants = {
    baseURL: env === 'production' ? 'https://3.82.202.242' :
        env === 'staging' ? 'https://' :
            'http://localhost:8080' // Default to local
};

export default serverConstants;