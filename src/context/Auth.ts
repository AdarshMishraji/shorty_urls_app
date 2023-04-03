import jwtDecode from "jwt-decode";

import createDataContext from "./createDataContext";

const reducer = (state, action) => {
    switch (action.type) {
        case "set_name": {
            return { ...state, name: action.payload };
        }
        case "set_email": {
            return { ...state, email: action.payload };
        }
        case "set_user_details": {
            return {
                ...state,
                ...action.payload,
            };
        }
        case "set_uid": {
            return { ...state, uid: action.payload };
        }
        case "set_profile_img": {
            return { ...state, profile_img: action.payload };
        }
        case "set_error": {
            return { ...state, error: action.payload };
        }
        case "clear_data": {
            return {};
        }
        default: {
            return state;
        }
    }
};

const setName = (dispatch) => {
    return (newName) => {
        dispatch({ type: "set_name", payload: newName });
    };
};

const setEmail = (dispatch) => {
    return (newEmail) => {
        return dispatch({ type: "set_email", payload: newEmail });
    };
};

const setUID = (dispatch) => {
    return (newUID) => {
        return dispatch({ type: "set_uid", payload: newUID });
    };
};

const setPhotoImg = (dispatch) => {
    return (new_photo_img) => {
        return dispatch({ type: "set_profile_img", payload: new_photo_img });
    };
};

const setError = (dispatch) => {
    return (errorMsg) => {
        return dispatch({ type: "set_error", payload: errorMsg });
    };
};

const setUserDetails = (dispatch) => {
    return ({ token }) => {
        localStorage.setItem("TOKEN", token);
        return dispatch({ type: "set_user_details", payload: { ...jwtDecode(token), token } });
    };
};

const tryLocalLogin = (dispatch) => {
    return (onFound, onNotFound) => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            onFound();
            return dispatch({ type: "set_user_details", payload: { ...jwtDecode(token), token } });
        } else {
            onNotFound();
            return dispatch({ type: "" });
        }
    };
};

const clearUserData = (dispatch) => {
    return () => {
        localStorage.removeItem("TOKEN");
        return dispatch({ type: "clear_data" });
    };
};

const { Context, Provider } = createDataContext(
    reducer,
    {
        setName,
        setEmail,
        setUID,
        setPhotoImg,
        setUserDetails,
        tryLocalLogin,
        setError,
        clearUserData,
    },
    {
        uid: undefined,
        name: undefined,
        email: undefined,
        email_verified: undefined,
        profile_img: undefined,
        error: undefined,
        last_login_at: undefined,
        joined_at: undefined,
        token: undefined,
    }
);

export { Context as AuthContext, Provider as AuthProvider };
