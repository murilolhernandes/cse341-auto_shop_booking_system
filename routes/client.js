const clientController = require("../controllers/client");
const clientValidator = require("../utilities/clientValidator");
const { isAuthenticated } = require('../utilities/authenticate');

const router = require("express").Router();

router.use(isAuthenticated)
router.get("/", clientController.findAll);
router.get("/:id", clientValidator.validateGetOne, clientController.findOne);
router.post("/", clientValidator.validateCreate, clientController.create);
router.put("/:id", clientValidator.validateUpdate, clientController.update);
router.delete(
  "/:id",
  clientValidator.validateDeleteOne,
  clientController.remove,
);

module.exports = router;
