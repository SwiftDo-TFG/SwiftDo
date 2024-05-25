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
                        nextNewIndex: action.nextNewIndex,
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
                case 'UPDATE_NEXTNEWINDEX':
                    return {
                        ...prevState,
                        nextNewIndex: action.nextNewIndex,
                    };
            }
        },
        {
            isOffline: false,
            createTaskQueue: [],
            catchedContent: {},
            catchedSidebarData: {},
            nextNewIndex: -1,
        }
    );

    const completeNotCatchedNewTaskData = (task, nextIndex)=>{
        const newTask = {...task};

        if(!newTask.task_id){
            newTask.task_id = nextIndex;
        }
        if(!newTask.project_id){
            newTask.project_id = null;
        }
        if(!newTask.context_id){
            newTask.context_id = null;
        }
        if(!newTask.important_fixed){
            newTask.important_fixed = null;
        }
        if(!newTask.description){
            newTask.description = null;
        }
        if(!newTask.tags){
            newTask.tags = [];
        }
        if(!newTask.completed){
            newTask.completed = false;
        }

        console.log("THIS IS THE NEW TASKSSS", newTask)

        newTask.offline = true;
        
        return newTask;
    }
    
    const offlineModeFunctions = React.useMemo(
        () => ({
            setOfflineMode: ()=> {
                dispatch({ type: 'SET_OFFLINEMODE'})
            },
            addTaskToQueue: (task, realState)=> {
                const newCatched = realState.catchedContent;
                const stateAux = task.state;

                const taksToPush = completeNotCatchedNewTaskData(task, realState.nextNewIndex);
                let indexInState = null;

                if(task.state){
                    const stateTasks = newCatched[stateAux];
                    console.log("THIS IS THE QUEUE AFTER ADDD", state.createTaskQueue, stateTasks, realState);
                    stateTasks.push(taksToPush);
                    newCatched[stateAux] = stateTasks;
                    indexInState = stateTasks.length-1;
                    dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedContent: newCatched})
                }
                const queue = realState.createTaskQueue;

                if(indexInState){
                    taksToPush.indexInState = indexInState
                }

                queue.push(taksToPush);
                dispatch({ type: 'ADD_TASKS_TO_QUEUE', newtasksqueue: queue, nextNewIndex: realState.nextNewIndex - 1})
                
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
                    const nextNewIndex = data.nextNewIndex
                    if(nextNewIndex){
                        dispatch({ type: 'UPDATE_NEXTNEWINDEX', nextNewIndex: nextNewIndex})
                    }
                }

                const sideBarData = await deviceStorage.getSidebarData();

                if(sideBarData != null){
                    console.log("THIS IS THE DATA STORAGED OF SIDEBAR", sideBarData)
                    dispatch({ type: 'UPDATE_CATCHED_SIDEBAR', newCatchedSidebarData: sideBarData})
                }
            },
            setAllCatchedContext: async (data) => {
                dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedContent: data})
            },
            storeCatchedIndevice: async (data, sideBarData, nextNewIndex) =>{
                console.log("WE ARE STORING THISSS", data, sideBarData)
                if(data){
                    console.log("ACTUALLY STORED", data)
                    if(nextNewIndex){
                        data.nextNewIndex = nextNewIndex
                    }
                    await deviceStorage.storeCatchedData(data);
                }
                if(Object.keys(sideBarData).length !== 0){
                    console.log("ACTUALLY STORED THIS OF SIDEBAR",sideBarData)
                    await deviceStorage.storeSidebarData(sideBarData);
                }else{
                    console.log("ACTUALLY NOT STORED THIS OF SIDEBAR", sideBarData)
                }
            },
            updateSideBarCatcheData: async (data) =>{
                console.log("WE ARE UPDATINGG THISSS SIDEBAR", data)
                dispatch({ type: 'UPDATE_CATCHED_SIDEBAR', newCatchedSidebarData: data})
            },
            updateOfflineTask: async(task, lastState, realState) => {
                if(task.state){
                    const newCatched = realState.catchedContent;
                    const offlineState = newCatched[task.state];
                    console.log("THIS WAS THE TASK STATE", lastState)
                    console.log("THIS IS THE NEW STATE", task.state)
                    if(newCatched){
                        // const newTask = Object.assign(oldTask, task);
                        if(task.state === lastState){
                            const oldTask = offlineState[task.indexInState];
                            offlineState[task.indexInState] = Object.assign(oldTask, task);
                            dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedContent: newCatched})
                        }else{
                            const lastStateList = newCatched[lastState];
                            lastStateList.splice(task.indexInState, 1);
                            if(!offlineState){
                                task.indexInState = 0;
                                newCatched[task.state] = [task]
                            }else{
                                task.indexInState = offlineState.length;
                                offlineState.push(task);
                                newCatched[task.state] = offlineState;
                            }
                            dispatch({ type: 'UPDATE_CATCHED_CONTENT', newCatchedContent: newCatched})
                        }
                    }
                }
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
                updateOfflineTask: offlineModeFunctions.updateOfflineTask,
                catchedContent: state.catchedContent,
                catchedSidebarData: state.catchedSidebarData,
                createTaskQueue: state.createTaskQueue,
                isOffline: state.isOffline,
                nextNewIndex: state.nextNewIndex,
            }}
        >
            {props.children}
        </OfflineContext.Provider>
    )
}

export default OfflineState;