const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.secret_key;
const User = require("../models/user");
const { generateOTP, sendOTP } = require("../services/nodemailer");
require("dotenv").config();

async function handlePostSignup(req, res) {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.render("signup", {
        errorMessage: "User already exists",
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.render("signup", {
        errorMessage: "Password not strong enough.",
        showOtpField: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp: otpCode,
      otpExpires: Date.now() + 5 * 60 * 1000, 
    });

    await newUser.save();
    await sendOTP(email, otpCode);

    return res.render("verify-otp", {
      email,
      errorMessage: null,
      message: "OTP sent. Please verify OTP.",
      showOtpField: true,
    });

  } catch (err) {
    return res.render("signup", {
      errorMessage: "Error occurred while registering user.",
    });
  }
}

async function handleVerifyOTP(req, res) {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.render("verify-otp", {
        email,
        message: "User not found.",
        errorMessage: null,
      });
    }

    if (user.otp !== otp){
       return res.render("verify-otp", {
        email,
        errorMessage: "Invalid OTP",
        message: null,
      });
    } 
    else if (user.otpExpires < Date.now()) {
      return res.render("verify-otp", {
        email,
        errorMessage: "OTP expired",
        message: null,
      });
    }

    user.otp == otp;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.redirect("/login");

  } catch (err) {
    return res.render("verify-otp", {
      email,
      errorMessage: "Error occurred while verifying OTP. Please try again.",
    });
  }
}



async function handlePostLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        errorMessage: "User not found",
      });
    };

    if(!user.status){
      return res.render("login",{
        errorMessage: "User access blocked by Admin"
      })
    };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render("login", {
        errorMessage: "Incorrect Password",
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.redirect("/dashboard");
    console.log("Login successful");
  } catch (err) {
    res.render("login", {
      errorMessage: "Server error",
    });
  }
}

async function handleGetDashboard(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("Unauthorized");
    }
    res.render("dashboard", { user });
  } catch (err) {
    console.log("Error on fetching the user", err);
    res.status.send("Server Error");
  }
}

async function handleGetProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("profile", { user });
  } catch (err) {
    console.log("Error on fetching user", err);
    res.status.send("Server error");
  }
}

async function handleUpdateProfile(req, res) {
  try {
    const { name, bio } = req.body;
    const picture = req.file ? "/uploads/" + req.file.filename : null ;

    const updatedFields = { name, bio };
    if (picture) updatedFields.picture = picture;

    const user = await User.findByIdAndUpdate(req.user.id, updatedFields, {
      new: true,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("profile", {
      user,
      successMessage: "Profile updated successfully",
    });
    
  } catch (err) {
    console.log("Error occurred while updating the profile", err);
    res.status(500).send("Server Error");
  }
}

async function handleGetSignup(req, res) {
  res.render("signup", {
    message: null,
    errorMessage: null,
  });
}

async function handlegetOTP(req, res) {
  res.render("verify-otp", {
    message: null,
    errorMessage: null,
  });
}

async function handleGetLogin(req, res) {
  res.render("login", {
    errorMessage: null,
  });
}

async function handleLogOut(req, res) {
  res.clearCookie("token");
  res.redirect("/login");
}

module.exports = {
  handlePostSignup,
  handlegetOTP,
  handleVerifyOTP,
  handlePostLogin,
  handleGetDashboard,
  handleGetProfile,
  handleUpdateProfile,
  handleGetSignup,
  handleGetLogin,
  handleLogOut,
};
