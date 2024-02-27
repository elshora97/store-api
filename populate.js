require("dotenv").config();
const connectBD = require("./db/connect");

const products = require("./models/product");
const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectBD(process.env.MONGO_URI);
    await products.deleteMany();
    await products.create(jsonProducts);
    console.log("done!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

start();
