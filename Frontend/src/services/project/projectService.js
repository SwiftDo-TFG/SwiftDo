import axios from "axios";
import authUtils from "../auth/auth_utils"

const instance = axios.create({
    // baseURL: 'http://localhost:3000',
    // baseURL: 'http://192.168.0.137:3000',
    baseURL: 'http://ec2-51-20-55-15.eu-north-1.compute.amazonaws.com:3000',
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


const showContent = async (projectId) => {
    try {
        const dir = `/project/${projectId}`
        const response = await instance.get(dir);
        const project = response.data;

        return project;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const showProjectsByUser = async () => {
    try {
        const response = await instance.get('/project/');
        const projects = response.data;

        return projects;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const createProject = async (project_data) => {
    try {
        const response = await instance.post('/project/', project_data);
        const project = response.data;

        return project;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const modifyProject = async (projectId, project_data) => {
    try {
        const dir = `/project/${projectId}`
        const response = await instance.post(dir, project_data);
        const project_id = response.data;

        return project_id;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}




export default { createProject, showProjectsByUser, showContent, modifyProject }