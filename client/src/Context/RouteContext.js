import React, { useState, createContext, useContext } from "react";

const RouteContext = createContext();

export const useRoutes = () => useContext(RouteContext);

export const RouteProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);
  const [userAddress, setUserAddress] = useState("");

  return (
    <RouteContext.Provider
      value={{ routes, setRoutes, userAddress, setUserAddress }}
    >
      {children}
    </RouteContext.Provider>
  );
};
