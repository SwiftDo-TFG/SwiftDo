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
            }
        },
        {
            isOffline: false,
            createTaskQueue: [],
            catchedContent: {}
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
                    newCatched.projects[project_id].tasks = value;
                }
                console.log("CALLING UPDATE CONTENT", newCatched)
                dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedContent: newCatched})
            },
            setInitialCatchedContext: async () =>{
                const data = await deviceStorage.getCatchedData();
                
                if(data != null){
                    console.log("THIS IS THE DATA STORAGED", data)
                    dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedContent: data})
                }
            },
            storeCatchedIndevice: async () =>{
                console.log("WE ARE STORING THISSS", state.catchedContent)
                await deviceStorage.storeCatchedData(state.catchedContent);
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
                catchedContent: state.catchedContent,
                isOffline: state.isOffline
            }}
        >
            {props.children}
        </OfflineContext.Provider>
    )
}

export default OfflineState;