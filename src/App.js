import { App as RootApp } from "./component/screens/App";
import History from "./component/screens/History";

const App = () => {
  return (
    <div>
      {window.location.pathname === "/" ? (
        <RootApp />
      ) : window.location.pathname === "/history" ? (
        <History />
      ) : (
        (window.location.pathname = "/")
      )}
    </div>
  );
};

export default App;
