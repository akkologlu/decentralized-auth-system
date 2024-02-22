import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Components/Login";
import { useRoutes } from "./Context/RouteContext";
import User from "./Components/User";
import Home from "./Components/Home";

function App() {
  const [message, setMessage] = useState("");
  const { routes, setUserAddress, userAddress } = useRoutes();

  useEffect(() => {
    checkSession(); // Check session status when component mounts
  }, []);
  console.log(userAddress);
  const checkSession = async () => {
    setMessage("Checking session status");
    const response = await axios.get("http://localhost:5000/auth/check", {
      withCredentials: true,
    });
    const { success, walletAddress } = response.data;

    if (success) {
      setUserAddress(walletAddress);
      setMessage("You are logged in with your wallet");
    } else {
      setMessage("You are not logged in");
    }
  };

  const routeArray = [
    { path: "/login", element: <Login /> },
    { path: "/home", element: <Home /> },
    ...routes.map((route) => ({ path: route.path, element: route.element })),
  ];

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {routeArray.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
