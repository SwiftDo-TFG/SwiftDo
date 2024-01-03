import axios from "axios";
import authUtils from "../auth/auth_utils"

const instance = axios.create({
    // baseURL: 'http://localhost:3000',
    // baseURL: 'http://192.168.0.137:3000',
    baseURL: 'http://ec2-16-171-198-23.eu-north-1.compute.amazonaws.com:3000',
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
    if(error.response.status === 401){
        authUtils.clearToken();
    }
    return Promise.reject(error);
});

const getTasks = async () => {
    try {
        const response = await instance.get('/task/');
        const tasks = response.data;

        return tasks;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const getTaskById = async (taskId) => {
    
}

const createTask = async (taskData) => {
    try {
        const response = await instance.post('/task/', taskData);
        const taskid = response.data;

        return taskid;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const updateTask = async (taskId, taskData) => {
    try {
        const dir = `/task/${taskId}`
        const response = await instance.post(dir, taskData);
        const taskid = response.data;

        return taskid;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}


export default { getTasks, getTaskById, createTask, updateTask }