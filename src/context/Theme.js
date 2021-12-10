import createDataContext from "./createDataContext";

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
    return (theme) => {
        localStorage.setItem("THEME", theme);
        dispatch({ type: "set_theme", payload: theme });
    };
};

const { Context, Provider } = createDataContext(
    reducer,
    {
        setTheme,
    },
    {
        theme: "light",
    }
);

export { Context as ThemeContext, Provider as ThemeProvider };
