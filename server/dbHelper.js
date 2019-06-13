const mongoose = require('mongoose')
const dbName = 'zavrsni'

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', (err) => console.error(err))
db.once('open', () => console.log('Server connected to database'))

module.exports = mongoose