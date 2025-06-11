import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals'; 
import  HeadManager from "./HeadManager"


const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root

root.render(
  <Provider store={store}>
    <HeadManager />
    <App />
  </Provider>
);

reportWebVitals(); 