import * as React from 'react';
import projectService from '../../services/project/projectService';

import AuthContext from '../../services/auth/context/authContext';
import AppNavigator from './AppNavigator';



export default function Router(theme) {

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
          const isConfig = await state.checkServerConfigured();
          if(isConfig){
            state.checkSession();
          }
        };
        bootstrapAsync();
    
    }, []);

    return ( <AppNavigator theme={theme} projects={projects} state={state}/> );
}