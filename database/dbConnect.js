const mongoose = require("mongoose");

function connectDb(url) {
     return mongoose.connect(url)
    .then(() => console.log("mongoDb connected successfully"))
    .catch((err) => console.log("Server error"));
}

module.exports = {
    connectDb,
};
