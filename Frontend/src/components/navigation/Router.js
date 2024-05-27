import * as React from 'react';
import projectService from '../../services/project/projectService';

import AuthContext from '../../services/auth/context/authContext';
import AppNavigator from './AppNavigator';
import { AppState } from 'react-native';
import OfflineContext from '../../offline/offlineContext/OfflineContext';
import deviceStorage from '../../offline/deviceStorage';


export default function Router(theme) {

  const state = React.useContext(AuthContext);
  const offlineContext = React.useContext(OfflineContext);

  const [projects, setProjects] = React.useState([])
  console.log("THIS IS THE AUTH STATE", state, state.userToken != null)

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place

    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('AppState', nextAppState);
      if(nextAppState === 'background'){
        offlineContext.storeCatchedIndevice(offlineContext.catchedContent, {}, offlineContext.nextNewIndex);
      }
    });

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
      if (isConfig) {
        await offlineContext.setInitialCatchedContext();
        state.checkSession();
      }
    };
    bootstrapAsync();
    return () => {
      subscription.remove();
    };
  }, []);

  return (<AppNavigator theme={theme} projects={projects} state={state} />);
}