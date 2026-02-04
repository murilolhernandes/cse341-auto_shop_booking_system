const { getDb } = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

async function getDbCollection() {
  return getDb().db().collection("clients");
}

async function findAll(req, res) {
  const collection = await getDbCollection();

  try {
    const result = await collection.find();
    const clients = await result.toArray();

    res.setHeader("Content-type", "application/json");
    return res.status(200).json(clients);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Oops! Something went wrong");
  }
}

async function findOne(req, res) {
  const id = new ObjectId(req.params.id);
  const collection = await getDbCollection();

  try {
    const result = await collection.find({ _id: id });
    const clients = await result.toArray();

    if (!clients.length) return res.status(404).json("record not found");

    res.setHeader("Content-type", "application/json");
    return res.status(200).json(clients[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Oops! Something went wrong");
  }
}

async function create(req, res) {
  const { firstName, lastName, email, phone, dob } = req.body;

  const data = {
    firstName,
    lastName,
    email,
    phone,
    dob
  };

  const collection = await getDbCollection();

  try {
    result = await collection.insertOne(data);

    if (result.acknowledged) {
      return res.status(201).json({ id: result.insertedId });
    } else throw new Error("failed to create new client");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Oops! Something went wrong");
  }
}

async function update(req, res) {
  const id = new ObjectId(req.params.id);
  const collection = await getDbCollection();

  const { firstName, lastName, email, phone, dob } = req.body;

  const updateFilter = {
    $set: req.body,
  };
  try {
    const result = await collection.updateOne({ _id: id }, updateFilter);

    if (result.acknowledged) {
      return res.sendStatus(204);
    } else throw new Error("failed to update client");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Oops! Something went wrong");
  }
}
async function remove(req, res) {
  const id = new ObjectId(req.params.id);
  const collection = await getDbCollection();

  try {
    const result = await collection.deleteOne({ _id: id });

    if (result.acknowledged && result.deletedCount == 0) {
      return res.status(404).json("record not found");
    }

    if (result.deletedCount > 0) {
      return res.sendStatus(204);
    } else throw new Error("failed to delete client");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Oops! Something went wrong");
  }
}

module.exports = { findAll, findOne, create, update, remove };
