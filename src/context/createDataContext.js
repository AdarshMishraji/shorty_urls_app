import * as React from "react";

export default (reducer, actions, defaultValue) => {
    const Context = React.createContext();
    const Provider = ({ children }) => {
        const [state, dispatch] = React.useReducer(reducer, defaultValue);
        const bindActions = {};

        for (let key in actions) {
            bindActions[key] = actions[key](dispatch);
        }

        return <Context.Provider value={{ state, ...bindActions }}>{children}</Context.Provider>;
    };
    return { Context, Provider };
};
