import AsyncStorage from '@react-native-async-storage/async-storage';


async function storeActionScreenData(action, data) {
    await storeData(action, data);
}

async function storeCatchedData(catchedData) {
    await storeData("offlineData", catchedData);
}

async function getCatchedData() {
    const data = await AsyncStorage.getItem("offlineData");

    return data != null ? JSON.parse(data) : null;
}

async function removeCatchedData() {
    const data = await AsyncStorage.removeItem("offlineData");
}

//Hacerlo para cada usuario
async function getActionScreenData(action) {
    const data = await AsyncStorage.getItem(action);

    return data != null ? JSON.parse(data) : null;
}

async function storeSidebarData(data) {
    await storeData("sidebar", data)
}

async function getSidebarData() {
    const data = await AsyncStorage.getItem("sidebar");

    return data != null ? JSON.parse(data) : null;
}

async function storeData(key, value) {
    const jsonValue = JSON.stringify(value);
    AsyncStorage.setItem(key, jsonValue);
}

async function storeProjectData(project_id, data) {
    const projectKey = `project_${project_id}`
    await storeData(projectKey, data)
}

async function getProjectData(project_id) {
    const projectKey = `project_${project_id}`

    const data = await AsyncStorage.getItem(projectKey);

    return data != null ? JSON.parse(data) : null;
}

async function storeProjectTasks(project_id, data) {
    const projectKey = `project_tasks_${project_id}`
    await storeData(projectKey, data)
}

async function getProjectTasks(project_id) {
    const projectKey = `project_tasks_${project_id}`

    const data = await AsyncStorage.getItem(projectKey);

    return data != null ? JSON.parse(data) : null;
}

export default { storeActionScreenData, getActionScreenData, storeSidebarData, getSidebarData, storeProjectData, getProjectData, storeProjectTasks, getProjectTasks, storeCatchedData, getCatchedData, removeCatchedData }