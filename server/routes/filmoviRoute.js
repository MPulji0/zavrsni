const express = require('express')
const path = require('path')
const fs = require('fs')
const mime = require('mime')

const moviesModel = require('../models/moviesModel')
const router = express.Router()

const filmoviPath = path.join(__dirname, '..', 'filmovi')

router.get('/', (req, res) => {
	const filmovi = path.join(global.publicFolderPath, 'filmovi.html')
    return res.status(200).sendFile(filmovi)
})

// Ova ruta se koristi za dohvatiti sve filmove iz baze podataka koji ce posluziti
// za '/' rutu za filmovi.html da ih sve prikazemo u izborniku
router.get('/data', async (req, res) => {
    let data = undefined
    try {
        // hasName: 0 znaci da ne zelimo njega imati u data
        data = await moviesModel.find({}, { _id: 0, __v: 0 }).lean().exec()
    } catch(error) {
        console.log(error)
        return res.redirect('/filmovi?getData=Failed')
    }

    for (let i = 0; i < data.length; i++) {
        let image = undefined
        try{
            image = fs.readFileSync(
                `${filmoviPath}/${data[i].hashName}/${data[i].hashImageName}`)
            
            data[i].imgFile = image.toString('base64')
            data[i].ext = path.extname(data[i].hashImageName)
        } catch(err) {
            console.error(err)
        }
        
        delete data[i].hashImageName
    }

    return res.json(data)
})

// Koristi se da posluzi gledajFilm.html file
router.get('/gledaj', (req, res) => {
    // const gledajPath = path.join(global.publicFolderPath, 'gledajFilm.html')
    return res.status(200).sendFile('gledajFilm.html', { root: global.publicFolderPath })
})

// Koristi se za prijenos stream-a
router.get('/gledaj/:hash', (req, res) => {
    const movieFolderPath = path.join(filmoviPath, req.params.hash)
    const movieFilePath = path.join(movieFolderPath, req.query.movie)
    let stat = undefined
    
    try {
        stat = fs.statSync(movieFilePath)
    } catch(err) {
        console.error(err)
        return res.redirect('/?stream=Failed')
    }

    const fileSize = stat.size
    const range = req.headers.range

    if(range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1],10) :  fileSize - 1
        console.log(parts)
        console.log(start)
        console.log(end)
        const chunkSize = (end - start) + 1

        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        }

        res.writeHead(206,head)
        const src = fs.createReadStream(movieFilePath, {start, end})
        src.pipe(res)
    } else {
        let head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        }
        res.writeHead(200,head)
        const src = fs.createReadStream(movieFilePath)
        src.pipe(res)
    }
})

// Ruta za titlove filma ako postoje
router.get('/gledaj/subs/:hash', (req, res) => {
    const movieFolderPath = path.join(filmoviPath, req.params.hash)
    const movieFilePath = path.join(movieFolderPath, req.query.movie)
    let subtitleFilePath = undefined

    // Procitaj file-ove u movieFolder direktoriju da vidimo postoji li za
    // ovaj film prijevod. Ako postoji, koristimo ga za slanje korisniku.
    const filesInDir = fs.readdirSync(movieFolderPath)

    const subsResult = filesInDir.filter(el => {
        const ext = path.extname(el)
        if (ext === '.txt' || ext === '.srt' || ext === '.vtt') return true
        return false
    })

    // Ako je pronaden prijevod
    if (subsResult.length > 0) {
        // Ako ima i vise prijevoda, uzmi samo prvi.
        const subtitleName = subsResult[0]
        subtitleFilePath = path.join(movieFolderPath, subtitleName)
    }

    // Ako je pronaden prijevod, posalji ga
    if (!!subtitleFilePath) {
        const head = {
            'Content-Type': mime.getType(path.extname(subtitleFilePath))
        }
        res.header(head)
        return res.download(subtitleFilePath)
    }
    return res.status(404).json('failed')
})

module.exports = router