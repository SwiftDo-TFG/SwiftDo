import React, { useState, useRef, useEffect, useContext } from "react";
import taskService from "../../services/task/taskService";
import { View, Text, Animated, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { FontAwesome5, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { NativeBaseProvider, VStack, Box, Menu, extendTheme, Checkbox, Center } from "native-base";
import Swipeable from 'react-native-gesture-handler/Swipeable';

import styles from './actionScreen.styles'
import { PopUpModal } from "../../components/PopUpModal";
import AuthContext from '../../services/auth/context/authContext';

const getTaskItemStyle = () => {
  return {
    ...styles.taskContainer,
  };
};

const LeftSwipeActions = (showMovePopUp, id, isMenuVisible) => {
  // const width = translateX.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['30%', '100%'],
  //   extrapolate: 'clamp',
  // });
  // const borderTopRightRadius = translateX.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, 10],
  //   extrapolate: 'clamp',
  // });
  // const borderBottomRightRadius = translateX.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, 10],
  //   extrapolate: 'clamp',
  // });

  return (
    // <Animated.View
    <TouchableOpacity
      // style={[styles.leftSwipe, { borderTopRightRadius }, { borderBottomRightRadius }]}
      style={[styles.leftSwipe, {height: (isMenuVisible ? 'auto' : 52)}]}
      onPress={() => showMovePopUp(id)}
    >
      <Text>
        <Entypo name="archive" size={20} color="white" />
      </Text>
    </TouchableOpacity>
  );
};

const RightSwipeActions = ({ onDelete, id, translateX, isMenuVisible }) => {
  return (
    <TouchableOpacity
      style={[styles.rightSwipe, { transform: [{ translateX: translateX }], height: (isMenuVisible ? 'auto' : 52)}]}
      onPress={() => onDelete(id)}
    >
      <Text>
        <FontAwesome5
          name="trash"
          size={20}
          color="white"
        />
      </Text>
    </TouchableOpacity>
  );
};

function formattedDate(date) {
  const dateLimit = new Date(date)
  const year = dateLimit.getFullYear();
  const month = (dateLimit.getMonth() + 1).toString().padStart(2, '0');
  const day = dateLimit.getDate().toString().padStart(2, '0');
  const hours = dateLimit.getHours().toString().padStart(2, '0');
  const minutes = dateLimit.getMinutes().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

function recortarTitle(title){
  let t = title;
  return `${t.substring(0, 20)}...`;
}

const SelectableTask = ({ task, onPress, onDelete, scale, opacity, selectedTasks, showMovePopUp, showEditPopUp }) => {
  const [isSwiped, setIsSwiped] = useState(true);
  const translateX = useRef(new Animated.Value(0)).current;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const leftActions = selectedTasks.total > 0 ? () => null : () => LeftSwipeActions(showMovePopUp, task.task_id, isMenuVisible);
  const rightActions = selectedTasks.total > 0 ? () => null : () => RightSwipeActions({ onDelete, id: task.task_id, translateX, isMenuVisible });
  // const backgroundTask = translateX.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['#f2f2f2', 'rgba(0, 0, 0, 0)'],
  //   extrapolate: 'clamp',
  // });
  

  useEffect(() => {
    const subscription = translateX.addListener(({ value }) => {
      // setIsSwiped(value === 0);
    });

    return () => {
      translateX.removeListener(subscription);
    };
  }, [translateX]);


  return (<Swipeable
    renderLeftActions={leftActions}
    renderRightActions={rightActions}
    onSwipeableClose={selectedTasks.total > 0 ? () => null : () => {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }}
    overshootLeft={false}
    overshootRight={false}
    onSwipeableLeftWillOpen={selectedTasks.total > 0 ? () => null : () => {
      Animated.timing(translateX, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          //ArchiveTask(id, title);
        }, 200);
      });
    }}
    onSwipeableLeftWillClose={selectedTasks.total > 0 ? () => null : () => {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }}
    friction={2}
  >
    <TouchableWithoutFeedback
      // onLongPress={() => onPress(id)}
      onPress={() => {
        // if (isSelected) onPress(id);
        setIsMenuVisible(!isMenuVisible);
      }}
    >
      <Animated.View style={[getTaskItemStyle(), { backgroundColor: selectedTasks[task.task_id] ? '#ebd7b5' : (isMenuVisible ? '#bdecb6' : '#f2f2f2'), transform: [{ scale }], opacity, height: (isMenuVisible && !selectedTasks[task.task_id] ? 'auto' : 52) }]}>
        {isSwiped && (
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.innerContainer}>
              <View style={[
                { flex: 1 },
                { flexDirection: 'row' },
                { alignItems: 'center' },
                (!selectedTasks[task.task_id] && isMenuVisible) ? null : { marginRight: 20 }
              ]}>
                <TouchableOpacity onPress={() => { onPress(task.task_id) }} style={{ marginRight: '5%' }}>
                  {!selectedTasks[task.task_id] && (
                    <FontAwesome name="circle-o" size={24} color="#a0a0a0" />
                  )}
                  {selectedTasks[task.task_id] && (
                    <FontAwesome name="check-circle" size={24} color="#f39f18" />
                  )}
                </TouchableOpacity>
                <Text style={{ fontWeight: (isMenuVisible && !selectedTasks[task.task_id] ? 'bold' : 'normal'), marginRight: '5%' }}>
                  {(task.title.length > 37 && (!isMenuVisible || selectedTasks[task.task_id])) ? `${task.title.substring(0, 30)}...` : task.title}
                </Text>
              </View>
              <View
                style={[
                  { flexDirection: 'row' },
                ]}>
                {task.important_fixed && (
                  <Ionicons name="flag" size={22} color="#be201c" />
                )}
              </View>
            </View>
            {!selectedTasks[task.task_id] && isMenuVisible && (
              // <Menu
              //   trigger={(triggerProps) => (
              //     <TouchableOpacity {...triggerProps}>
              //       <Entypo name="dots-three-vertical" size={20} color="#a0a0a0" />
              //     </TouchableOpacity>
              //   )}
              //   style={styles.menuContainer}
              //   placement="left"
              // >
              //   <Menu.Item style={styles.menuItem} onPress={() => showMovePopUp(task.task_id)}>Mover a</Menu.Item>
              //   {/* <Separator /> */}
              //   <Menu.Item style={styles.menuItem}
              //     onPress={() => { showEditPopUp(task.task_id) }}>
              //     Editar
              //   </Menu.Item>
              // </Menu>
              <View style={{flexDirection: 'column'}}>
                <View style={{ marginLeft: '11%' }}>
                  <Text>{task.description}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, width: '100%', justifyContent: 'flex-end' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: task.date_limit ? '100%' : 'auto' }}>
                    {task.date_limit && (
                      <Text style={{ fontSize: 12 }}>
                        <Ionicons name="calendar-outline" size={16} color="#008080" />
                        &nbsp; {formattedDate(task.date_limit)}
                      </Text>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity onPress={() => showEditPopUp(task.task_id)}>
                        <MaterialCommunityIcons name="circle-edit-outline" size={22} color="#ffa540" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => showMovePopUp(task.task_id)}>
                        <Entypo name="archive" size={22} color="#15ba53" style={{ marginLeft: 6 }} />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Octicons name="trash" size={22} color="red" style={{ marginLeft: 6 }} />
                        {/* <FontAwesome5 name="trash" size={18} color="red" style={{ marginLeft: 6 }} /> */}
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* <Text>
                    <FontAwesome5 name="user" size={22} color="#a0a0a0" />
                  </Text>
                  <Text>
                    <MaterialCommunityIcons name="file-document-outline" size={23} color="#a0a0a0" />
                  </Text>
                  <Text>
                    <MaterialCommunityIcons name="tag-outline" size={23} color="#a0a0a0" />
                  </Text> */}
                </View>
              </View>
            )}
          </View>
        )}
      </Animated.View >
    </TouchableWithoutFeedback>
  </Swipeable>)
};

export default SelectableTask;