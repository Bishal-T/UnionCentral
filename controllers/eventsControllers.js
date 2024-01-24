const model = require("../models/events");
const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const RSVP = require("../models/rsvp");

exports.index = (req, res, next) => {
  model
    .distinct("category")
    .then((category) => {
      return model.find()
      .then((events) => {
        return { category, events };
      });
    })
    .then((eventsData) => {
      res.render("./events/index", {
        events: eventsData.events,
        category: eventsData.category,
      });
    })

    .catch((err) => console.log(err));
};

exports.new = (req, res) => {
  res.render("./events/newEvents");
};

exports.create = (req, res, next) => {
  let event = new model(req.body);
 
  console.log(event);

  if (req.file) {
    event.image = "/../images/" + req.file.filename;
  }else {
    req.flash("error", "Please upload a profile image");
  }
  
  event.host = req.session.user.id;
  event
    .save()
    .then((event) => {
      req.flash("success", "Event has been created");
        res.redirect("/events");
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        err.status = 400;
        req.flash("error", err.message);
        return res.redirect("back");
      }
      next(err);
    });
};

exports.show = (req, res, next) => {
  let id = req.params.id;
  model.findById(id)
    .populate('host', 'firstName lastName')
    .lean()
    .then((event) => {
      if (event) {
        RSVP.find({event: id})
          .then((rsvps) => {
         
            event.eventStart = DateTime.fromJSDate(event.eventStart).toLocaleString(DateTime.DATETIME_MED);
            event.eventEnd = DateTime.fromJSDate(event.eventEnd).toLocaleString(DateTime.DATETIME_MED);

            const yesCount = rsvps.filter((rsvp) => rsvp.status === 'Yes').length;

            rsvps.length = yesCount;

    
            res.render("./events/details", { event, rsvps });
          })
          .catch((err) => {next(err)});
      } 
    })
    .catch((err) => {
      next(err);
    });
  

  
};

exports.edit = (req, res, next) => {
  let id = req.params.id;


  model.findById(id)
  .then((event) => {
      res.render("./events/edit", { event });
  
  }).catch(err => next(err)); 
};

exports.update = (req, res, next) => {
  let event = req.body;
  let id = req.params.id;
  
  if (req.file) {
    event.image = "/../images/" + req.file.filename;
  }else {
    req.flash("error", "Please upload a profile image");
  }

  model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
  .then((event) => { 
      req.flash("success", "Event has been updated");
      res.redirect("/events/" + id);
    
  })
  .catch(err => {
    if (err.name == "ValidationError") {
      err.status = 400;
    }
    next(err);
  })

}

exports.delete = (req, res, next) => {
  let id = req.params.id;

  model.findByIdAndDelete(id, {useFindAndModify: false})
  .then(event => {
    if(event) {
     return RSVP.deleteMany({event: id})
      .then(() => {
        req.flash("success", "Event and RSVPs have been deleted");
        res.redirect("/events");
      }).catch(err => next(err));
    }
  
  }).catch(err => next(err));
};


exports.rsvp = (req, res, next) => {
  let id = req.params.id;
  
    let rsvp = new RSVP({
        status: req.body.status,
        user: req.session.user.id,
        event: new mongoose.Types.ObjectId(id),
    });

 
    let query = {event: rsvp.event, user: rsvp.user};
    let update = {status: rsvp.status};
    let options = {upsert: true}

    RSVP.findOneAndUpdate(query, update, options)
    .then((event) =>
    {
        req.flash("success", "RSVP status is " + req.body.status + "!")
       res.redirect('/users/profile')
    })
    .catch((err) =>{ return next(err);})

}



