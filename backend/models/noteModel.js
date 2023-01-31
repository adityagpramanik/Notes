const mongoose = require('mongoose')

const note = new mongoose.Schema({
    head: String,
    body: String,
    tags: Array,
})

module.exports = mongoose.model('note', note);