import React from "react";
import HomePage from "./Components/HomePage/HomePage";
import { Provider } from "react-redux"; // Import Provider
import { store } from "./app/store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <HomePage />
      </Provider>
    </div>
  );
}

export default App;