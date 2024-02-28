import { useMemo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Inbox from '../../screens/actions/inbox';
import CuantoAntes from '../../screens/actions/cuantoAntes';
import Programadas from '../../screens/programadas/programadas';
import Archivadas from '../../screens/actions/archivadas';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Project from '../../screens/actions/project';
import SideBar from '../SideBar/SideBar';
import { sideBar } from '../../styles/globalStyles';
import { useWindowDimensions } from 'react-native';
import AuthNavigator from './AuthNavigator';
import AboutApp from '../../screens/settings/aboutapp'
import Intro from '../../screens/settings/introduction/intro'

const Drawer = createDrawerNavigator();

const AppNavigator = ({ projects, state }) => {
    const dimensions = useWindowDimensions();

    const addProjects = useMemo(() => {
        return projects.map((project, i) => (
            <Drawer.Screen
                key={i}
                name={project.title}
                initialParams={{ id: project.project_id, color: project.color, description: project.description, percentage: project.completionPercentage }}
                component={Project}
                options={{
                    title: project.title,
                    headerShown: false
                }}
            />))
    }, [projects])

    return (
        <Drawer.Navigator
            drawerStyle={sideBar.dims}
            drawerContent={(props) => state.userToken != null ? <SideBar {...props} projectAttributes={projects} /> : <></>}
            gestureEnabled={state.userToken != null}
            screenOptions={{
                drawerType: (dimensions.width >= 768 && state.userToken != null) ? 'permanent' : 'front',
            }}
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
                    {/* Settings */}
                    <Drawer.Screen
                        name="Intro"
                        component={Intro}
                        options={{
                            title: 'Intro',
                            headerShown: false,
                            swipeEnabled: false
                        }} />
                    <Drawer.Screen
                        name="AboutApp"
                        component={AboutApp}
                        options={{
                            title: 'AboutApp',
                            headerShown: false
                        }} />
                    {/* Actions: */}
                    <Drawer.Screen
                        name="Inbox"
                        component={Inbox}
                        options={{
                            title: 'Inbox',
                            drawerIcon: () => (
                                <FontAwesome5 name="inbox" size={24} color={'orange'} />
                            ),
                            headerShown: false
                        }}
                    />
                    <Drawer.Screen
                        name="CuantoAntes"
                        component={CuantoAntes}
                        options={{
                            title: 'Cuanto antes',
                            headerShown: false
                        }}
                    />
                    <Drawer.Screen
                        name="Archivadas"
                        component={Archivadas}
                        options={{
                            title: 'Archivadas',
                            headerShown: false
                        }}
                    />
                    {/* Proyectos: */}
                    <Drawer.Screen
                        name="Programadas"
                        component={Programadas}
                        options={{
                            title: 'Programadas',
                            drawerIcon: () => (
                                <FontAwesome5 name="calendar" size={24} color={'cyan'} />
                            ),
                            headerShown: false
                        }}
                    />
                    {addProjects}
                </>
            )}
        </Drawer.Navigator>
    )
}

export default AppNavigator;