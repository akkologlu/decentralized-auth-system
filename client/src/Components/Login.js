import React, { useState, useEffect } from "react";
import MetamaskLogo from "./MetamaskLogo";
import Web3 from "web3";
import axios from "axios";
import { useRoutes } from "../Context/RouteContext";
import detectEthereumProvider from "@metamask/detect-provider";
import { Link } from "react-router-dom";

function Login() {
  const { setRoutes, setUserAddress } = useRoutes();
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("Connecting Metamask");
    //CONNECT TO METAMASK

    const provider = await detectEthereumProvider();

    if (!provider) {
      setMessage("Please Install Metamask");
      return;
    }

    await provider.request({ method: "eth_requestAccounts" });
    setMessage("Metamask connected");

    // GET WALLET ADDRESS
    const web3 = new Web3(provider);
    const walletAddress = await web3.eth.getCoinbase();

    // SEND WALLET ADDRESS TO SERVER

    const response1 = await axios.get(
      `http://localhost:5000/auth/nonce?walletAddress=${walletAddress}`,
      { withCredentials: true }
    );

    const { nonce } = response1.data;

    // GET THE NONCE AND SIGN IT

    const signedNonce = await web3.eth.personal.sign(nonce, walletAddress, "");

    // SEND THE SIGNED NONCE TO THE SERVER

    const response2 = await axios.get(
      `http://localhost:5000/auth/verify?walletAddress=${walletAddress}&signedNonce=${signedNonce}`,
      { withCredentials: true }
    );

    const { success, routes } = response2.data;
    console.log(success);
    console.log(routes);
    if (success) {
      setRoutes(routes.routes);
      setMessage("You are logged in with your wallet");
    } else {
      setMessage("You are not logged in");
    }
  };

  const handleLogout = async () => {
    setMessage("Logging out");
    await axios.get("http://localhost:5000/auth/logout", {
      withCredentials: true,
    });
    await checkSession(); // Update UI after logout
  };
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
  console.log(message);
  return (
    <div className="flex items-center space-y-12 flex-col bg-sky-800 h-screen">
      <div className="mt-[10%]">
        <MetamaskLogo />
      </div>
      <div>
        <button
          onClick={handleLogin}
          className="bg-orange-500 px-4 py-2 rounded-lg text-gray-100"
        >
          Login with Metamask
        </button>
        <Link to="/home">Home</Link>
        <Link to="/user">User</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/verified">Verified</Link>
      </div>
    </div>
  );
}

export default Login;
