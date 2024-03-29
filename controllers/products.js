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

  // Numeric Filters for price AND rating
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };

    const regEgx = /\b(<|>|<=|>=|=)\b/g;
    let filters = numericFilters.replace(
      regEgx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split("-").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
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

  //pagination feature
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  results = results.skip(skip).limit(limit);

  const products = await results;

  res.status(200).json({ noHits: products.length, products });
};

module.exports = { getAllProductsStatic, getAllProducts };
