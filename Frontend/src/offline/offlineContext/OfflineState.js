import React from "react";
import OfflineContext from "./OfflineContext";

const OfflineState = props =>{

    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {

                case 'SET_OFFLINEMODE':
                    return {
                        isOffline: true,
                    };
                // case 'CLEAR_FILTER':
                //     return {
                //         context_id: null,
                //         context_name: null,
                //         isFiltered: false
                //     };
            }
        },
        {
            isOffline: false,
        }
    );

    const offlineModeFunctions = React.useMemo(
        () => ({
            setOfflineMode: ()=> {
                console.log("PASAMOS A MODO OFFLINE")

                dispatch({ type: 'SET_OFFLINEMODE'})
            }
        }),
        []
    );

    return (
        <OfflineContext.Provider
            value={{
                setOfflineMode: offlineModeFunctions.setOfflineMode,
                isOffline: state.isOffline,
            }}
        >
            {props.children}
        </OfflineContext.Provider>
    )
}

export default OfflineState;