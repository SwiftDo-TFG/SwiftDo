import axios from "axios";
import authUtils from "../auth/auth_utils"

let apiConfig = {}

let instance = axios.create({timeout: 1000});

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

const getTasks = async (filters) => {
    const urlparams = new URLSearchParams(filters)
    console.log("urlparams", urlparams.toString())

    try {
        const response = await instance.get('/task/?' + urlparams.toString());
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
        console.log("En la base de datos se guarda", taskData)
        const response = await instance.post(dir, taskData);
        const taskid = response.data;

        return taskid;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const moveTaskList = async (list_ids, state) => {
    try {
        const dir = '/task/movelist'
        const data = {
            list_ids: list_ids,
            state: state
        }

        const response = await instance.post(dir, data);
        const taskid = response.data;

        return taskid;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const completeTaskList = async (list_ids, completed) => {
    try {
        const dir = '/task/completelist'
        const data = {
            list_ids: list_ids,
            completed: completed
        }

        const response = await instance.post(dir, data);
        const taskid = response.data;

        return taskid;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const getInfo = async () => {
    try {
        const res = await instance.get('/task/newinfo')
        const tasksAndUsername = res.data;

        return tasksAndUsername;
    }
    catch (e) {
        console.log("ERROR:", e)
        return { e: 'Error', status: e.response.status }
    }
}

const addTag = async (taskId, tag) => {
    try {
        const dir = '/task/addTag'
        const data = {
            task_id: taskId,
            tag: {
                name: tag.name,
                color: tag.color
            }
        }
        const response = await instance.post(dir, data);
        const taskid = response.data;

        return taskid;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}

const findTags = async (taskId) => {
    try {
        const dir = `/task/${taskId}/tags`
        const response = await instance.get(dir);
        const tags = response.data;

        return tags;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return { error: 'Error', status: error.response.status }
    }
}


export default { getInfo, getTasks, getTaskById, createTask, updateTask, moveTaskList, completeTaskList, addTag, findTags }