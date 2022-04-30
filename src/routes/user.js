const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/user");

const jwtCheck = require("../auth/jwt-check");

router.post("/users", jwtCheck, createUser);

module.exports = router;
