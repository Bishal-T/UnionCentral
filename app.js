// require modules
const express = require("express");
const morgan = require("morgan");
const eventsRoutes = require("./routes/eventsRoutes");
const methodOverride = require("method-override");
const mainRoutes = require("./routes/mainRoutes");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/usersRoutes");
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config()



// create app
const app = express();

// configure app
let port = 8080;
let host = "localhost";
let url = process.env.URL
app.set("view engine", "ejs");

// mount middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));

//connect to database
mongoose.connect(url)
.then(() => {
    //start the server
    app.listen(port, host, () => {

      console.log("Connected to database and running on", `http://${host}:${port}`);
    });
})
.catch (err => console.log(err))


//session
app.use(
  session({
      secret:  process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({mongoUrl: url}),
      cookie: {maxAge: 60*60*1000}
      })
);

//flash
app.use(flash());

app.use((req, res, next) => {

  res.locals.user = req.session.user || null;
  res.locals.errorMessages = req.flash('error');
  res.locals.successMessages = req.flash('success');
  next();

});

//set up routes
app.use("/", mainRoutes);

app.use("/events", eventsRoutes);

app.use("/users", usersRoutes);

//error handling
app.use((req, res, next) => {
  let err = new Error("The server cannot locate: " + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }

  res.status(err.status);
  res.render("error", { error: err });
});







