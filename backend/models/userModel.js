const mongoose = require('mongoose')

const user = new mongoose.Schema({
    email: {type: String, unique: true},
    password: String,
    authToken: String,
})

module.exports = mongoose.model('user', user);