const User = require("../models/user");

async function handleGetAdminDashboard(req, res) {
  try {
    const users = await User.find({});
    if (!users) {
      return res.redirect("/logout");
    }
    res.render("admin-panel", { users });
  } catch (error) {
    console.error(error);
    return res.send("Server Error");
  }
}

async function handleSearchUser(req, res) {
  const { search } = req.body;
  try {
    const users = await User.find({
      name: { $regex: search, $options: "i" }
    });
    res.render("admin-panel", { users });
  } catch (error) {
    console.error(error);
    res.send("Server Error");
  }
}

async function handlePostEditUser(req, res) {
  const { name, email, bio } = req.body;
  const picture = req.file ? "/uploads/" + req.file.filename : null;
  try {
    const updatedFields = { name,email,bio };
    if(picture) updatedFields.picture = picture;
    const user = await User.findByIdAndUpdate( req.params.id, updatedFields, { new: true})
    res.render("profile-edit",{
      user
    });
  }catch (err) { 
    res.send("Server Error");
  }
}

async function handleGetEditUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("profile-edit", { user });
  } catch (error) {
    return res.send("Server Error");
  }
}

async function handleUserStatus(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  try {
    user.status = user.status ? false : true;
    await user.save();
    res.redirect("/admin/admin-panel");
  } catch (err) {
    return res.send("Server Error");
  }
}

module.exports = {
  handleGetAdminDashboard,
  handleSearchUser,
  handleUserStatus,
  handlePostEditUser,
  handleGetEditUser,
}
