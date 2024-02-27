require("dotenv").config();
require("express-async-errors");
const connectBD = require("./db/connect");
const productsRouter = require("./routes/products");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

const express = require("express");
const app = express();

app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send('<h2>Store API</h2> <a href="/api/v1/products">products route</a>');
});

app.use("/api/v1/products", productsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectBD(process.env.MONGO_URI);
    app.listen(port, console.log(`app is listening to port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
