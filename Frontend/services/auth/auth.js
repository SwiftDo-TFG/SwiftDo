import axios from "axios";
// import { URL } from 'react-native-url-polyfill';
import { setupURLPolyfill } from 'react-native-url-polyfill';
import { Platform } from 'react-native';

if(Platform.OS !== 'web'){
    setupURLPolyfill();
}

const instance = axios.create({
    // baseURL: 'http://localhost:3000',
    baseURL: 'http://192.168.0.137:3000',
    timeout: 1000,
    //headers: { 'X-Custom-Header': 'foobar' }
});

const getAuthCode = async (email, password) => {
    console.log("[AXIOS] Get OAUTH Code")
    try {
        const response = await instance.post('/oauth/authorize', { client_id: 1234, response_type: "code", email: email, password: password });
        const url = new URL(response.request.responseURL);
        const authcode = url.searchParams.get('code');
        console.log("This is the auth code:", authcode);
        return authcode;
    } catch (error) {
        console.log("AXIOS Error", error)
        
        return null;
    }

}

const getAuthToken = async (authcode) => {
    const data = { client_id: 1234, client_secret: 1234, grant_type: "authorization_code", code: authcode, redirect_uri: 'http://192.168.0.137:3000/' }

    console.log("[AXIOS] Get OAUTH Token", data)
    try {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        const response = await instance.post('/oauth/token', data, config);
        const token = response.data;

        console.log("TOKEN RESPONSE", token);
        return token;
    } catch (error) {
        console.log("AXIOS Error", error)
        return null;
    }
}


const login = async (email, password) => {
    console.log("LOGIN, data = ", email, password);

    const authcode = await getAuthCode(email, password);

    if (authcode != null) {
        const token = await getAuthToken(authcode)
        return token;
    }

    return null;
}

const signup = async (userData) =>{
    console.log("SignUp, data = ", userData);

    try{
        const response = await instance.post('/user/register', userData);
        const data = response.data;
        
        return data;
    }catch(error){
        return null;
    }

}

export default {login, signup}