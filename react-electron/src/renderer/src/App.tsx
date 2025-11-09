import "./App.css";
import RouterComponent from "./routes/routes";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <>
      <AuthProvider>
        <RouterComponent />
      </AuthProvider>
    </>
  );
}

export default App;
