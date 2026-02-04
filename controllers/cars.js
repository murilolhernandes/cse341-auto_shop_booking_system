
const { application, json } = require('express');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try{
    // swagger.tags = ['Hello World];
    const result = await mongodb.getDatabase().db().collection('cars').find();
    result.toArray().then((cars) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(cars);
    })}
    catch (error) {
        console.log(error);
    };
};

const getSingle = async (req, res) => {
    try {
    // swagger.tags = ['Hello World];
    const carId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('cars').find({ _id: carId });
    result.toArray().then((cars) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(cars[0]);
    })}
    catch (error) {
        console.log(error);
    };
};

const createCars = async (req, res) => {
    try {
    // swagger.tags = ['Hello World];
    const car = {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        engine: req.body.passanger,
        color: req.body.color,
        mileage: req.body.mileage,
        passanger: req.body.passanger
    };
    const response = await mongodb.getDatabase().db().collection('cars').insertOne(car);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while creating car.');
    }}
    catch (error) {
        console.log(error);
    };
};

const updateCars = async (req, res) => {
    try {
    // swagger.tags = ['Hello World];
    const carId = new ObjectId(req.params.id);
    const car = {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        engine: req.body.passanger,
        color: req.body.color,
        mileage: req.body.mileage,
        passanger: req.body.passanger
    };
    const response = await mongodb.getDatabase().db().collection('cars').replaceOne({ _id: carId }, car);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while updating car.');
    }}
    catch (error) {
        console.log(error);
    };
}; 

const deleteCars = async (req, res) => {
    try {
    // swagger.tags = ['Hello World];
    const carId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('cars').deleteOne({ _id: carId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while deleting car.');
    }}
    catch (error) {
        console.log(error);
    };
};

module.exports = {
    getAll,
    getSingle,
    createCars,
    updateCars,
    deleteCars
};