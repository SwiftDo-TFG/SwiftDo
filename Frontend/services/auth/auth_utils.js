import authService from "./auth"
import tokenStorage from "./token_store/storage"

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

export default { setAuthHeaders, clearToken }