const appointmentController = require('../controllers/appointment');
const appointmentValidator = require('../validation/appointmentValidator');
const { isAuthenticated } = require('../utilities/authenticate');

const router = require('express').Router();

router.use(isAuthenticated);
router.get('/', appointmentController.findAll);
router.get(
  '/:id',
  appointmentValidator.validateGetOne,
  appointmentController.findOne
);
router.post(
  '/',
  appointmentValidator.validateCreate,
  appointmentController.create
);
router.put(
  '/:id',
  appointmentValidator.validateUpdate,
  appointmentController.update
);
router.delete(
  '/:id',
  appointmentValidator.validateDeleteOne,
  appointmentController.remove
);

module.exports = router;
