const clientController = require("../controllers/client");
const clientValidator = require("../utilities/clientValidator");
const { isAuthenticated } = require('../utilities/authenticate');

const router = require("express").Router();

router.get("/", isAuthenticated, clientController.findAll);
router.get("/:id", isAuthenticated, clientValidator.validateGetOne, clientController.findOne);
router.post("/", isAuthenticated, clientValidator.validateCreate, clientController.create);
router.put("/:id", isAuthenticated, clientValidator.validateUpdate, clientController.update);
router.delete(
  "/:id",
  clientValidator.validateDeleteOne,
  clientController.remove,
);

module.exports = router;
