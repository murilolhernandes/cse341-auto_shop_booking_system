const swaggerAutogen = require('swagger-autogen')();
const car = require('./models/car');
const user = require('./models/user');
const client = require('./models/client');
const appointment = require('./models/appointment');
// We cannot forget to manually change the swagger.json to the Render's URL and the schemes to 'https' when testing on the website.
const doc = {
  info: {
    title: 'Auto Shop Booking System API',
    description: 'Auto Shop Booking System API',
  },
  definitions: {
    Client: client,
    Car: car,
    User: user,
    Appointment: appointment,
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
