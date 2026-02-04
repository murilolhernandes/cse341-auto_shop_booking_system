const clientController = require("../controllers/client");
const clientValidator = require("../middleware/clientValidator");

const router = require("express").Router();

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
