import createDataContext from "./createDataContext";

enum ThemeStateEnum {
    LIGHT = "LIGHT",
    DARK = "DARK",
}

const reducer = (state, action) => {
    switch (action.type) {
        case "set_theme": {
            return { ...state, theme: action.payload };
        }
        default: {
            return state;
        }
    }
};

const setTheme = (dispatch) => {
    return (theme: ThemeStateEnum) => {
        localStorage.setItem("THEME", theme);
        dispatch({ type: "set_theme", payload: theme });
    };
};

const defaultValue= {
    theme: ThemeStateEnum.LIGHT,
}

const { Context, Provider } = createDataContext(
    reducer,
    {
        setTheme,
    },
    defaultValue
);

export { Context as ThemeContext, Provider as ThemeProvider };
