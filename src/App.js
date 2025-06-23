import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./app/features/user/userSlice";
import { fetchCompanyInfo } from "./app/features/company/companySlice";
import { getToken, getRequest } from "./Services/api"; // Ensure getRequest is imported
import HomePage from "./Components/HomePage/HomePage";

function App() {
    const dispatch = useDispatch();

    // State for categories data
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState(null);

    useEffect(() => {
        // Fetch company info
        dispatch(fetchCompanyInfo());

        // Fetch user info if token exists
        const token = getToken();
        if (token) {
            dispatch(fetchUser());
        }

        // Fetch categories
        const fetchTopCategories = async () => {
            setCategoriesLoading(true);
            setCategoriesError(null);
            try {
                console.log("App.js: Fetching categories...");
                const response = await getRequest("top-categories/");
                if (response) {
                    setCategories(response);
                    console.log(
                        "App.js: Categories fetched:",
                        response.length,
                        "items."
                    );
                }
            } catch (err) {
                console.error("App.js: Error fetching categories:", err);
                setCategoriesError(
                    "Failed to load categories. Please try again later."
                );
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchTopCategories();
    }, [dispatch]); // Dependencies include dispatch

    return (
        <div className="App">
            <HomePage
                categories={categories}
                categoriesLoading={categoriesLoading}
                categoriesError={categoriesError}
            />
        </div>
    );
}

export default App;