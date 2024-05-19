import axios from "axios";
import authUtils from "../auth/auth_utils"

let apiConfig = {}

let instance = axios.create({
    baseURL: ''
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
        const response = await instance.get('/tag/gettagsLimit?' + urlparams.toString());
        const tags = response.data;

        return tags;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const getAllTags = async () => {

    try {
        const response = await instance.get('/tag/gettags');
        const tags = response.data;

        return tags;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const deleteTag = async (tag) => {
    try {
        const dir = `/tag/${tag}`
        const response = await instance.delete(dir);
        const tagdata = response.data;
        return tagdata;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}
export default { getTags, createTag, searchTags, getAllTags, deleteTag }