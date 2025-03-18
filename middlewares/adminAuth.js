const User = require("../models/user");

async function authenticateAdmin(req, res, next) {
    try {
        const user = await User.findById(req.user.id);  
        if (!user || !user.isAdmin) {
            return res.redirect("/logout");
        }
        next();
    } catch (err) {
        res.status(500).send("Server error");
    }
}

module.exports = authenticateAdmin;
