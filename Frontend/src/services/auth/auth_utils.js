import authService from "./auth"
import tokenStorage from "./token_store/storage"
import configStorage from "../configStorage/configStorage";

let authtoken = null;

const setAuthHeaders = async function (config) {
    console.log("Auth token actual", authtoken)
    if(!authtoken){
        let token = await tokenStorage.getToken();
        authtoken = token;
    }

    if(Date.now() > (Date.parse(authtoken.expires_at) ?? Date.now())){
        const newToken = await authService.restoreToken(authtoken)

        if(newToken){
            token.expires_at = new Date(Date.now() + token.expires_in*1000);
            await tokenStorage.storeToken(newToken);
            authtoken = newToken;
        }
    }

    config.headers.Authorization = `Bearer ${authtoken.access_token}`;

    return config;
}

const clearToken = function () {
    authtoken = null;
}

const parseError = function (error){
    return { error: {status: error.response ? error.response.status : 'timeout'}}
}

async function getSelectedApiConfig(){
    const apiConfig = await configStorage.getUserConfig();
    console.log("THIS IS CONFIG API", apiConfig)

    if(apiConfig && apiConfig.servers){
        const selectedApi = apiConfig.servers.selected;
        return apiConfig.servers.list[selectedApi];
    }
    return null;
}

export default { setAuthHeaders, clearToken, getSelectedApiConfig, parseError}
