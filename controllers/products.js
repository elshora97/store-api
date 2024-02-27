const product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await product.find({});
  res.status(200).json({ noHits: products.length, products });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query;
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

  //sort feature
  if (sort) {
    const sortList = sort.split(",").join(" ");
    results = results.sort(sortList);
  } else {
    results = results.sort("createdAt");
  }

  //selection freature
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    results = results.select(fieldsList);
  } else {
    results = results.select();
  }

  const products = await results;

  res.status(200).json({ noHits: products.length, products });
};

module.exports = { getAllProductsStatic, getAllProducts };
