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
                        theme: action.theme
                    };
            }
        },
        {
            theme: theme,
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
            }
        }),
        []
    );

    return (
        <ThemeContext.Provider
            value={{
                theme: state.theme,
                changeTheme: themeFunctions.changeTheme,
                setThemeOnInit: themeFunctions.setThemeOnInit
            }}
        >
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeState;
