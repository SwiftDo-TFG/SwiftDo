import axios from "axios";


const testServerConnection = async (serverConfig) => {

    try {
        const response = await axios.get(`${serverConfig.url}/config/test`);
        const testServer = response.data;

        if(testServer.app === "session-gtd"){
            return true
        }

        return false;
    } catch (error) {
        console.log("[Axisos Error]", error)
        // return { error: 'Error', status: error.response.status }
        return false;
    }
}

const createServerConnection = async (url, serverConfig) => {
    serverConfig = {client_id: "123456789"}

    try {
        const response = await axios.post(`${url}/config/connect`, serverConfig);
        const serverConnection = response.data;

        return serverConnection;
    } catch (error) {
        console.log("[Axisos Error]", error)
        // return { error: 'Error', status: error.response.status }
        return false;
    }
}

export default {testServerConnection, createServerConnection};