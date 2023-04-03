import * as React from "react";

const createContext = <T extends any>(reducer: (state: T, action: {type: string, payload?: T})=>T, actions: Record<string, (dispatch:  React.Dispatch<{
    type: string;
    payload?: T | undefined;
}>)=>void>, defaultValue: T) => {
    const Context = React.createContext<{state: T}>({state: defaultValue});
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

export default createContext;