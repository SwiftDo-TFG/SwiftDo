import PopUpModal from "./PopUpModal"
import { View, TextInput, TouchableOpacity, Modal, Text } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { useState, useEffect } from "react"
import * as React from 'react';
import ColorPicker from 'react-native-wheel-color-picker'
function CreateProjectModal(props) {

    const [state, setState] = useState({
        show: false,
        editedTitle: '',
        editedDescription: '',
    });


    const Body = () => {
        const [title, setTitle] = useState(state.editedTitle);
        const [description, setDescription] = useState(state.editedDescription);
        const [color, setColor] = React.useState('#000000');

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
            setColor(color)
        };
        return (
            <>
                {/* Title */}
                <View style={{ flexDirection: 'row', justifyContent: 'start', alignItems: 'flex-start', marginTop: 20, marginLeft: 20, marginRight: 8 }}>

                    <MaterialCommunityIcons name="hexagon-slice-6" size={26} color={color} />
                    <TextInput
                        style={{ color: '#182E44', fontSize: 23, fontWeight: '500', width: '100%', marginLeft: 10 }}
                        value={title}
                        placeholder="Nuevo Proyecto"
                        onChangeText={onTitleChange}
                        onEndEditing={() => { console.log("THIS END") }}
                        maxLength={50}
                        multiline={true}
                    />
                </View>
                {/* Description */}
                <View style={{ height: '100%', justifyContent: 'flex-start' }}>
                    <View style={{ height: '70%', marginLeft: 20, marginRight: 8 }}>
                            <TextInput
                                style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', }}
                                value={description}
                                placeholder="Descripcion..."
                                onChangeText={onDescriptionChange}
                                multiline={true}
                                maxLength={200}
                            />
                            <Text style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', marginBottom: 8 }}> Color: </Text>
                                <ColorPicker
                                    color={color}
                                    swatchesOnly={true}
                                    onColorChangeComplete={onColorChange}
                                    palette={['#000000', '#808080', '#A52A2A', '#FF0000', '#FFA500', '#FFFF00', '#0000FF', '#008000', '#EE82EE', '#FFC0CB', ]}
                                />
                        

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