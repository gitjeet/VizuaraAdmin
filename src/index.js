import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react'
const PUBLISHABLE_KEY = 'pk_test_Z2VudWluZS1ibG93ZmlzaC04Mi5jbGVyay5hY2NvdW50cy5kZXYk'
 
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
