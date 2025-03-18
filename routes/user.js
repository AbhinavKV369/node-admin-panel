const express = require("express");
const nocache = require("nocache")
const upload = require("../middlewares/upload");
const authenticateUser = require("../middlewares/userAuth");
const { 
    handlePostSignup,
    handlePostLogin, 
    handleGetDashboard, 
    handleGetProfile, 
    handleUpdateProfile, 
    handleGetSignup, 
    handleGetLogin, 
    handleLogOut,
    handlegetOTP,
    handleVerifyOTP, 
} = require("../controllers/user");

const router = express.Router();

router.post("/signup", upload.single("picture"), handlePostSignup);
router.post("/login", handlePostLogin);
router.post("/profile", upload.single("picture"), authenticateUser, handleUpdateProfile);
router.post("/verify-otp",handleVerifyOTP)

router.get("/signup", handleGetSignup);
router.get("/verify-otp",handlegetOTP)
router.get("/login",handleGetLogin);
router.get("/dashboard",nocache(), authenticateUser, handleGetDashboard);
router.get("/profile",nocache(), authenticateUser, handleGetProfile);
router.get("/logout", handleLogOut);

module.exports = router;
