import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { Provider as AuthProvider } from "./context";
import Home from "./screens/Home";
import Auth from "./screens/Auth";
import URLs from "./screens/URLs";
import Account from "./screens/Account";
import URLStats from "./screens/URLStats";

const App = () => {
    return (
        <div>
            <AuthProvider>
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
            </AuthProvider>
        </div>
    );
};

export default App;
