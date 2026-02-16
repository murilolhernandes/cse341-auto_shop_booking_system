const { getDb } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const Api400Error = require('../error-handling/api400Error');
const Api404Error = require('../error-handling/api404Error');
const Api500Error = require('../error-handling/api500Error');
const AsyncWrapper = require('../error-handling/AsyncWrapper');

async function getDbCollection() {
  return getDb().db().collection('appointments');
}

const findAll = AsyncWrapper.wrapAsync(async (req, res, next) => {
  const collection = await getDbCollection();
  /*
   #swagger.tags = ['Appointments']
   #swagger.description = 'Find all appointments'
  */

  try {
    const result = await collection.find();
    const appointments = await result.toArray();

    res.setHeader('Content-type', 'application/json');
    return res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
});

const findOne = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /*
   #swagger.tags = ['Appointments']
   #swagger.description = 'Find an appointment by id'
  */

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error(
        'Invalid Appointment ID Format',
        undefined,
        `The provided appointment ID ${req.params.id} is not a valid ID format.`
      );
    }
    const id = new ObjectId(req.params.id);
    const collection = await getDbCollection();
    const result = await collection.find({ _id: id });
    const appointments = await result.toArray();

    if (!appointments.length) {
      throw new Api404Error(
        'Appointment was not found',
        undefined,
        `Error occurred while searching appointment with ID ${req.params.id}.`
      );
    }

    res.setHeader('Content-type', 'application/json');
    return res.status(200).json(appointments[0]);
  } catch (error) {
    next(error);
  }
});

const create = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /*
   #swagger.tags = ['Appointments']
   #swagger.description = 'Create a new appointment'
   #swagger.parameters['body'] = {
    in: 'body',
    description: 'Appointment information',
    required: true,
    schema: { $ref: '#/definitions/Appointment' }
   }
  */
  try {
    const db = getDb().db();

    if (req.body.userId) {
      if (!ObjectId.isValid(req.body.userId)) {
        throw new Api400Error('Invalid User ID format');
      }
      const userId = new ObjectId(req.body.userId);
      const userExists = await db.collection('users').findOne({ _id: userId });
      if (!userExists) throw new Api404Error('User not found');
      req.body.userId = userId;
    }

    if (req.body.clientId) {
      if (!ObjectId.isValid(req.body.clientId)) {
        throw new Api400Error('Invalid Client ID format');
      }
      const clientId = new ObjectId(req.body.clientId);
      const clientExists = await db
        .collection('clients')
        .findOne({ _id: clientId });
      if (!clientExists) throw new Api404Error('Client not found');
      req.body.clientId = clientId;
    }

    if (req.body.carId) {
      if (!ObjectId.isValid(req.body.carId)) {
        throw new Api400Error('Invalid Car ID format');
      }
      const carId = new ObjectId(req.body.carId);
      const carExists = await db.collection('cars').findOne({ _id: carId });
      if (!carExists) throw new Api404Error('Car not found');
      req.body.carId = carId;
    }

    const appointment = {
      userId: req.body.userId,
      clientId: req.body.clientId,
      carId: req.body.carId,
      date: req.body.date,
    };

    const collection = await getDbCollection();

    const result = await collection.insertOne(appointment);

    if (result.acknowledged) {
      return res.status(201).json({ id: result.insertedId });
    } else {
      throw new Api500Error(
        'Appointment Creation Failed',
        undefined,
        'Failed to create a new appointment.'
      );
    }
  } catch (error) {
    next(error);
  }
});

const update = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /*
   #swagger.tags = ['Appointments']
   #swagger.description = 'Update an appointment by id'
   #swagger.parameters['body'] = {
    in: 'body',
    description: 'Appointment information',
    required: true,
    "schema": {
      "type": "object",
      "properties": {
        "userId": {
          "example": "698cd47d51e7d72397d70169"
        },
        "clientId": {
          "example": "69839a8d2c2aa925aa337a79"
        },
        "carId": {
          "example": "69839a192c2aa925aa337a67"
        },
        "date": {
          "example": "02/13/2026"
        }
      }
    }
  */

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error(
        'Invalid Appointment ID Format',
        undefined,
        `The provided appointment ID ${req.params.id} is not a valid ID format.`
      );
    }
    const id = new ObjectId(req.params.id);
    const collection = await getDbCollection();
    const db = getDb().db();

    if (req.body.userId) {
      if (!ObjectId.isValid(req.body.userId)) {
        throw new Api400Error('Invalid User ID format');
      }
      const userId = new ObjectId(req.body.userId);
      const userExists = await db.collection('users').findOne({ _id: userId });
      if (!userExists) throw new Api404Error('User not found');
      req.body.userId = userId;
    }

    if (req.body.clientId) {
      if (!ObjectId.isValid(req.body.clientId)) {
        throw new Api400Error('Invalid Client ID format');
      }
      const clientId = new ObjectId(req.body.clientId);
      const clientExists = await db
        .collection('clients')
        .findOne({ _id: clientId });
      if (!clientExists) throw new Api404Error('Client not found');
      req.body.clientId = clientId;
    }

    if (req.body.carId) {
      if (!ObjectId.isValid(req.body.carId)) {
        throw new Api400Error('Invalid Car ID format');
      }
      const carId = new ObjectId(req.body.carId);
      const carExists = await db.collection('cars').findOne({ _id: carId });
      if (!carExists) throw new Api404Error('Car not found');
      req.body.carId = carId;
    }

    const updateFilter = {
      $set: req.body,
    };

    const result = await collection.updateOne({ _id: id }, updateFilter);

    if (result.matchedCount === 0) {
      throw new Api404Error(
        'Appointment was not found',
        undefined,
        `Error occurred while searching appointment with ID ${req.params.id}`
      );
    }

    if (result.acknowledged) {
      return res.status(200).json('Appointment was updated successfully');
    } else {
      throw new Api500Error(
        'Appointment Update Failed',
        undefined,
        `Error occurred while updating appointment with ID ${req.params.id}`
      );
    }
  } catch (error) {
    next(error);
  }
});

const remove = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /*
   #swagger.tags = ['Appointments']
   #swagger.description = 'Remove an appointment by id'
  */

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error(
        'Invalid Appointment ID Format',
        undefined,
        `The provided appointment ID ${req.params.id} is not a valid ID format.`
      );
    }
    const id = new ObjectId(req.params.id);
    const collection = await getDbCollection();
    const result = await collection.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      return res.status(200).json('Appointment was removed successfully');
    } else {
      throw new Api404Error(
        'Appointment was not found',
        undefined,
        `Error occurred while deleting appointment with ID ${req.params.id}`
      );
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { findAll, findOne, create, update, remove };
