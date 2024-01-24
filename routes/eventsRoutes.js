const express = require("express");
const controllers = require("../controllers/eventsControllers");
const router = express.Router();
const {fileUpload} = require("../middleware/fileUplaod")
const {isLoggedIn, isAuthor, isAuthorRSVP} = require("../middleware/auth")
const {validateID, validateEvent, validateResult, validateRSVP} = require("../middleware/validator")

// GET /events: send all events to user
router.get("/", controllers.index);

//GET /events/new: send html form for creating a new event
router.get("/new", isLoggedIn, controllers.new);

// POST image with event
router.post("/", isLoggedIn, fileUpload, validateEvent,  validateResult, controllers.create);


//GET /event/:id: send details of the event identified by id
router.get("/:id", validateID, controllers.show);

//GET /event/:id/edit: send html form for editing an existing events
router.get("/:id/edit", validateID, isLoggedIn, isAuthor, controllers.edit);

//PUT /event/:id: update the event with the ID
router.put("/:id",  validateID, isLoggedIn, isAuthor, fileUpload, validateEvent,  validateResult, controllers.update);

// DELETE /event/:id: delete a event with the ID
router.delete("/:id", validateID, isLoggedIn, isAuthor, controllers.delete);

// POST /event/:id/rsvp: create a new rsvp for the event with the ID
router.post("/:id/rsvp", validateID,  isLoggedIn, isAuthorRSVP, validateRSVP, validateResult, controllers.rsvp);




module.exports = router;


