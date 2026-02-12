const swaggerAutogen = require('swagger-autogen')();
const car = require('./models/car');
const user = require('./models/user');
const client = require('./models/client');
// We cannot forget to manually change the swagger.json to the Render's URL and the schemes to 'https' when testing on the website.
const doc = {
  info: {
    title: 'Auto Shop Booking System API',
    description: 'Auto Shop Booking System API',
  },
  schemes: ['http', 'https'],
  definitions: {
    Car: car,
    User: user,
    Client: client,
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
