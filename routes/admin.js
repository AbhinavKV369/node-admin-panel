const express = require("express");
const upload  = require("../middlewares/upload");

const { handleGetAdminDashboard,handleUserStatus, handleGetEditUser, handleSearchUser, handlePostEditUser } = require("../controllers/admin");
const authenticateUser = require("../middlewares/userAuth");
const authenticateAdmin = require("../middlewares/adminAuth");

const router = express.Router();

router.post("/search",handleSearchUser)
router.post("/toggle-status/:id",handleUserStatus);
router.post("/update-profile/:id",upload.single("picture"),handlePostEditUser);

router.get("/update-profile/:id",authenticateUser,authenticateAdmin, handleGetEditUser);
router.get("/admin-panel",authenticateUser,authenticateAdmin, handleGetAdminDashboard);

module.exports = router;