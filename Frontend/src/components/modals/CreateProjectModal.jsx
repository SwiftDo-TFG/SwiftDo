import PopUpModal from "./PopUpModal"
import { View, TextInput, TouchableOpacity, Modal, Text } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { useState, useEffect } from "react"
import * as React from 'react';
import { GithubPicker } from 'react-color'

function CreateProjectModal(props) {

    const [state, setState] = useState({
        show: false,
        editedTitle: '',
        editedDescription: '',
    });


    const Body = () => {
        const [title, setTitle] = useState(state.editedTitle);
        const [description, setDescription] = useState(state.editedDescription);
        const [color, setColor] = React.useState({});

        const onAcceptFunction = () => {
            const createProject = { title: title, description: description, color: color };

            // if (props.editingTask) {
            //     Object.keys(props.editingTask).forEach(key => {
            //         if (props.editingTask[key] !== null) {
            //             updatedTask[key] = props.editingTask[key];
            //         }
            //     });
            // }

            props.onAccept(createProject);
        }

        const onDescriptionChange = (text) => {
            setDescription(text)
        };

        const onTitleChange = (text) => {
            setTitle(text)
        };
        const onColorChange = (color) => {
            setColor(color.hex)
        };
        return (
            <>
                {/* Title */}
                <View style={{ alignItems: 'flex-start', marginLeft: 20, marginRight: 8 }}>
                    <TextInput
                        style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15, marginBottom: 10, width: '100%' }}
                        value={title}
                        placeholder="Nuevo Proyecto"
                        onChangeText={onTitleChange}
                        onEndEditing={() => { console.log("THIS END") }}
                        maxLength={50}
                        multiline={true}
                    />
                </View>
                {/* Description */}
                <View style={{ height: '100%', justifyContent: 'flex-end' }}>
                    <View style={{ height: '100%', marginLeft: 20, marginRight: 8 }}>
                        <View style={{ height: '50%' }}>
                            <TextInput
                                style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', }}
                                value={description}
                                placeholder="Descripcion..."
                                onChangeText={onDescriptionChange}
                                multiline={true}
                                maxLength={200}
                            />

                            <Text style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', marginBottom: 8}}> Color:</Text>
                            <GithubPicker onChangeComplete={ onColorChange }/>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'end', alignItems: 'center', marginTop: 13 }}>
                            <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={() => onAcceptFunction()}>
                                <Text style={styles.acceptButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </>
        );
    }

    function onCloseModal() {
        props.setIsModalOpen(false);
    }

    return (
        <PopUpModal isModalOpen={props.isModalOpen} onCloseModal={onCloseModal}>
            <Body />
        </PopUpModal>
    )
}


export default CreateProjectModal;