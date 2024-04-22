import React from "react";
import ThemeContext from "./ThemeContext"
import { useColorScheme } from "react-native";



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
                }
            }
        }),
        []
    );

    return (
        <ThemeContext.Provider
            value={{
                theme: state.theme,
                changeTheme: themeFunctions.changeTheme
            }}
        >
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeState;
