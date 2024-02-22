const dotenv = require("dotenv");
const { Web3 } = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider");
const { recoverPersonalSignature } = require("eth-sig-util");
const { bufferToHex } = require("ethereumjs-util");

dotenv.config();

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.TEST_URL
);
const web3 = new Web3(provider);

const contractAddress = process.env.CONTRACT_ADDRESS; // Replace with your deployed contract address
const contractAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ internalType: "address", name: "newAdmin", type: "address" }],
    name: "addAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "admins",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "adminAdress", type: "address" }],
    name: "checkAdmin",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAdminAdress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "isUserVerified",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "verifiedUsers",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "verifyUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]; // Replace with your contract ABI
const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

module.exports.checkRole = async (userAddress) => {
  try {
    const isAdmin = await contractInstance.methods
      .checkAdmin(userAddress)
      .call();
    const isVerified = await contractInstance.methods
      .isUserVerified(userAddress)
      .call();

    if (isAdmin) {
      console.log("admin");
      return {
        success: true,
        routes: [
          { path: "/admin", element: "<Admin />" },
          { path: "/user", element: "<User />" },
          { path: "/verified", element: "<Verified />" },
        ],
      };
    } else if (isVerified) {
      console.log("verified");
      return {
        success: true,
        routes: [
          { path: "/user", element: "<User />" },
          { path: "/verified", element: "<Verified />" },
        ],
      };
    } else {
      console.log("user");
      return {
        success: true,
        routes: [{ path: "/user", element: "<User />" }],
      };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error checking role" };
  }
};

module.exports.checkVerified = async (req, res) => {
  const userAddress = req.body.userAddress;

  try {
    const isVerified = await contractInstance.methods
      .isUserVerified(userAddress)
      .call();

    if (isVerified) {
      res.status(200).json({ success: true, message: "User is verified" });
    } else {
      res.status(200).json({ success: false, message: "User is not verified" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error verifying user" });
  }
};

module.exports.makeVerifyUser = async (req, res) => {
  const userAddress = req.body.userAddress;

  try {
    const accounts = await web3.eth.getAccounts();
    const admin = await contractInstance.methods.admin().call();
    console.log(admin);
    console.log(accounts[0]);

    if (accounts[0] !== admin) {
      res.status(401).json({ success: false, message: "You are not an admin" });
      return;
    }

    await contractInstance.methods.verifyUser(userAddress).send({
      from: accounts[0],
    });

    res.status(200).json({ success: true, message: "User verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error verifying user" });
  }
};

module.exports.checkAdmin = async (req, res) => {
  const userAddress = req.body.userAddress;
  console.log(userAddress);

  try {
    const isVerified = await contractInstance.methods
      .checkAdmin(userAddress)
      .call();

    if (isVerified) {
      res
        .status(200)
        .json({ success: true, role: "User is admin ve back çalışıyor" });
    } else {
      res.status(200).json({ success: true, message: "User is not admin" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: true, message: "Error verifying user" });
  }
};

module.exports.getAdminAddress = async (req, res) => {
  try {
    const adminAddress = await contractInstance.methods.getAdminAdress().call();

    res.status(200).json({ success: true, adminAddress });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error getting admin address" });
  }
};
const nonceList = {};
module.exports.nonce = (req, res) => {
  const { walletAddress } = req.query;
  const nonce = String(Math.floor(Math.random() * 10000));
  // save the nonce on the server
  nonceList[walletAddress] = nonce;
  res.send({ nonce });
};

module.exports.verify = async (req, res) => {
  const { walletAddress, signedNonce } = req.query;
  const nonce = nonceList[walletAddress];
  try {
    const hexNonce = bufferToHex(Buffer.from(nonce, "utf8"));
    const retrievedAddress = recoverPersonalSignature({
      data: hexNonce,
      sig: signedNonce,
    });

    if (walletAddress === retrievedAddress) {
      const routes = await this.checkRole(walletAddress);
      // logged in
      return res
        .cookie("walletAddress", walletAddress, {
          secure: true,
          httpOnly: true,
          duration: 1000 * 60 * 60,
        })
        .send({ success: true, routes });
    }
    throw false;
  } catch (err) {
    return res.send({ success: false });
  }
};

module.exports.check = (req, res) => {
  const { walletAddress } = req.cookies;
  if (walletAddress) {
    return res.send({ success: true, walletAddress });
  }
  return res.send({ success: false });
};

module.exports.logout = (req, res) => {
  res.clearCookie("walletAddress");
  res.send({ success: true });
};
