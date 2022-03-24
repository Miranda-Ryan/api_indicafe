const express = require("express");
const { createDish, fetchDishes, fetchDish,getDishPhoto } = require("../controllers/dish");

const router = express.Router();

router.post("/dishes", createDish);
router.get("/dishes", fetchDishes);
router.get("/dish/:id", fetchDish);
router.get("/dish/:id/photo", getDishPhoto);

module.exports = router;
