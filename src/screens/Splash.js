import { useContext, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Context as AuthContext } from "../context";

export const Splash = () => {
    const { tryLocalLogin } = useContext(AuthContext);
    const history = useHistory();
    useEffect(() => {
        tryLocalLogin(
            () => {
                history.replace("/home");
            },
            () => {
                history.replace("/login");
            }
        );
    }, []);
    return null;
};
