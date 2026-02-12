const { getDb } = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

async function getDbCollection() {
  return getDb().db().collection("appointments");
}

async function findAll(req, res) {
  const collection = await getDbCollection();
  /*
   #swagger.tags = ['Appointments']
   #swagger.description = 'Find all appointments'
  */

  try {
    const result = await collection.find();
    const appointments = await result.toArray();

    res.setHeader("Content-type", "application/json");
    return res.status(200).json(appointments);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Oops! Something went wrong");
  }
}

async function findOne(req, res) {
  const id = new ObjectId(req.params.id);
  const collection = await getDbCollection();
  /*
   #swagger.tags = ['Appointments']
   #swagger.description = 'Find an appointment by id'
  */

  try {
    const result = await collection.find({ _id: id });
    const appointments = await result.toArray();

    if (!appointments.length) return res.status(404).json("Record not found");

    res.setHeader("Content-type", "application/json");
    return res.status(200).json(appointments[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Oops! Something went wrong");
  }
}

async function create(req, res) {
  /*
   #swagger.tags = ['Appointments']
   #swagger.description = 'Create a new appointment'
   #swagger.parameters['body'] = {
    in: 'body',
    description: 'Appointment information',
    required: true,
    "schema": {
      "type": "object",
      "properties": {
        "userId": {
          "example": "698cd7c051e7d72397d7016a"
        },
        "clientId": {
          "example": "69839a8d2c2aa925aa337a77"
        },
        "carId": {
          "example": "69839a192c2aa925aa337a66"
        },
        "date": {
          "example": "02/12/2026"
        }
      }
    }
  */
  try {
    const db = getDb().db();

    if (req.body.userId) {
      if (!ObjectId.isValid(req.body.userId)) {
        return res.status(400).json('Invalid User ID format');
      }
      const userId = new ObjectId(req.body.userId);
      const userExists = await db.collection('users').findOne({ _id: userId });
      if (!userExists) return res.status(404).json("User not found");
      req.body.userId = userId;
    }

    if (req.body.clientId) {
      if (!ObjectId.isValid(req.body.clientId)) {
        return res.status(400).json('Invalid Client ID format');
      }
      const clientId = new ObjectId(req.body.clientId);
      const clientExists = await db.collection('clients').findOne({ _id: clientId });
      if (!clientExists) return res.status(404).json("Client not found");
      req.body.clientId = clientId;
    }

    if (req.body.carId) {
      if (!ObjectId.isValid(req.body.carId)) {
        return res.status(400).json('Invalid Car ID format');
      }
      const carId = new ObjectId(req.body.carId);
      const carExists = await db.collection('cars').findOne({ _id: carId });
      if (!carExists) return res.status(404).json("Car not found");
      req.body.carId = carId;
    }

    const appointment = {
      userId: req.body.userId,
      clientId: req.body.clientId,
      carId: req.body.carId,
      date: req.body.date
    };

    const collection = await getDbCollection();

    const result = await collection.insertOne(appointment);

    if (result.acknowledged) {
      return res.status(201).json({ id: result.insertedId });
    } else throw new Error("Failed to create new appointment");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Oops! Something went wrong");
  }
}

async function update(req, res) {
  const id = new ObjectId(req.params.id);
  const collection = await getDbCollection();
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
    const db = getDb().db();

    if (req.body.userId) {
      if (!ObjectId.isValid(req.body.userId)) {
        return res.status(400).json('Invalid User ID format');
      }
      const userId = new ObjectId(req.body.userId);
      const userExists = await db.collection('users').findOne({ _id: userId });
      if (!userExists) return res.status(404).json("User not found");
      req.body.userId = userId;
    }

    if (req.body.clientId) {
      if (!ObjectId.isValid(req.body.clientId)) {
        return res.status(400).json('Invalid Client ID format');
      }
      const clientId = new ObjectId(req.body.clientId);
      const clientExists = await db.collection('clients').findOne({ _id: clientId });
      if (!clientExists) return res.status(404).json("Client not found");
      req.body.clientId = clientId;
    }

    if (req.body.carId) {
      if (!ObjectId.isValid(req.body.carId)) {
        return res.status(400).json('Invalid Car ID format');
      }
      const carId = new ObjectId(req.body.carId);
      const carExists = await db.collection('cars').findOne({ _id: carId });
      if (!carExists) return res.status(404).json("Car not found");
      req.body.carId = carId;
    }

    const updateFilter = {
      $set: req.body,
    };

    const result = await collection.updateOne({ _id: id }, updateFilter);

    if (result.matchedCount === 0) {
      return res.status(404).json("Record not found");
    }

    if (result.acknowledged) {
      return res.status(200).json("Appointment was updated successfully");
    } else throw new Error("Failed to update appointment");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Oops! Something went wrong");
  }
}

async function remove(req, res) {
  const id = new ObjectId(req.params.id);
  const collection = await getDbCollection();
  /*
   #swagger.tags = ['Appointments']
   #swagger.description = 'Remove an appointment by id'
  */

  try {
    const result = await collection.deleteOne({ _id: id });

    if (result.acknowledged && result.deletedCount === 0) {
      return res.status(404).json("Record not found");
    }

    if (result.deletedCount > 0) {
      return res.status(200).json("Appointment was removed successfully");
    } else throw new Error("Failed to delete appointment");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Oops! Something went wrong");
  }
}

module.exports = { findAll, findOne, create, update, remove };
