import * as SecureStore from 'expo-secure-store';

async function getToken() {
    const token = await SecureStore.getItemAsync("auth_token");

    return token != null ? JSON.parse(token) : null;
}

function removeToken(){
    SecureStore.deleteItemAsync("auth_token");
}

function storeToken(token){
    if(token != null){
        const jsonValue = JSON.stringify(token);
        SecureStore.setItemAsync("auth_token", jsonValue);
    }
}

export default {getToken, storeToken, removeToken}