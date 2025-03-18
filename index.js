require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectDb, } = require("./database/dbConnect");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const nocache = require("nocache");


const PORT = process.env.PORT || 5000;
const app = express();

connectDb("mongodb://127.0.0.1:27017/node-admin-panel");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(nocache());
app.use(express.static(path.resolve("public")));
app.use('/uploads', express.static('public/uploads'));

app.set("view engine", "ejs");
app.set("views",path.resolve(__dirname,"./views"));


app.use("/", userRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});

 const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 
 console.log(passwordRegex.test("Abhinav@2002"));



 