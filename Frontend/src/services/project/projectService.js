import axios from "axios";
import authUtils from "../auth/auth_utils"

let apiConfig = {}

let instance = axios.create({
    timeout: 1000,
});

authUtils.getSelectedApiConfig().then(config => {
    if(config){
        apiConfig = config;
        instance.defaults.baseURL = config.url+'s';
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
    if (!error.code === 'ECONNABORTED' && error.response.status === 401) {
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
        return authUtils.parseError(error)
    }
}

const showProjectsByUser = async () => {
    try {
        const response = await instance.get('/project/');
        const projects = response.data;

        return projects;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return authUtils.parseError(error)
    }
}

const createProject = async (project_data) => {
    try {
        const response = await instance.post('/project/', project_data);
        const project = response.data;

        return project;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return authUtils.parseError(error)
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
        return authUtils.parseError(error)
    }
}

// Completa el proyecto y si tiene tareas tambien
const completeProject = async (projectId) => {
    try {
        const dir = `/project/${projectId}/complete`
        const response = await instance.post(dir);
        const project = response.data;

        return project.project_id;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return authUtils.parseError(error)
    }
}



export default { createProject, showProjectsByUser, showContent, modifyProject, completeProject}