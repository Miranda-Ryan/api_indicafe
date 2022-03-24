const express = require("express");
const {
  fetchAllCategories,
  createCategory,
  getCategoryId
} = require("../controllers/category");

const router = express.Router();

router.get("/categories", fetchAllCategories);
router.post("/categories", createCategory);
router.get("/categories/:id", getCategoryId);

module.exports = router;
