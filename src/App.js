import React, { useEffect, useState } from "react";
import HomePage from "./Components/HomePage/HomePage";
import { useDispatch } from "react-redux";
import { fetchUser } from "./app/features/user/userSlice";
import { fetchCompanyInfo } from "./app/features/company/companySlice";
import { getToken } from "./Services/api";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanyInfo());
    const token = getToken();
    if (token) {
      dispatch(fetchUser());
    }

  }, [dispatch]);

  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
