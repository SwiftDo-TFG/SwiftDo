import axios from "axios";
import authUtils from "../auth/auth_utils"

const instance = axios.create({
    // baseURL: 'http://localhost:3000',
    // baseURL: 'http://192.168.0.137:3000',
    baseURL: 'http://ec2-16-16-226-94.eu-north-1.compute.amazonaws.com:3000',
    timeout: 1000,
    // headers: { Authorization: `Bearer d04d34bd905b677bc04d205cf3c3a4e7d91601da` }
});

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

const getTags = async (filters) => {
    const urlparams = new URLSearchParams(filters)
    console.log("urlparams", urlparams.toString())

    try {
        const response = await instance.get('/tag/?' + urlparams.toString());
        const tags = response.data;

        return tags;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const createTag = async (name) => {
    try {
        const data = { name: name }
        const response = await instance.post('/tag/', data);
        const tag = response.data;

        return tag;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const searchTags = async (name) => {
    const urlparams = new URLSearchParams(name)
    console.log("urlparams", urlparams.toString())

    try {
        const response = await instance.get('/tag/gettags?' + urlparams.toString());
        const tags = response.data;

        return tags;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

export default { getTags, createTag, searchTags }