import { createDrawerNavigator } from '@react-navigation/drawer';
import Inbox from '../../screens/actions/inbox';
import CuantoAntes from '../../screens/actions/cuantoAntes';
import Programadas from '../../screens/programadas/programadas';
import Archivadas from '../../screens/actions/archivadas';
import Project from '../../screens/actions/project';
import Today from '../../screens/actions/today';
import SideBar from '../SideBar/SideBar';
import { sidebarStyles } from '../../styles/globalStyles';
import { useColorScheme, useWindowDimensions } from 'react-native';
import AuthNavigator from './AuthNavigator';
import Colors from '../../styles/colors';
import DetailScreen from '../../screens/details/details';
import ThemeContext from '../../services/theme/ThemeContext';
import OfflineContext from '../../offline/offlineContext/OfflineContext';
import { useContext, useEffect, useRef } from 'react';
import SettingsModal from '../modals/settings/SettingsModal';
import Tutorial from '../../screens/tutorial/tutorial';
import { AppState } from 'react-native';
import deviceStorage from '../../offline/deviceStorage';

const Drawer = createDrawerNavigator();

const AppNavigator = ({ projects, state }) => {
    const dimensions = useWindowDimensions();

    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const sideBar = sidebarStyles(theme)

    const offlineContext = useContext(OfflineContext);

    useEffect(() => {

        if (state.userToken !== null) {
            themeContext.setThemeOnInit();
        }

    }, [state])

    return (
        <Drawer.Navigator
            drawerStyle={sideBar.dims}
            drawerContent={(props) => state.userToken != null ? <SideBar {...props} projectAttributes={projects} /> : <></>}
            gestureEnabled={state.userToken != null}
            screenOptions={{
                drawerType: (dimensions.width >= 768 && state.userToken != null) ? 'permanent' : 'front',
                drawerStyle: {
                    backgroundColor: theme === 'dark' ? '#222022' : Colors[theme].themeColor,
                    // width: '80%'
                },
            }}
            backBehavior="history"
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
                            headerShown: false,
                            animationTypeForReplace: 'push',
                        }}
                    />
                    <Drawer.Screen
                        name="Today"
                        component={Today}
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
                    {/* Detalles */}
                    <Drawer.Screen
                        name={"Details"}
                        component={DetailScreen}
                        options={{
                            headerShown: false,
                            animationTypeForReplace: 'push',
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
                    {/* Tutorial */}
                    <Drawer.Screen
                        name={"Tutorial"}
                        component={Tutorial}
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