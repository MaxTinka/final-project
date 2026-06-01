const mongoose = require('mongoose');

const patronSchema = new mongoose.Schema({
    provider: String, //github and google--github for initial testing purposes, add google later
    providerId: String, //github.id or google.id
    username: String,
    email: String
});

//Third entry is the name of the collection on MongoDB
const Patron = mongoose.model('Patron', patronSchema, 'patron');

module.exports = Patron;