const express = require("express");
const mongodb = require("./db/connect");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo").default;

const port = process.env.PORT || 3000;
const app = express();
require("./config/passport")(passport);

// Error Hangling
const {
  logError,
  returnError,
  isOperationalError,
} = require("./src/error-handling/errorHandler");

// app.set('trust proxy', 1); // For Express to understand that Render is a secured proxy

// Setup the server to accept bodyParser (to parse the data from the DB), passport (validate the user through Google OAuth2.0), and set the API headers.
app
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
      }),
      cookie: {
        // secure: true, // For Render (HTTPS)
        // httpOnly: true, // Prevents client-side JS from reading the cookie
        maxAge: 8.5 * 60 * 60 * 1000, // Session will expire in 8 hours (a normal work day)
      },
    }),
  )
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, PATCH, OPTIONS, DELETE",
    );
    next();
  })
  .use(cors({ methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] }))
  .use(cors({ origin: "*" }))
  .use("/", require("./routes/"));

/* ***********************
 * Error Handling
 *************************/
app.use(logError);
app.use(returnError);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api-docs",
    session: true,
  }),
  (req, res) => {
    res.redirect("/");
  },
);

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
