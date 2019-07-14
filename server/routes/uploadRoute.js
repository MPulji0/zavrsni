const express = require('express')
const path = require('path')
const fs = require('fs')

const moviesModel = require('../models/moviesModel')
const router = express.Router()

// Uploadanje file-a na server u folder /filmovi
const filmoviPath = path.join(__dirname, '../filmovi')

router.get('/', (req, res) => {
    const userCookie = req.cookies['uname']
    if (!userCookie) {
        return res.status(200).redirect('/?upload=Login-first')
    }

    return res.sendFile('uploadMovie.html', { root:global.publicFolderPath })
})

router.post('/', async (req, res) => {
    const userCookie = req.cookies['uname']
    if (!userCookie) {
        return res.status(200).redirect('/?upload=Login-first')
    }

    let {
        hrvName,
        engName,
        categories,
        year,
        description,
        trailerLink
    } = req.body

    if (!req.files) return res.redirect('/?file=None')

    categories = categories.split(' ')
    const { movieFile, movieImage, movieSubs } = req.files

    // Ime novog foldera za film
    const newMovieFolder = path.join(filmoviPath, movieFile.md5)

    // Ako ne postoji folder filmovi, kreiraj ga.
    // Ovaj uvjet ce se samo prvi put izvrsiti kada se stvori projekt.
    if (!fs.existsSync(filmoviPath)) {
        fs.mkdirSync(filmoviPath)
    }
    // Ako folder (film) ne postoji, kreiraj folder unutar foldera filmovi
    if (!fs.existsSync(newMovieFolder)) {
        fs.mkdirSync(newMovieFolder)
    }

    let saveRes = saveFileToServer(path.join(newMovieFolder, movieFile.name), movieFile)
    console.log(saveRes)
    if (!saveRes) return res.redirect('/?movUpload=Failed')

    saveRes = saveFileToServer(path.join(newMovieFolder, movieImage.name), movieImage)
    if (!saveRes) return res.redirect('/?imgUpload=Failed')

    const subtitleNewName = `${movieFile.name}${path.extname(movieSubs.name)}`
    console.log('Sub name:')
    console.log(subtitleNewName)
    saveRes = saveFileToServer(path.join(newMovieFolder, subtitleNewName), movieSubs)
    if (!saveRes) return res.redirect('/?subUpload=Failed')


    // Spremanje podataka o filmu u bazu podataka
    const newMovie = new moviesModel({
        hashName: movieFile.md5,
        movieName: movieFile.name,
        hashImageName: movieImage.name,
        hrvName,
        engName,
        categories,
        length: 5,                                              // ****************** TODO ******************
        year,
        description,
        trailerLink
    })
    
    let result = undefined
    try {
        result = await newMovie.save()
    } catch(error) {
        console.error(error)
        return res.redirect('/?dbUpload=Failed')
    }

    console.log('Movie added to a database.')
    return res.redirect('/?upload=Success')
})

function saveFileToServer(path, fileObj) {
    fileObj.mv(path, err => {
        if (err) {
            console.error(err)
            return false
        }
    })
    return true
}

module.exports = router