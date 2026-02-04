
const { application, json } = require('express');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const createUsers = async (req, res) => {
    try {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        email: req.body.email,
        phone: req.body.phone,
        userName: req.body.userName,
        password: req.body.password,
        permission: [
            req.body.permission
        ]
    };
    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while creating user.');
    }}
    catch (error) {
        console.log(error);
    };
};

const deleteUsers = async (req, res) => {
    try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while deleting user.');
    }}
    catch (error) {
        console.log(error);
    };
};

module.exports = {
    createUsers,
    deleteUsers
};