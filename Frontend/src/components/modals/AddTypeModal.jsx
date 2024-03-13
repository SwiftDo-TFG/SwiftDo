import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "../windows/Modal";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, useColorScheme } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import Colors from "../../styles/colors";



const AddTypeModal = (props) =>{
    const theme = useColorScheme();
    return(
        <Modal
            visible={props.isModalVisible}
            transparent={true}
            animationType={"fade"}
            {...props}
          >
            <TouchableWithoutFeedback onPress={() => props.setIsModalVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={[styles.modalStyle, {backgroundColor: Colors[theme].paper}]}>
                  <TouchableOpacity onPress={() => {
                    props.setIsModalVisible(false)
                    props.showAddTaskPopUp()
                  }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <MaterialCommunityIcons style={{ marginRight: 10 }} name="checkbox-intermediate" size={26} color={Colors[theme].white} />
                      <Text style={{ color: Colors[theme].white, fontSize: 17, fontWeight: 'bold'}}>
                        Tarea
                      </Text>
                    </View>
                    <View style={{ marginBottom: 20, marginLeft: 6 }}>
                      <Text style={{ color: Colors[theme].white }}>Organiza y estructura las acciones y actividades que tienes previsto llevar a cabo.</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    props.setIsModalVisible(false)
                    props.setIsCreateProjectOpen(true);
                  }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <MaterialCommunityIcons style={{ marginRight: 10 }} name="circle-slice-8" size={26} color={Colors[theme].white} />
                      <Text style={{ color: Colors[theme].white, fontSize: 17, fontWeight: 'bold'}}>
                        Proyecto
                      </Text>
                    </View>
                    <View style={{ marginLeft: 6 }}>
                      <Text style={{ color: Colors[theme].white }}>Planifica tus actividades para progresar de manera metódica y alcanza cada objetivo en tu proyecto GTD.</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
    )
}


export default AddTypeModal