import React, { useEffect } from "react";
import HomePage from "./Components/HomePage/HomePage";
import { Provider, useDispatch } from "react-redux";
import { store } from "./app/store";
import { fetchUser } from "./app/features/user/userSlice"; // Import fetchUser
import { getToken } from "./Services/api"; // Import getToken

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Provider store={store}>
        <HomePage />
      </Provider>
    </div>
  );
}

export default App;