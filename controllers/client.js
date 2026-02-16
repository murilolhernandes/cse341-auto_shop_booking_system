const { getDb } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const Api400Error = require('../error-handling/api400Error');
const Api404Error = require('../error-handling/api404Error');
const Api500Error = require('../error-handling/api500Error');
const AsyncWrapper = require('../error-handling/AsyncWrapper');

async function getDbCollection() {
  return getDb().db().collection('clients');
}

const findAll = AsyncWrapper.wrapAsync(async (req, res, next) => {
  const collection = await getDbCollection();
  /*
    #swagger.tags = ['Clients']
    #swagger.description = 'Find all clients'
  */

  try {
    const result = await collection.find();
    const clients = await result.toArray();

    res.setHeader('Content-type', 'application/json');
    return res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
});

const findOne = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /* 
    #swagger.tags = ['Clients']
    #swagger.description = 'Find a client by id'
  */

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error(
        'Invalid Client ID Format',
        undefined,
        `The provided client ID ${req.params.id} is not a valid ID format.`
      );
    }
    const id = new ObjectId(req.params.id);
    const collection = await getDbCollection();
    const result = await collection.find({ _id: id });
    const clients = await result.toArray();

    if (!clients.length) {
      throw new Api404Error(
        'Client was not found',
        undefined,
        `Error occurred while searching client with ID ${req.params.id}.`
      );
    }

    res.setHeader('Content-type', 'application/json');
    return res.status(200).json(clients[0]);
  } catch (error) {
    next(error);
  }
});

const create = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /*
   #swagger.tags = ['Clients']
   #swagger.description = 'Create a new client'
   #swagger.parameters['body'] = {
    in: 'body',
    description: 'Client information',
    required: true,
    schema: { $ref: '#/definitions/Client' }
   }
  */
  const { firstName, lastName, email, phone, dob } = req.body;

  const data = {
    firstName,
    lastName,
    email,
    phone,
    dob,
  };

  const collection = await getDbCollection();

  try {
    const result = await collection.insertOne(data);

    if (result.acknowledged) {
      return res.status(201).json({ id: result.insertedId });
    } else {
      throw new Api500Error(
        'Client Creation Failed',
        undefined,
        'Failed to create a new client.'
      );
    }
  } catch (error) {
    next(error);
  }
});

const update = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /*
   #swagger.tags = ['Clients']
   #swagger.description = 'Update a client by id'
   #swagger.parameters['body'] = {
    in: 'body',
    description: 'Client information',
    required: true,
    "schema": {
      "type": "object",
      "properties": {
        "firstName": {
          "example": "Peter"
        },
        "lastName": {
          "example": "Hamming"
        },
        "email": {
          "example": "peter@email.com"
        },
        "phone": {
          "example": "340-524-3857"
        },
        "dob": {
          "example": "07/02/1998"
        }
      }
    }
  */

  const updateFilter = {
    $set: req.body,
  };
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error(
        'Invalid Client ID Format',
        undefined,
        `The provided client ID ${req.params.id} is not a valid ID format.`
      );
    }
    const id = new ObjectId(req.params.id);
    const collection = await getDbCollection();
    const result = await collection.updateOne({ _id: id }, updateFilter);

    if (result.matchedCount === 0) {
      throw new Api404Error(
        'Client was not found',
        undefined,
        `Error occurred while searching client with ID ${req.params.id}`
      );
    }

    if (result.acknowledged) {
      res.status(200).json({ message: 'Client updated successfully' });
    } else {
      throw new Api500Error(
        'Client Update Failed',
        undefined,
        `Error occurred while updating client with ID ${req.params.id}`
      );
    }
  } catch (error) {
    next(error);
  }
});

const remove = AsyncWrapper.wrapAsync(async (req, res, next) => {
  /*
   #swagger.tags = ['Clients']
   #swagger.description = 'Remove a client by id'
  */

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Api400Error(
        'Invalid Client ID Format',
        undefined,
        `The provided client ID ${req.params.id} is not a valid ID format.`
      );
    }
    const id = new ObjectId(req.params.id);
    const collection = await getDbCollection();
    const result = await collection.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      return res.status(200).json('Client was removed successfully');
    } else {
      throw new Api404Error(
        'Client was not found',
        undefined,
        `Error occurred while deleting client with ID ${req.params.id}`
      );
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { findAll, findOne, create, update, remove };
