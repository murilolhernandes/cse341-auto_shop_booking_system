const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

// Requiring the Api504Error class to throw custom errors.
const Api404Error = require("../error-handling/api404Error");

// Requiring the Api500Error class to throw custom errors.
const Api500Error = require("../error-handling/api500Error");

// Requiring the AsyncWrapper to wrap all the controller functions.
const AsyncWrapper = require("../error-handling/AsyncWrapper");

// Installing async wrapper to al the controllers.
const getAllUsers = AsyncWrapper.wrapAsync(async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection("users").find();

    const users = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(users);
  } catch (err) {
    //Throwing custom errors.

    throw new Api500Error(
      "Retrieving users failed",
      undefined,
      `Failed to retrieve users ${err.message}`,
    );

    //res.status(500).json({ message: err.message });
  }
});

// Installing async wrapper to al the controllers.
const getUserById = AsyncWrapper.wrapAsync(async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api404Error(
        "Invalid User ID",
        undefined,
        `The provided user id ${req.params.id} is not a valid Id.`,
      );
      //return res.status(400).json({ message: 'Invalid user id' });
    }

    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("users")
      .find({ _id: userId });

    const user = await result.toArray();

    if (!user[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(user[0]);
  } catch (err) {
    throw new Api500Error(
      "Retrieving user failed",
      undefined,
      `Failed to retrieve user with id ${req.params.id}, ${err.message}`,
    );

    //res.status(500).json({ message: err.message });
  }
});
    //Throwing custom errors.

const createUser = async (req, res) => {
  /*
   #swagger.tags = ['Users']
   #swagger.description = 'Create a user'
   #swagger.parameters['body'] = {
    in: 'body',
    description: 'User information',
    required: true,
    "schema": {
      "type": "object",
      "properties": {
        "firstName": {
          "example": "Jacob"
        },
        "lastName": {
          "example": "Brown"
        },
        "email": {
          "example": "jacob@email.com"
        }
      }
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
        "User Creation Failed",
        undefined,
        "Failed to create a new user.",
      );
      //res.status(500).json({ message: 'Failed to create a new user' });
    }
  } catch (err) {
    //Throwing custom errors.
    throw new Api500Error(
      "User Creation Failed",
      undefined,
      `Error occurred while creating a new user, ${err.message}`,
    );
        //res.status(500).json({ message: err.message });
  }
};



const updateUser = async (req, res) => {
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
      throw new Api404Error(
        "Invalid User ID",
        undefined,
        `The provided user id ${req.params.id} is not a valid Id.`,
      );
      //return res.status(400).json({ message: 'Invalid user id' });
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
      .collection("users")
      .updateOne({ _id: userId }, user);

    if (response.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: 'User not found or no changes made' });
    }

    res.status(200).json('User was updated successfully');
  } catch (err) {
    //Throwing custom errors.

    throw new Api500Error(
      "User Update Failed",
      undefined,
      `Error occurred while updating user with id ${req.params.id}, ${err.message}`,
    );

    //res.status(500).json({ message: err.message });
  }
};

// Installing async wrapper to al the controllers.
const deleteUser = AsyncWrapper.wrapAsync(async (req, res) => {
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
      throw new Api404Error(
        "Invalid User ID",
        undefined,
        `The provided user id ${req.params.id} is not a valid Id.`,
      );
    }

    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection("users")
      .deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json('User was removed successfully');
  } catch (err) {
    //Throwing custom errors.

    throw new Api500Error(
      "User Deletion Failed",
      undefined,
      `Error occurred while deleting user with id ${req.params.id}, ${err.message}`,
    );

    //res.status(500).json({ message: err.message });
  }
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
