import axios from "axios";
import authUtils from "../auth/auth_utils"

let apiConfig = {}

let instance = axios.create({
    timeout: 1000,
});

authUtils.getSelectedApiConfig().then(config => {
    if(config){
        apiConfig = config;
        instance.defaults.baseURL = config.url;
    }
})

// Interceptor for request --> Set AuthHeaders
instance.interceptors.request.use(authUtils.setAuthHeaders, function (error) {
    return Promise.reject(error);
});

// Interceptor for response --> If 401, clear token
instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.log("EL ERROR", error)
    if (error.response.status === 401) {
        authUtils.clearToken();
    }
    return Promise.reject(error);
});

const showContextsByUser = async () => {
    try {
        const response = await instance.get('/context/');
        const context = response.data;

        return context;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const createContext = async (context) => {
    try {
        const response = await instance.post('/context/', context);
        const contextdata = response.data;

        return contextdata;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const deleteContext = async (context) => {
    try {
        const dir = `/context/${context}`
        const response = await instance.delete(dir);
        const contextdata = response.data;

        return contextdata;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

export default { showContextsByUser, createContext, deleteContext }