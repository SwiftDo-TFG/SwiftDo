import AsyncStorage from '@react-native-async-storage/async-storage';

async function getToken() {
    const token = await AsyncStorage.getItem("auth_token");

    return token != null ? JSON.parse(token) : null;
}

function removeToken(){
    AsyncStorage.removeItem("auth_token");
}

function storeToken(token){
    if(token != null){
        const jsonValue = JSON.stringify(token);
        AsyncStorage.setItem("auth_token", jsonValue);
    }
}

export default {getToken, storeToken, removeToken}