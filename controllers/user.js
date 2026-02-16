const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// Requiring the Api504Error class to throw custom errors.
const Api400Error = require('../error-handling/api400Error');
const Api404Error = require('../error-handling/api404Error');

// Requiring the Api500Error class to throw custom errors.
const Api500Error = require('../error-handling/api500Error');

// Requiring the AsyncWrapper to wrap all the controller functions.
const AsyncWrapper = require('../error-handling/AsyncWrapper');

// Installing async wrapper to al the controllers.
const getAllUsers = AsyncWrapper.wrapAsync(async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection('users').find();

    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// Installing async wrapper to al the controllers.
const getUserById = AsyncWrapper.wrapAsync(async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error(
        'Invalid User ID Format',
        undefined,
        `The provided user ID ${req.params.id} is not a valid ID format.`
      );
    }

    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('users')
      .find({ _id: userId });

    const user = await result.toArray();

    if (!user[0]) {
      throw new Api404Error(
        'User not found',
        undefined,
        `User with id ${req.params.id} not found.`
      );
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user[0]);
  } catch (err) {
    next(err);
  }
});

const createUser = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /*
   #swagger.tags = ['Users']
   #swagger.description = 'Create a user'
   #swagger.parameters['body'] = {
    in: 'body',
    description: 'User information',
    required: true,
    schema: { $ref: '#/definitions/User' }
   }
  */
  try {
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .insertOne(newUser);
    if (response.acknowledged) {
      return res.status(201).json({ id: response.insertedId });
    } else {
      throw new Api500Error(
        'User Creation Failed',
        undefined,
        'Failed to create a new user.'
      );
    }
  } catch (err) {
    next(err);
  }
});

const updateUser = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /*
   #swagger.tags = ['Users']
   #swagger.description = 'Update a user by id'
   #swagger.parameters['body'] = {
    in: 'body',
    description: 'User information',
    required: true,
    "schema": {
      "type": "object",
      "properties": {
        "firstName": {
          "example": "Jason"
        },
        "lastName": {
          "example": "Robertson"
        },
        "email": {
          "example": "jason.robertson@email.com"
        }
      }
    }
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error(
        'Invalid User ID Format',
        undefined,
        `The provided user ID ${req.params.id} is not a valid ID format.`
      );
    }

    const userId = new ObjectId(req.params.id);
    const user = {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      },
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .updateOne({ _id: userId }, user);

    if (response.matchedCount === 0) {
      throw new Api404Error(
        'User not found',
        undefined,
        `User with id ${req.params.id} not found.`
      );
    }

    if (response.acknowledged) {
      res.status(200).json('User was updated successfully');
    } else {
      throw new Api500Error(
        'User Update Failed',
        undefined,
        `Error occurred while updating user with id ${req.params.id}`
      );
    }
  } catch (err) {
    next(err);
  }
});

// Installing async wrapper to al the controllers.
const deleteUser = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /*
   #swagger.tags = ['Users']
   #swagger.description = 'Delete a user'
   #swagger.parameters['body'] = {
    in: 'body',
    description: 'User information',
    required: true,
    schema: { $ref: '#/definitions/User' }
    }
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error(
        'Invalid User ID Format',
        undefined,
        `The provided user ID ${req.params.id} is not a valid ID format.`
      );
    }

    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(200).json('User was removed successfully');
    } else {
      throw new Api404Error(
        'User not found',
        undefined,
        `User with id ${req.params.id} not found.`
      );
    }
  } catch (err) {
    next(err);
  }
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
