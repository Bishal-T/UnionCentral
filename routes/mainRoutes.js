const express = require("express");
const mainControllers = require("../controllers/mainControllers");
const router = express.Router();

router.get("/", mainControllers.home);

router.get("/about", mainControllers.about);

router.get("/contact", mainControllers.contact);


module.exports = router ;