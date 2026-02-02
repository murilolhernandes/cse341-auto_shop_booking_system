const swaggerAutogen = require('swagger-autogen')();

// We cannot forget to manually change the swagger.json to the Render's URL and the schemes to 'https' when testing on the website.
const doc = {
  info: {
    title: 'Auto Shop Booking System API',
    description: 'Auto Shop Booking System API'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);