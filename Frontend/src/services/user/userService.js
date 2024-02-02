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
    console.log("EL ERROR", error)
    if(error.response.status === 401){
        authUtils.clearToken();
    }
    return Promise.reject(error);
});

function getInfo() {

}

export default {getInfo}