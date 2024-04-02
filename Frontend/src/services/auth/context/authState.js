import React from "react";
import AuthContext from "./authContext";
import authService from "../auth"
import auth_utils from "../auth_utils";
import tokenStorage from "../token_store/storage"


const AuthState = props => {
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                        isLoading: false
                    };
                case 'LOADING':
                    return {
                        ...prevState,
                        isLoading: true
                    }
            }
        },
        {
            isLoading: false,
            isSignout: false,
            userToken: null,
        }
    );

    const authFunctions = React.useMemo(
        () => ({
            signIn: async (data) => {
                dispatch({ type: 'LOADING' });
                const token = await authService.login(data.email, data.password);

                if (token != null) {
                    token.expires_at = new Date(Date.now() + token.expires_in * 1000);
                    tokenStorage.storeToken(token);
                    dispatch({ type: 'SIGN_IN', token: token.access_token });
                } else {
                    dispatch({ type: 'SIGN_OUT' })
                    return -1;
                }
            },
            signOut: async () => {
                tokenStorage.removeToken();
                auth_utils.clearToken();
                dispatch({ type: 'SIGN_OUT' })
            },
            signUp: async (data) => {
                //dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
            checkSession: async () => {
                const token = await tokenStorage.getToken();
                console.log("checkSession", token)
                
                if (token) {
                    const expired = Date.now() > (Date.parse(token.expires_at) ?? Date.now())
                    console.log("checkSession", token.expires_at, token.expires_in)

                    if (!expired) {
                        dispatch({ type: 'SIGN_IN', token: token.access_token });
                    } else {
                        //restore token
                        const newToken = await authService.restoreToken(token)
                        console.log("checkSession newToken", newToken)

                        if (newToken) {
                            newToken.expires_at = new Date(Date.now() + token.expires_in * 1000);
                            await tokenStorage.storeToken(newToken);
                            dispatch({ type: 'SIGN_IN', token: newToken.access_token });
                        } else {
                            dispatch({ type: 'SIGN_OUT' })
                        }
                    }
                }else{
                    dispatch({ type: 'SIGN_OUT' })
                }
            }
        }),
        []
    );

    return (
        <AuthContext.Provider
            value={{
                signIn: authFunctions.signIn,
                signOut: authFunctions.signOut,
                signUp: authFunctions.signUp,
                checkSession: authFunctions.checkSession,
                isLoading: state.isLoading,
                isSignout: state.isSignout,
                userToken: state.userToken
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState;
