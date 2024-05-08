import React from "react";
import ThemeContext from "./ThemeContext"
import { useColorScheme } from "react-native";
import configStorage from "../configStorage/configStorage";


const ThemeState = props => {
    const theme = useColorScheme();

    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {

                case 'CHANGE_THEME':
                    return {
                        ...prevState,
                        theme: action.theme
                    };
                case 'OPEN_MODAL_SETTINGS':
                    return {
                        ...prevState,
                        isSettingsModalOpen: true
                    };
                case 'CLOSE_MODAL_SETTINGS':
                    return {
                        ...prevState,
                        isSettingsModalOpen: false
                    };
            }
        },
        {
            theme: theme,
            isSettingsModalOpen: false
        }
    );

    const themeFunctions = React.useMemo(
        () => ({
            changeTheme: (newTheme) =>{
                if(newTheme === 'light' || newTheme == 'dark'){
                    dispatch({ type: 'CHANGE_THEME', theme: newTheme})
                    configStorage.storeConfig("theme", newTheme)
                }
            },
            setThemeOnInit: async () =>{
                const config = await configStorage.getUserConfig();
                const newTheme = (config && config.theme) ? config.theme: theme;
                console.log("THIS IS THE THEME STORED IN DEVICE", config)

                if(newTheme === 'light' || newTheme == 'dark'){
                    dispatch({ type: 'CHANGE_THEME', theme: newTheme})
                }
            },
            openSettingsModal: () =>{
                dispatch({ type: 'OPEN_MODAL_SETTINGS'})
            },
            closeSettingsModal: () =>{
                dispatch({ type: 'CLOSE_MODAL_SETTINGS'})
            }
        }),
        []
    );

    return (
        <ThemeContext.Provider
            value={{
                theme: state.theme,
                changeTheme: themeFunctions.changeTheme,
                setThemeOnInit: themeFunctions.setThemeOnInit,
                openSettingsModal: themeFunctions.openSettingsModal, 
                closeSettingsModal: themeFunctions.closeSettingsModal, 
                isSettingsModalOpen: state.isSettingsModalOpen,
            }}
        >
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeState;
