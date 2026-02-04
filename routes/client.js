const clientController = require("../controllers/client");

const router = require("express").Router();

router.get("/", clientController.findAll);
router.get("/:id", clientController.findOne);
router.post("/", clientController.create);
router.put("/:id", clientController.update);
router.delete("/:id", clientController.remove);

module.exports = router;
