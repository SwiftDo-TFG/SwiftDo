import { useMemo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Inbox from '../../screens/actions/inbox';
import CuantoAntes from '../../screens/actions/cuantoAntes';
import Programadas from '../../screens/programadas/programadas';
import Archivadas from '../../screens/actions/archivadas';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Project from '../../screens/actions/project';
import SideBar from '../SideBar/SideBar';
import { sidebarStyles } from '../../styles/globalStyles';
import { useColorScheme, useWindowDimensions } from 'react-native';
import AuthNavigator from './AuthNavigator';
import Colors from '../../styles/colors';
import DetailScreen from '../../screens/details';

const Drawer = createDrawerNavigator();

const AppNavigator = ({projects, state }) => {
    const dimensions = useWindowDimensions();
    const theme = useColorScheme();
    const sideBar = sidebarStyles(theme)

    return (
        <Drawer.Navigator
            drawerStyle={sideBar.dims}
            drawerContent={(props) => state.userToken != null ? <SideBar {...props} projectAttributes={projects} /> : <></>}
            gestureEnabled={state.userToken != null}
            screenOptions={{
                drawerType: (dimensions.width >= 768 && state.userToken != null) ? 'permanent' : 'front',
                drawerStyle: {
                    backgroundColor: theme === 'dark' ? 'black' : Colors[theme].themeColor,
                    // width: '80%'
                },
            }}
            defaultStatus={(state.userToken != null && dimensions.width >= 768) ? "open" : "closed"} 
        >
            {state.userToken == null ? (
                // No token found, user isn't signed in
                <>
                    <Drawer.Screen options={{ headerShown: false }} name='Test'>
                        {() => <AuthNavigator state={state} />}
                    </Drawer.Screen>
                </>
            ) : (
                // User is signed in
                <>
                    {/* Actions: */}
                    <Drawer.Screen
                        name="Inbox"
                        component={Inbox}
                        options={{
                            headerShown: false
                        }}
                    />
                    <Drawer.Screen
                        name="CuantoAntes"
                        component={CuantoAntes}
                        options={{
                            headerShown: false
                        }}
                    />
                    <Drawer.Screen
                        name="Archivadas"
                        component={Archivadas}
                        options={{
                            headerShown: false
                        }}
                    />
                    {/* Proyectos: */}
                    <Drawer.Screen
                        name="Programadas"
                        component={Programadas}
                        options={{
                            headerShown: false
                        }}
                    />
                    {/* {addProjects} */}
                    <Drawer.Screen
                        name={"project"}
                        component={Project}
                        options={{
                            headerShown: false
                        }}
                    />
                    {/* Detalles */}
                    <Drawer.Screen 
                        name={"Details"}
                        component={DetailScreen}
                        options={{
                            headerShown: false
                        }}
                    />
                </>
            )}
        </Drawer.Navigator>
    )
}

export default AppNavigator;