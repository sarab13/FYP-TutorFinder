const express = require("express");
const {
  allUsers,
} = require("../controllers/userControllers");


const router = express.Router();

router.route("/").get(allUsers);


module.exports = router;