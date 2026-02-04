
const { application, json } = require('express');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try{
    const result = await mongodb.getDatabase().db().collection('clients').find();
    result.toArray().then((clients) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(clients);
    })}
    catch (error) {
        console.log(error);
    };
};

const getSingle = async (req, res) => {
    try {
    const clientId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('clients').find({ _id: clientId });
    result.toArray().then((clients) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(clients[0]);
    })}
    catch (error) {
        console.log(error);
    };
};

const createClients = async (req, res) => {
    try {
    const client = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        email: req.body.email,
        phone: req.body.phone,
        vehicle: [
            req.body.vehicleName
        ]
    };
    const response = await mongodb.getDatabase().db().collection('clients').insertOne(client);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while creating client.');
    }}
    catch (error) {
        console.log(error);
    };
};

const updateClients = async (req, res) => {
    try {
    const clientId = new ObjectId(req.params.id);
    const client = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        email: req.body.email,
        phone: req.body.phone,
        vehicle: [
            req.body.vehicleName
        ]
    };
    const response = await mongodb.getDatabase().db().collection('clients').replaceOne({ _id: clientId }, client);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while updating client.');
    }}
    catch (error) {
        console.log(error);
    };
}; 

const deleteClients = async (req, res) => {
    try {
    const clientId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('clients').deleteOne({ _id: clientId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while deleting client.');
    }}
    catch (error) {
        console.log(error);
    };
};

module.exports = {
    getAll,
    getSingle,
    createClients,
    updateClients,
    deleteClients
};