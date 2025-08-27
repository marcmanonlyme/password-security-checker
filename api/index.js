const { app } = require('@azure/functions');

// Import all function handlers
require('./check-breach');

// The app is automatically configured by importing the function files
// No additional setup needed for v4 programming model
