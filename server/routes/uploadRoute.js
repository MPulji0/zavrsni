const express = require('express')
const path = require('path')
const moviesModel = require('../models/moviesModel')

const router = express.Router()

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
    const movieFile = req.files.movieFile
    console.log(movieFile)

    // Uploadanje file-a na server u folder /filmovi
    const filmoviPath = path.join(__dirname, '../filmovi', `${movieFile.name}`)
    movieFile.mv(filmoviPath, (err) => {
        if (err) {
            console.error(err)
            return res.redirect('/?upload=Failed')
        }
    })

    // Spremanje podataka o filmu u bazu podataka
    const newMovie = new moviesModel({
        hashName: movieFile.md5,
        hrvName,
        engName,
        categories,
        length: 5,
        year,
        description,
        trailerLink
    })
    
    let result = undefined
    try {
        result = await newMovie.save()
    } catch(error) {
        console.error(error)
        return res.redirect('/?upload=Failed')
    }

    console.log('Movie added to a database.')
    return res.redirect('/?upload=Success')
})

module.exports = router