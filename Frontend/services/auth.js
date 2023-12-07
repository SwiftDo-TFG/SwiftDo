import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3000',
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
        return -1;
    }

}

const getAuthToken = async (authcode) => {
    const data = { client_id: 1234, client_secret: 1234, grant_type: "authorization_code", code: authcode, redirect_uri: 'http://localhost:3000/' }

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
        return -1;
    }
}


const testLogin = async (email, password) => {
    const authcode = await getAuthCode(email, password);

    if (authcode != -1) {
        getAuthToken(authcode)
    }
}

//testLogin('pepe@ucm.es', 'Pepe@123');