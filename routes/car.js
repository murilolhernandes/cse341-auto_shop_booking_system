const router = require('express').Router();
const carController = require('../controllers/car');
const { isAuthenticated } = require('../utilities/authenticate');

router.use(isAuthenticated);
router.get('/', carController.getAll);
router.get('/:id', carController.getById);
router.post('/', carController.createCar);
router.put('/:id', carController.updateCar);
router.delete('/:id', carController.deleteCar);
module.exports = router;
