const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile('watchMovie.html', {root:publicFolderPath})
})

module.exports = router