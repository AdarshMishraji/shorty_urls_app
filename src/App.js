import { Provider as AuthProvider } from "./context";
import { Home } from "./screens/Home";
import { Auth } from "./screens/Auth";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { URLs } from "./screens/URLs";
import { Splash } from "./screens/Splash";
import { Account } from "./screens/Account";
import Header from "./component/Header";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <SwitchScreens />
            </Router>
        </AuthProvider>
    );
};

const SwitchScreens = () => {
    return (
        <Switch>
            <Route exact path="/login" component={Auth} />
            <Route exact path="/urls" component={URLs} />
            <Route exact path="/account" component={Account} />
            <Route path="/" component={Home} />
        </Switch>
    );
};

export default App;
