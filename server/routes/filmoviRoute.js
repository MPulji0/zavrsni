const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/', (req, res) => {
	const filmoviPath = path.join(global.publicFolderPath, 'filmovi.html')
    return res.status(200).sendFile(filmoviPath)
})

router.get('/:movieName', (req, res) => {
    // const movieName = req.params
    // console.log('movieNAMEEE')
    // console.log(movieName)
    const filePath = path.join(__dirname, 'filmovi/Johnny_English.mp4')
    const stat = fs.statSync(filePath)
    const fileSize = stat.size;
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
        const src = fs.createReadStream(filePath, {start, end})
        src.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        }
        res.writeHead(200,head)
        const src = fs.createReadStream(filePath)
        src.pipe(res)
        
    }
})

module.exports = router