require('dotenv').config();
const mongoose = require('mongoose')
const URI = process.env.DB_URI;

mongoose.set('strictQuery', true)
mongoose.connect(URI);

const start = () => {
  mongoose.connection.on('Error', () => console.log('Error connecting database.'))
  mongoose.connection.once('Success', () => console.log('Connected to database'));
};

module.exports = {start};