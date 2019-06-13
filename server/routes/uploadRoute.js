const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const userCookie = req.cookies['uname']
    if (!userCookie) {
        return res.status(200).redirect('/?upload=Login-first')
    }

    return res.sendFile('uploadMovie.html', {root:global.publicFolderPath})
})

router.post('/', async (req, res) => {
    const userCookie = req.cookies['uname']
    if (!userCookie) {
        return res.status(200).redirect('/?upload=Login-first')
    }

    let {
        movieFile,
        hrvName,
        engName,
        categories,
        year,
        description,
        trailerLink

    } = req.body

    categories = categories.split(' ')
    console.log(movieFile)
    console.log(categories)
    let movieFileName = movieFile
    movieFile = req.files.movieFile
    console.log(req.files)

    const filmoviPath = path.join(__dirname, '../filmovi')
    fs.writeFile(`${filmoviPath}/${movieFile}`)
})

module.exports = router