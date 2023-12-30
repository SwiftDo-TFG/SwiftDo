import axios from "axios";
import tokenStorage from "../auth/token_store/storage"

const instance = axios.create({
    // baseURL: 'http://localhost:3000',
    // baseURL: 'http://192.168.0.137:3000',
    baseURL: 'http://ec2-16-171-198-23.eu-north-1.compute.amazonaws.com:3000',
    timeout: 1000,
    // headers: { Authorization: `Bearer d04d34bd905b677bc04d205cf3c3a4e7d91601da` }
});

tokenStorage.getToken().then((token)=>{
    instance.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`;
})

const getTasks = async () =>{
    try {
        const response = await instance.get('/task/');
        const tasks = response.data;

        return tasks;
    } catch (error) {
        console.log("[Axisos Error]", error)
        return null
    }
}

const getTaskById = async (taskId) => {

}

const createTask = async (taskData) =>{

}

const updateTask = async (taskData) =>{

}

async function restoreToken(){
   const token = await tokenStorage.getToken();
   instance.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`;
}

export default {getTasks, getTaskById, createTask, updateTask}