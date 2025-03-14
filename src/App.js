import HomePage from "./Components/HomePage/HomePage";
import { AppProvider } from "./AppContext";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <HomePage />
      </AppProvider>
    </div>
  );
}

export default App;