import { View, Text } from "react-native";
import { Agenda, AgendaList, ExpandableCalendar, CalendarProvider, WeekCalendar } from "react-native-calendars";
import SelectableTask from "../inbox/selectableTask";
import styles from './programadas.styles'
import utils from "./calendar/utils"
import React, { useState, useEffect, useRef } from "react";
import {NativeBaseProvider} from "native-base"
import { PopUpModal } from "../../components/PopUpModal";


const ProgramadasScreen = (props) => {
    const [calendarHeight, setCalendarHeight] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState({});

    const marked = useRef(utils.getMarkedDates(tasks));

    let moveRef = React.createRef();
    let editRef = React.createRef();
    let addRef = React.createRef();

    useEffect(() => {
        //Fetch tasks
        //setTasks()

        setTasks([{
            title: '2024-01-17',
            data: [{ task_id: 1, title: 'Task 1, this is the title' }, { task_id: 2, title: 'Task 2, this is the title' }]
        },
        {
            title: '2024-01-18',
            data: [{ task_id: 3, title: 'Task 23, this is the title' }, { task_id: 4, title: 'Task 26, this is the title' }]
        },
        {
            title: '2024-01-19',
            data: [{ task_id: 3, title: 'Task 23, this is the title' }, { task_id: 4, title: 'Task 26, this is the title' }]
        },
        {
            title: '2024-01-23',
            data: [{ task_id: 3, title: 'Task 23, this is the title' }, { task_id: 4, title: 'Task 26, this is the title' }]
        },
        {
            title: '2024-01-27',
            data: [{ task_id: 3, title: 'Task 23, this is the title' }, { task_id: 4, title: 'Task 26, this is the title' }]
        },
        {
            title: '2024-01-29',
            data: [{ task_id: 3, title: 'Task 23, this is the title' }, { task_id: 4, title: 'Task 26, this is the title' }]
        },
        {
            title: '2024-01-30',
            data: [{ task_id: 3, title: 'Task 23, this is the title' }, { task_id: 4, title: 'Task 26, this is the title' }]
        },
        {
            title: '2024-02-15',
            data: [{ task_id: 3, title: 'Task 23, this is the title' }, { task_id: 4, title: 'Task 26, this is the title' }]
        }])
    }, [])

    const showEditPopUp = (id) => {
        //TODO const taskToEdit = { task_id: 1, title: 'Task 1, this is the title' }
        //tasks.find(task => task.task_id === id);
        if (taskToEdit) {
            setEditingTask([taskToEdit]);
            editRef.show();
        } else {
            console.error(`No se encontró la tarea con ID: ${id}`);
        }
    }

    const hideEditPopUp = () => {
        editRef.hide();
    }

    return (
        <NativeBaseProvider>
            <CalendarProvider date={utils.getFormattedDateCalendar(new Date())} showTodayButton>
                {/* MOVE MODAL   */}
                {/* <PopUpModal
                    title="Mover a"
                    ref={(target) => moveRef = target}
                    touch={hideMovePopUp}
                    data={popuplist}
                    mode='move'
                /> */}

                {/* EDIT MODAL   */}
                <PopUpModal
                    title="Editar"
                    ref={(target) => editRef = target}
                    touch={hideEditPopUp}
                    data={editingTask}
                    // onAccept={updateTask}
                    mode='edit'
                />

                {/* ADD MODAL   */}
                {/* <PopUpModal
                    title="Añadir"
                    ref={(target) => addRef = target}
                    touch={hideAddTaskPopUp}
                    data={[{ title: "" }]}
                    onAccept={addTask}
                    mode='add'
                /> */}
                <WeekCalendar testID={"weekCalendar"} firstDay={1} markedDates={marked.current} />
                <AgendaList
                    sections={tasks}
                    renderItem={(item, firstItemInDay) => {
                        console.log("THIS IS THE ITEM", item.item)
                        return (
                            <View style={styles.taskContainer}>
                                <SelectableTask task={item.item} selectedTasks={{ total: 0 }} showEditPopUp={showEditPopUp} />
                                {/* <Text>{item.title}</Text> */}
                            </View>
                        );
                    }}
                    markedDates={marked.current}

                    // renderSectionHeader={(info) => {
                    //     console.log("THIS IS INFO", info)
                    //     return (
                    //         <View style={styles.dayItem}>
                    //             <Text style={styles.dateText}>{utils.parseDatetoPretty(info)}</Text>
                    //             <View style={styles.horizontalLine} />
                    //         </View>
                    //     )
                    // }}

                    // scrollToNextEvent
                    sectionStyle={styles.section}
                // dayFormat={'yyyy-MM-d'}
                />
            </CalendarProvider>
        </NativeBaseProvider>
    )
}


export default ProgramadasScreen;