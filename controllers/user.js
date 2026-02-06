const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection('users')
      .find();

    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getUserById = async (req, res) => {
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
  try {
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    };
    const response = await mongodb.getDb().db().collection('users').insertOne(newUser);
    if (response.acknowledged) {
      return res.status(201).json({ id: response.insertedId });
    } else {
      return res.status(500).json({ message: 'Some error occurred while creating the user.' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const userId = new ObjectId(req.params.id);
    const user = {
      name: req.body.name,
      email: req.body.email
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .replaceOne({ _id: userId }, user);

    if (response.modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteUser = async (req, res) => {
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

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
