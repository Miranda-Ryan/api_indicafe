const Category = require("../models/category");
const createError = require("http-errors");
const { categorySchema } = require("../validators/schema-validator");
const { default: mongoose } = require("mongoose");

exports.fetchAllCategories = async (req, res, next) => {
  try {
    const result = await Category.find({});
    if (result.length === 0) {
      throw createError(404, "No categories found");
    }

    res.status(200).json({
      result
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const result = await categorySchema.validateAsync(req.body);
    const category = new Category(result);
    category.addedBy = "mpk";

    await category.save();

    res
      .status(201)
      .json({ message: "Category successfully created", category });
  } catch (error) {
    console.log(error);

    // Invalid req.body
    if (error.isJoi === true) {
      error.status = 422;
    }
    // Duplicate entry
    if (error.message.includes("E11000")) {
      return next(
        createError.Conflict(`Category name: ${req.body.name} already exists`)
      );
    }
    next(createError(error));
  }
};

exports.getCategoryId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      throw createError(404, "Category not found");
    }

    res.status(200).json({
      category
    });
  } catch (error) {
    console.log(error);

    // Cast error
    if (error instanceof mongoose.CastError) {
      return next(createError(400, "Invalid Category ID"));
    }

    next(createError(error));
  }
};
