const router = require("express").Router();
const authentication = require("../utilities/authenticate");

router.use("/", require("./swagger"));

router.get("/", (req, res) => {
  res.send(
    req.isAuthenticated() ? `Logged in as ${req.user.firstName}` : "Logged out",
  );
});

router.get("/login", authentication.login, (req, res) => {});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    // Remove old sessions to keep db clean
    req.session.destroy(function (err) {
      if (err) {
        console.log("Error destroying session:", err);
      }
      res.redirect("/");
    });
  });
});

router.use("/client", require("./client"));
router.use("/car", require("./car"));

router.use("/user", require("./user"));

module.exports = router;
