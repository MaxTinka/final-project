const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE 341 Final Project API Documentation',
    description: 'Library App'
  },
    host: process.env.SWAGGER_HOST, //this way it will switch between local hosting and render
    schemes: [process.env.SWAGGER_SCHEME] //to switch from http for local testing to https for render    
};

const outputFile = './swagger-output.json';

//Endpoint is server.js because routes are listed there
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);