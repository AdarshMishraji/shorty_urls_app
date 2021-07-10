import { App as RootApp } from "./component/screens/App";
import History from "./component/screens/History";

const Route = ({ path, children }) => {
  return window.location.pathname === path ? children : null;
};

const App = () => {
  return (
    <div>
      <Route path="/">
        <RootApp />
      </Route>
      <Route path="/history">
        <History />
      </Route>
    </div>
  );
};

export default App;
