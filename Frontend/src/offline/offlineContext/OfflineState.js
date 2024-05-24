import React, { useEffect } from "react";
import OfflineContext from "./OfflineContext";
import deviceStorage from "../deviceStorage";

const OfflineState = props =>{

    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {

                case 'SET_OFFLINEMODE':
                    return {
                        ...prevState,
                        isOffline: true,
                    };

                case 'ADD_TASKS_TO_QUEUE':
                    return {
                        ...prevState,
                        createTaskQueue: action.newtasksqueue
                    };
                case 'SET_TASKS_QUEUE':
                    return {
                        ...prevState,
                        createTaskQueue: action.tasksqueue
                    };

                case 'UPDATE_CATCHED_CONTENT':
                    return {
                        ...prevState,
                        catchedContent: action.newCatchedContent
                    };
                case 'UPDATE_CATCHED_SIDEBAR':
                    return {
                        ...prevState,
                        catchedSidebarData: action.newCatchedSidebarData
                    };
            }
        },
        {
            isOffline: false,
            createTaskQueue: [],
            catchedContent: {},
            catchedSidebarData: {}
        }
    );
    
    const offlineModeFunctions = React.useMemo(
        () => ({
            setOfflineMode: ()=> {
                dispatch({ type: 'SET_OFFLINEMODE'})
            },
            addTaskToQueue: (task)=> {
                const queue = state.createTaskQueue;

                queue.append(task);

                dispatch({ type: 'ADD_TASKS_TO_QUEUE', newtasksqueue: queue})
            },
            updateCatchedContext: (key, value, project_id) => {
                const newCatched = state.catchedContent;
                if(!project_id){
                    newCatched[key] = value;
                }else{
                    console.log("UPDATINGG PROYECT DATA TASKSSS", newCatched.projects)
                    if(!newCatched.projects){
                        newCatched.projects = {};
                    }
                    if(newCatched.projects[project_id]){
                        newCatched.projects[project_id].tasks = value;
                    }else{
                        newCatched.projects[project_id] = {tasks: value};
                    }
                }
                dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedContent: newCatched})
            },
            updateCatchedContextProjectData: (project_info) => {
                const newCatched = state.catchedContent;
                const project_id = project_info.project_id;
                if(newCatched && !newCatched.projects){
                    newCatched.projects = {};
                }
                if(newCatched && newCatched.projects[project_id]){
                    newCatched.projects[project_id].project = project_info;
                }else{
                    newCatched.projects[project_id] = {project: project_info};
                }
                console.log("UPDATINGG PROYECT DATA", newCatched)

                dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedContent: newCatched})
            },
            setInitialCatchedContext: async () =>{
                const data = await deviceStorage.getCatchedData();
                
                if(data != null){
                    console.log("THIS IS THE DATA STORAGED", data)
                    dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedContent: data})
                }
            },
            setAllCatchedContext: async (data) => {
                dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedContent: data})
            },
            storeCatchedIndevice: async (data) =>{
                console.log("WE ARE STORING THISSS", data)
                if(data){
                    console.log("ACTUALLY STORED", data)
                    await deviceStorage.storeCatchedData(data);
                }
                if(Object.keys(state.catchedSidebarData).length !== 0){
                    await deviceStorage.storeSidebarData(catchedSidebarData);
                }
            },
            updateSideBarCatcheData: async (data) =>{
                console.log("WE ARE STORING THISSS SIDEBAR", data)
                dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedSidebarData: data})
                // await deviceStorage.storeCatchedData(data);
            }
        }),
        []
    );

    return (
        <OfflineContext.Provider
            value={{
                setOfflineMode: offlineModeFunctions.setOfflineMode,
                addTaskToQueue: offlineModeFunctions.addTaskToQueue,
                updateCatchedContext: offlineModeFunctions.updateCatchedContext,
                setInitialCatchedContext: offlineModeFunctions.setInitialCatchedContext,
                storeCatchedIndevice: offlineModeFunctions.storeCatchedIndevice,
                setAllCatchedContext: offlineModeFunctions.setAllCatchedContext,
                updateCatchedContextProjectData: offlineModeFunctions.updateCatchedContextProjectData,
                updateSideBarCatcheData: offlineModeFunctions.updateSideBarCatcheData,
                catchedContent: state.catchedContent,
                catchedSidebarData: state.catchedSidebarData,
                isOffline: state.isOffline
            }}
        >
            {props.children}
        </OfflineContext.Provider>
    )
}

export default OfflineState;