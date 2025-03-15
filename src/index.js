import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals'; // Assuming you have this

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root

root.render( // Use root.render instead of ReactDOM.render
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals(); // Assuming you have this