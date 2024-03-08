
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from "../../styles/colors";
import { actStyle } from "../../styles/globalStyles";
import PopUpModal from "../../components/modals/PopUpModal";
import { useState } from "react";

function CuantoAntes(props) {
    //TEMPORAL
    const [modal, setModal] = useState(true)
    return (
        <ActionScreen {...props} state={TaskStates.CUANTO_ANTES} emptyIcon={<FontAwesome5 style={actStyle.emptyIcon} name="bolt" color={Colors.grey}/>}>
            <View style={actStyle.action}>
                <FontAwesome5 name="bolt" style={actStyle.iconAction} color={'#ffd700'} />
                <Text style={actStyle.actionTitle}>Cuanto antes</Text>
                {/* <PopUpModal isModalOpen={modal} setIsModalOpen={setModal}>
                    <Text>Gola Buenas tardes</Text>
                </PopUpModal> */}
            </View>
        </ActionScreen>
    )
}


export default CuantoAntes;