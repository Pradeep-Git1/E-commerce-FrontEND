import React, { useEffect } from "react";
import HomePage from "./Components/HomePage/HomePage";
import { useDispatch } from "react-redux";
import { fetchUser } from "./app/features/user/userSlice";
import { fetchCompanyInfo } from "./app/features/company/companySlice";
import { getToken } from "./Services/api";
import { message } from "antd";
import HeadManager from "./HeadManager";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanyInfo());
    console.log("Lets try");
    message.success("Good to go");
    const token = getToken();
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  return (
    <div className="App">
      <HeadManager/>
      <HomePage />
    </div>
  );
}

export default App;
