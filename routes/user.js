const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const userValidator = require('../validation/userValidator');
const { isAuthenticated } = require('../utilities/authenticate');

router.use(isAuthenticated);
router.get('/', userController.getAllUsers);
router.post('/', userValidator.validateCreate, userController.createUser);
router.get('/:id', userValidator.validateGetOne, userController.getUserById);
router.put('/:id', userValidator.validateUpdate, userController.updateUser);
router.delete(
  '/:id',
  userValidator.validateDeleteOne,
  userController.deleteUser
);

module.exports = router;
