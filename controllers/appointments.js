
const { application, json } = require('express');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try{
    const result = await mongodb.getDatabase().db().collection('appointments').find();
    result.toArray().then((appointments) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(appointments);
    })}
    catch (error) {
        console.log(error);
    };
};

const getSingle = async (req, res) => {
    try {
    const appointmentId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('appointments').find({ _id: appointmentId });
    result.toArray().then((appointments) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(appointments[0]);
    })}
    catch (error) {
        console.log(error);
    };
};

const createAppointments = async (req, res) => {
    try {
    const appointment = {
        date: req.body.date
    };
    const response = await mongodb.getDatabase().db().collection('appointments').insertOne(appointment);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while creating appointment.');
    }}
    catch (error) {
        console.log(error);
    };
};

const updateAppointments = async (req, res) => {
    try {
    const appointmentId = new ObjectId(req.params.id);
    const appointment = {
        date: req.body.date
    };
    const response = await mongodb.getDatabase().db().collection('appointments').replaceOne({ _id: appointmentId }, appointment);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while updating appointment.');
    }}
    catch (error) {
        console.log(error);
    };
}; 

const deleteAppointments = async (req, res) => {
    try {
    const appointmentId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('appointments').deleteOne({ _id: appointmentId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while deleting appointment.');
    }}
    catch (error) {
        console.log(error);
    };
};

module.exports = {
    getAll,
    getSingle,
    createAppointments,
    updateAppointments,
    deleteAppointments
};