const User = require("../models/user");
const { userSchema } = require("../validators/schema-validator");
const createError = require("http-errors");

exports.createUser = async (req, res, next) => {
  let user;

  try {
    const validated = await userSchema.validateAsync(req.body);
    user = new User(validated);
    const newUser = await user.save();
    res.status(201).json({
      message: "User created successfully",
      newUser
    });
  } catch (error) {
    if (error.isJoi) {
      error.status = 422;
    }

    if (error.message.includes("E11000")) {
      return next(
        createError.Conflict(`User with email ${user.email} already exists`)
      );
    }
    next(error);
  }
};
