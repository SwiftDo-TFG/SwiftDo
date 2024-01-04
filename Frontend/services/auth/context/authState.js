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
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    );

    const authFunctions = React.useMemo(
        () => ({
            signIn: async (data) => {
                dispatch({ type: 'LOADING'});
                const token = await authService.login(data.email, data.password);
                
                if(token != null){
                    token.expires_at = new Date(Date.now() + token.expires_in*1000);
                    tokenStorage.storeToken(token);
                    dispatch({ type: 'SIGN_IN', token: token.access_token });
                }else{
                    dispatch({ type: 'SIGN_OUT' })
                    return -1;
                }
            },
            signOut: async() => {
                tokenStorage.removeToken();
                auth_utils.clearToken();
                dispatch({ type: 'SIGN_OUT' })
            },
            signUp: async (data) => {
                // In a production app, we need to send user data to server and get a token
                // We will also need to handle errors if sign up failed
                // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
                // In the example, we'll use a dummy token
                
                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
            checkSession: async () => {
                const token = await tokenStorage.getToken();
                console.log("checkSession", token)

                if(token){
                    dispatch({ type: 'SIGN_IN', token: token.access_token });
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
