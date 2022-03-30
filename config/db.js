const mongoose = require("mongoose");
require("dotenv").config({ path: "enviroment.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {});
    console.log("DB OK");
  } catch (error) {
    console.log(`Error connect database ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
