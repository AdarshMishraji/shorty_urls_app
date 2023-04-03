import * as React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { AuthProvider, ThemeProvider, ThemeContext } from "./context";
import Home from "./screens/Home";
import Auth from "./screens/Auth";
import URLs from "./screens/URLs";
import Account from "./screens/Account";
import URLStats from "./screens/URLStats";
import { Footer, ScreenWrapper } from "./component";

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Screens />
            </AuthProvider>
            <Footer />
        </ThemeProvider>
    );
};

const Screens = () => {
    const {
        state: { theme },
        setTheme,
    } = React.useContext(ThemeContext);
    React.useEffect(() => {
        const theme = localStorage.getItem("THEME");
        if (theme) setTheme(theme);

        const root = window.document.documentElement;
        root.classList.remove(theme === "dark" ? "light" : "dark");
        root.classList.add(theme);
    }, [theme]);
    return (
        <ScreenWrapper>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login" component={Auth} />
                <Route exact path="/url/:urlID" component={URLStats} />
                    <Route exact path="/urls" component={URLs} />
                    <Route exact path="/account" component={Account} />
                    <Route exact path="/home" component={Home} />
                    <Redirect from="*" to="/home" />
                </Switch>
            </BrowserRouter>
        </ScreenWrapper>
    );
};

export default App;
