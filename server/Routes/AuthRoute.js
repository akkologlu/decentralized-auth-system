const express = require("express");
const {
  checkRole,
  checkVerified,
  makeVerifyUser,
  checkAdmin,
  getAdminAddress,
  nonce,
  verify,
  check,
  logout,
} = require("../Controllers/AuthController");
const router = express.Router();

router.post("/checkRole", checkRole);
router.post("/checkVerified", checkVerified);
router.post("/makeVerifyUser", makeVerifyUser);
router.post("/checkAdmin", checkAdmin);
router.post("/getAdminAdress", getAdminAddress);
router.get("/nonce", nonce);
router.get("/verify", verify);
router.get("/check", check);
router.get("/logout", logout);

module.exports = router;
