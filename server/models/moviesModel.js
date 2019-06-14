const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.ObjectId

const MoviesSchema = new Schema({
    movieId: ObjectId,
    // Name is hash
    hashName: {
        type: String,
        required: true,
        unique: true
    },
    hashImageName: {
        type: String,
        required: true,
        unique: true
    },
    hrvName: {
        type: String,
        required: true,
        unique: true
    },
    engName: {
        type: String,
        required: true,
        unique: true
    },
    categories: {
        type: [String],
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    trailerLink: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('movies', MoviesSchema)
