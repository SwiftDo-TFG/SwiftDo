import AsyncStorage from '@react-native-async-storage/async-storage';

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
        AsyncStorage.setItem(key, jsonValue);
    }
}

async function getValueByKey(key){
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
}

export default {storeConfig, getUserConfig}