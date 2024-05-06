import axios from "axios";
// import { URL } from 'react-native-url-polyfill';
import { setupURLPolyfill } from 'react-native-url-polyfill';
import { Platform } from 'react-native';
import auth_utils from "./auth_utils";

if (Platform.OS !== 'web') {
    setupURLPolyfill();
}
// const apiConfig = {
//     url: 'http:ec2-16-16-226-94.eu-north-1.compute.amazonaws.com:3000/',
//     client_id: 1234,
//     client_secret: 1234,
//     redirect_uri: '/'
// }

let apiConfig = {}

let instance = axios.create({
    timeout: 1000,
});

auth_utils.getSelectedApiConfig().then(config => {
    if(config){
        apiConfig = config;
        instance.defaults.baseURL = config.url;
    }
})

const getAuthCode = async (email, password) => {
    console.log("[AXIOS] Get OAUTH Code")
    try {
        const response = await instance.post('/oauth/authorize', { client_id: apiConfig.client_id, response_type: "code", email: email, password: password });
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
    const data = { client_id: apiConfig.client_id, client_secret: apiConfig.client_secret, grant_type: "authorization_code", code: authcode, redirect_uri: apiConfig.redirect_uri }

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

const restoreToken = async (token) => {
    const data = { client_id: apiConfig.client_id, client_secret: apiConfig.client_secret, grant_type: "refresh_token", refresh_token: token.refresh_token, redirect_uri: apiConfig.url + apiConfig.redirect_uri }

    console.log("[AXIOS] Refresh OAUTH Token", data)
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

const signup = async (userData) => {
    console.log("SignUp, data = ", userData);

    try {
        const response = await instance.post('/user/register', userData);
        const data = response.data;

        return data;
    } catch (error) {
        return null;
    }

}

export default { login, signup, restoreToken }