import createDataContext from "./createDataContext";

const reducer = (state, action) => {
    console.log(action);
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
                uid: action.payload.uid,
                name: action.payload.displayName,
                email: action.payload.email,
                photo_img: action.payload.photoURL,
                token: action.payload.token,
            };
        }
        case "set_uid": {
            return { ...state, uid: action.payload };
        }
        case "set_photo_img": {
            return { ...state, photo_img: action.payload };
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
        // console.log(newName);
        dispatch({ type: "set_name", payload: newName });
    };
};

const setEmail = (dispatch) => {
    return (newEmail) => {
        // console.log(newEmail);
        return dispatch({ type: "set_email", payload: newEmail });
    };
};

const setUID = (dispatch) => {
    return (newUID) => {
        console.log("uid", newUID);
        return dispatch({ type: "set_uid", payload: newUID });
    };
};

const setPhotoImg = (dispatch) => {
    return (new_photo_img) => {
        // console.log("photo", new_photo_img);
        return dispatch({ type: "set_photo_img", payload: new_photo_img });
    };
};

const setError = (dispatch) => {
    return (errorMsg) => {
        // console.log('')
        return dispatch({ type: "set_error", payload: errorMsg });
    };
};

const setUserDetails = (dispatch) => {
    return (user_details) => {
        // console.log('')
        localStorage.setItem("USER_DETAILS", JSON.stringify(user_details));
        return dispatch({ type: "set_user_details", payload: user_details });
    };
};

const tryLocalLogin = (dispatch) => {
    return (onFound, onNotFound) => {
        // console.log('')
        const dataStr = localStorage.getItem("USER_DETAILS");
        if (dataStr) {
            const user_details = JSON.parse(dataStr);
            onFound();
            return dispatch({ type: "set_user_details", payload: user_details });
        } else {
            onNotFound();
            return dispatch({ type: "" });
        }
    };
};

const clearUserData = (dispatch) => {
    return () => {
        localStorage.removeItem("USER_DETAILS");
        return dispatch({ type: "clear_data" });
    };
};

export const { Context, Provider } = createDataContext(
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
        name: undefined,
        email: undefined,
        uid: undefined,
        photo_img: undefined,
        error: undefined,
        token: undefined,
    }
);
