import * as React from 'react';
import projectService from '../../services/project/projectService';

import AuthContext from '../../services/auth/context/authContext';
import AppNavigator from './AppNavigator';



export default function Router() {

    const state = React.useContext(AuthContext);
    
    const [projects, setProjects] = React.useState([])
    console.log("THIS IS THE AUTH STATE", state, state.userToken != null)
    React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
          let userToken;
    
          try {
            // Restore token stored in `SecureStore` or any other encrypted storage
            // userToken = await SecureStore.getItemAsync('userToken');
          } catch (e) {
            // Restoring token failed
          }
    
          // After restoring token, we may need to validate it in production apps
    
          // This will switch to the App screen or Auth screen and this loading
          // screen will be unmounted and thrown away.
          state.checkSession();
        };
        bootstrapAsync();
        const fetchData = async () => {
          try {
            
            const projectData = await projectService.showProjectsByUser(); // Informacion sin detallar
            const detailedProjects = await Promise.all(projectData.map(async project => { // Accedemos a una informacion mas detallada de cada proyecto
              const projectDetails = await projectService.showContent(project.project_id);
              return { ...project, completionPercentage: projectDetails.percentage };
            }));
            setProjects(detailedProjects);
            console.log("Detalles de los proyectos:", projects);
            // Hacer algo con los detalles de los proyectos, como guardarlos en el estado
          } catch (error) {
            console.error("Error al obtener los proyectos:", error);
          }
        };
        // fetchData();
    
    }, []);

    return ( <AppNavigator projects={projects} state={state}/> );
}