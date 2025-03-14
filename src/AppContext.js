import React, { createContext, useState, useEffect } from "react";
import { getRequest, postRequest, removeToken, setToken } from "./Services/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUser();
      fetchCart();
    }
  }, []);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await getRequest("/user-profile/");
      setUser(userData);
    } catch (err) {
      setError("Failed to load user data.");
      removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const cartData = await getRequest("/cart/");
      setCart(cartData);
    } catch (err) {
      setError("Failed to load cart data.");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier, password, otp = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await postRequest(otp ? "/verify-otp/" : "/login/", { identifier, password });
      setToken(response.token);
      fetchUser();
      fetchCart();
    } catch (err) {
      setError("Login failed.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setCart([]);
  };

  const addToCart = async (product) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await postRequest("/cart/add/", { product_id: product.id, quantity: 1 });
      setCart(updatedCart);
    } catch (err) {
      setError("Failed to add to cart.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await postRequest("/cart/remove/", { item_id: itemId });
      setCart(updatedCart);
    } catch (err) {
      setError("Failed to remove from cart.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (identifier) => {
    setIsLoading(true);
    setError(null);
    try {
      await postRequest("/send-otp/", { identifier });
    } catch (err) {
      setError("Failed to send OTP.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      await postRequest("/reset-password/", { email });
    } catch (err) {
      setError("Failed to send reset link.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        login,
        logout,
        addToCart,
        removeFromCart,
        isLoading,
        error,
        sendOtp,
        resetPassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};