import { Context as AuthContext, Provider as AuthProvider } from "./context";
import { App as Home } from "./component/screens/App";
import { Auth } from "./component/screens/Auth";
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { History } from "./component/screens/History";
import { Splash } from "./component/screens/Splash";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <SwitchScreens />
            </Router>
        </AuthProvider>
    );
};

const SwitchScreens = () => {
    return (
        <Switch>
            <Route exact path="/login" component={Auth} />
            <Route exact path="/history" component={History} />
            <Route exact path="/home" component={Home} />
            <Route path="/" component={Splash} />
        </Switch>
    );
};

export default App;
