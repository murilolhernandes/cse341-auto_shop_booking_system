const ObjectId = require('mongodb').ObjectId;
const { carSchema } = require('../validation/carSchema');
const Api400Error = require('../error-handling/api400Error');
const Api404Error = require('../error-handling/api404Error');
const { getDb } = require('../db/connect');

const collectionName = 'cars';

async function getDbCollection() {
  return getDb().db().collection(collectionName);
}

const getAll = async (req, res, next) => {
  /*
  #swagger.tags = ['Cars']
  #swagger.description = 'Get all cars'
  */
  try {
    const collection = await getDbCollection();
    const result = await collection.find({});
    const cars = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(cars);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  /*
  #swagger.tags = ['Cars']
  #swagger.description = 'Get a car by id'
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error('Invalid car id');
    }
    const carId = new ObjectId(req.params.id);
    const collection = await getDbCollection();
    const result = await collection.find({ _id: carId });

    const cars = await result.toArray();

    if (cars.length === 0) {
      throw new Api404Error('Car not found');
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(cars[0]);
  } catch (err) {
    next(err);
  }
};

const createCar = async (req, res, next) => {
  /* 
  #swagger.tags = ['Cars']
  #swagger.description = 'Create a new car'
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Car information',
    required: true,
    schema: { $ref: '#/definitions/Car' }
  }
  */
  try {
    const validateResult = await carSchema.validateAsync(req.body);

    if (validateResult.clientId) {
      if (!ObjectId.isValid(validateResult.clientId)) {
        return res.status(400).json('Invalid Client ID format');
      }
      const clientId = new ObjectId(validateResult.clientId);
      const clientExists = await getDb()
        .db()
        .collection('clients')
        .findOne({ _id: clientId });
      if (!clientExists) return res.status(404).json('Client not found');
      validateResult.clientId = clientId;
    }

    const collection = await getDbCollection();
    const result = await collection.insertOne(validateResult);

    if (result.acknowledged) {
      res.setHeader('Content-Type', 'application/json');
      res.status(201).json({ id: result.insertedId });
    } else {
      throw new Error('Failed to create car');
    }
  } catch (err) {
    if (err.isJoi) {
      next(new Api400Error(err.message));
    } else {
      next(err);
    }
  }
};

const updateCar = async (req, res, next) => {
  /* 
  #swagger.tags = ['Cars']
  #swagger.description = 'Update a car by id'
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Car information',
    required: true,
    schema: { $ref: '#/definitions/Car' }
  }
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error('Invalid car id');
    }
    const carId = new ObjectId(req.params.id);
    const validateResult = await carSchema.validateAsync(req.body);

    if (validateResult.clientId) {
      if (!ObjectId.isValid(validateResult.clientId)) {
        return res.status(400).json('Invalid Client ID format');
      }
      const clientId = new ObjectId(validateResult.clientId);
      const clientExists = await getDb()
        .db()
        .collection('clients')
        .findOne({ _id: clientId });
      if (!clientExists) return res.status(404).json('Client not found');
      validateResult.clientId = clientId;
    }

    const collection = await getDbCollection();
    const result = await collection.updateOne(
      { _id: carId },
      { $set: validateResult }
    );
    if (result.modifiedCount > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: 'Car updated successfully' });
    } else if (result.matchedCount === 0) {
      throw new Api404Error('Car not found');
    } else {
      throw new Api400Error('No changes made to car, bad request');
    }
  } catch (err) {
    if (err.isJoi) {
      next(new Api400Error(err.message));
    } else {
      next(err);
    }
  }
};

const deleteCar = async (req, res, next) => {
  /*
  #swagger.tags = ['Cars']
  #swagger.description = 'Delete a car by id'
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error('Invalid car id');
    }
    const carId = new ObjectId(req.params.id);
    const collection = await getDbCollection();
    const result = await collection.deleteOne({ _id: carId });
    if (result.deletedCount > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: 'Car deleted successfully' });
    } else {
      throw new Api404Error('Car not found');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  createCar,
  updateCar,
  deleteCar,
};
