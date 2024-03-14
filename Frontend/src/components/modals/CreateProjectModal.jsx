import PopUpModal from "./PopUpModal"
import { View, TextInput, TouchableOpacity, Modal, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from "react-native"

import styles from '../../screens/tasks/actionScreen.styles'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from "react"
import * as React from 'react';
import ColorPicker from 'react-native-wheel-color-picker'
function CreateProjectModal(props) {
    console.log('PROPIEDADESSSS PROJECT MODAL');


    const [state, setState] = useState({
        show: false,
        editedTitle: '',
        editedDescription: '',
        editedColor: '#000000'
    });

    function setValuesToEdit() {
        console.log('PROPIEDADESSSSSSS:', props.editingProject);
        if (props.editingProject) {
            setState({
                ...state,
                editedTitle: props.editingProject.title ? props.editingProject.title : '',
                editedDescription: props.editingProject.description ? props.editingProject.description : '',
                editedColor: props.editingProject.color ? props.editingProject.color : '#000000',
            })
        }
    }

    const Body = () => {
        const [title, setTitle] = useState(state.editedTitle);
        const [description, setDescription] = useState(state.editedDescription);
        const [color, setColor] = useState(state.editedColor);

        const onAcceptFunction = () => {
            let createProject = {};
            if (props.editingProject) {
                Object.keys(props.editingProject).forEach(key => {
                    if (props.editingProject[key] !== null) {
                        createProject[key] = props.editingProject[key];
                    }
                });
            }

            createProject = { ...createProject, title: title, color: color };
            if (description)
                createProject.description = description;
            props.onAccept(createProject);
        }

        const onDescriptionChange = (text) => {
            setDescription(text)
        };

        const onTitleChange = (text) => {
            setTitle(text)
        };
        const onColorChange = (color) => {
            setColor(color)
        };
        return (
            <>
                {/* Title */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 20, marginLeft: 20, marginRight: 8, marginBottom: 10 }}>
                    <MaterialCommunityIcons name="circle-outline" size={26} color={color} />
                    <TextInput
                        style={styles.textInputTitleProject}
                        value={title}
                        placeholder="Nuevo Proyecto"
                        onChangeText={onTitleChange}
                        onEndEditing={() => { console.log("THIS END") }}
                        maxLength={50}
                        multiline={true}
                    />
                </View>
                {/* Description */}
                <View style={{ flex: 1, justifyContent: 'space-between', marginHorizontal: 15}}>
                    <View>
                        <TextInput
                            style={styles.textInput}
                            value={description}
                            placeholder="Descripcion..."
                            onChangeText={onDescriptionChange}
                            multiline={true}
                            maxLength={200}
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: 600, color: '#182E44', marginBottom: 15 }}>Selecciona un color: </Text>
                        <ColorPicker
                            color={color}
                            swatchesOnly={true}
                            onColorChangeComplete={onColorChange}
                            palette={['#000000', '#808080', '#A52A2A', '#FF0000', '#FFA500', '#FFFF00', '#0000FF', '#008000', '#EE82EE', '#FFC0CB',]}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 40, marginBottom: 10}}>
                            <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={() => onAcceptFunction()}>
                                <Text style={styles.acceptButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* <View>
                    <View style={{ height: '100%', marginLeft: 20, marginRight: 8 }}>

                    </View>
                </View> */}
            </>
        );
    }

    function onCloseModal() {
        props.setIsModalOpen(false);
    }

    return (
        <PopUpModal isModalOpen={props.isModalOpen} onCloseModal={onCloseModal} onShow={setValuesToEdit} setIsModalVisible={props.setIsModalOpen}>
            <KeyboardAvoidingView style={{ flex: 1, width: 700, height: 300 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Body />
            </KeyboardAvoidingView>
        </PopUpModal >
    )
}


export default CreateProjectModal;