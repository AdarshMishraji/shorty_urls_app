import { Provider as AuthProvider } from "./context";
import Home from "./screens/Home";
import Auth from "./screens/Auth";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import URLs from "./screens/URLs";
import Account from "./screens/Account";
import Header from "./component/Header";
import URLStats from "./screens/URLStats";

const App = () => {
    return (
        <div>
            <AuthProvider>
                <BrowserRouter>
                    <Header />
                    <Switch>
                        <Route exact path="/login" component={Auth} />
                        <Route exact path="/url/:urlID" component={URLStats} />
                        <Route exact path="/urls" component={URLs} />
                        <Route exact path="/account" component={Account} />
                        <Route path="/" component={Home} />
                    </Switch>
                </BrowserRouter>
            </AuthProvider>
        </div>
    );
};

export default App;
