const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  /*
   #swagger.tags = ['Users']
   #swagger.description = 'Get all users'
  */
  try {
    const result = await mongodb.getDb().db().collection('users').find();

    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  /*
   #swagger.tags = ['Users']
   #swagger.description = 'Get a user by id'
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('users')
      .find({ _id: userId });

    const user = await result.toArray();

    if (!user[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
      return res
        .status(500)
        .json({ message: 'Some error occurred while creating the user.' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
      return res.status(400).json({ message: 'Invalid user id' });
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

    if (response.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: 'User not found or no changes made' });
    }

    res.status(200).json("User was updated successfully");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
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
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json("User was removed successfully");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
