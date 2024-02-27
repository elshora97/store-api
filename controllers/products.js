const product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await product.find({});
  res.status(200).json({ noHits: products.length, products });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  let results = product.find(queryObject);

  if (sort) {
    const sotrList = sort.split(",").join(" ");
    results = results.sort(sotrList);
  } else {
    results = results.sort("createdAt");
  }

  const products = await results;

  res.status(200).json({ noHits: products.length, products });
};

module.exports = { getAllProductsStatic, getAllProducts };
