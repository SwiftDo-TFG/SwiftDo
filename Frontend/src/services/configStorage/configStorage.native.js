import * as SecureStore from 'expo-secure-store';

async function storeConfig(configToChange, value){
    let config = await getValueByKey('config');

    if(config ===  null){
        config = {}
    }

    config[configToChange] = value
    
    storeKeyValue('config', config);
}

async function getUserConfig(){
    let config = await getValueByKey('config');
    return config;
}

async function storeKeyValue(key, value){
    if(value != null){
        const jsonValue = JSON.stringify(value);
        SecureStore.setItemAsync(key, jsonValue);
    }
}

async function getValueByKey(key){
    console.log("JEY PASEEESD", key)

    const value = await SecureStore.getItemAsync(key);
    return value != null ? JSON.parse(value) : null;
}

export default {storeConfig, getUserConfig}