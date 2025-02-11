import { REACT_APP_ENV, REACT_APP_PRODUCTION_URL, REACT_APP_STAGING_URL, REACT_APP_LOCAL_URL } from '@env';

const serverConstants = {
    baseURL: REACT_APP_ENV === 'production' ? REACT_APP_PRODUCTION_URL :
             REACT_APP_ENV === 'staging' ? REACT_APP_STAGING_URL :
             REACT_APP_PRODUCTION_URL
};

console.log("Server Base URL:", serverConstants.baseURL);

export default serverConstants;