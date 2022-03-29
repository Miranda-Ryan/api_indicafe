const Dish = require("../models/dish");
const { dishSchema } = require("../validators/schema-validator");
const createError = require("http-errors");
const mongoose = require("mongoose");

const IMG_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

exports.createDish = async (req, res, next) => {
  const { name, description, price, category, photo } = req.body;

  try {
    const result = await dishSchema.validateAsync({
      name,
      description,
      price,
      category
    });

    let dish = new Dish({ name, description, price, category });
    dish.addedBy = "mpk";
    savePhoto(dish, photo);

    const newDish = await dish.save();
    newDish.photo = undefined;

    res.status(201).json({
      newDish
    });
  } catch (error) {
    console.log(error);
    if (error.isJoi === true) {
      error.status = 422;
    }

    if (error.message.includes("E11000")) {
      return next(createError.Conflict(`The Dish ${name} already exists`));
    }

    next(createError(error));
  }
};

exports.fetchDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find()
      .select("-photo")
      .populate("category", "_id, name");

    if (dishes.length === 0) throw createError(400, "No dishes found");

    res.status(200).json({ dishes });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
};

exports.fetchDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findById(id);
    if (!dish) {
      throw createError(404, "Dish not found");
    }

    dish.photo = undefined;
    res.status(200).json({
      dish
    });
  } catch (error) {
    console.log(error);
    // Cast error
    if (error instanceof mongoose.CastError) {
      return next(createError(400, "Invalid Dish ID"));
    }

    next(error);
  }
};

exports.getDishPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findById(id);

    if (!dish) {
      throw createError(404, "Dish not found");
    }

    if (dish.photo.data) {
      res.set("Content-Type", dish.photo.contentType);
      res.send(dish.photo.data);
    } else {
      res.status(204).json({
        message: "No data found"
      });
    }
  } catch (error) {
    console.log(error);
    // Cast error
    if (error instanceof mongoose.CastError) {
      return next(createError(400, "Invalid Dish ID"));
    }

    next(error);
  }
};

exports.searchByCategory = async (req, res, next) => {
  let { categories } = req.body;
  let criteria = {};

  try {
    if (categories.length === 0) {
      throw createError(404, "No categories specified");
    }

    criteria = { category: { $in: categories } };

    const result = await Dish.find(criteria)
      .select("-photo")
      .populate("category", "_id name");

    res.status(200).json({
      result
    });
  } catch (error) {
    console.log(error);

    if (error instanceof mongoose.CastError) {
      return next(createError(400, "Invalid Category ID"));
    }

    next(error);
  }
};

function savePhoto(dish, photo) {
  // Handle empty object scenario
  if (photo !== null && IMG_TYPES.includes(photo.contentType)) {
    dish.photo.data = new Buffer.from(photo.data, "base64");
    dish.photo.contentType = photo.contentType;
  }
}
