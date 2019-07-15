// Biblioteke
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fs = require('fs') // Za file system (citanje i pisanje fileova)
const fileUpload = require('express-fileupload')

const PORT = 8080

// Globalne varijable
global.url = 'mongodb://localhost:27017'
global.publicFolderPath = path.join(__dirname, '../public')
global.dbName = 'zavrsni'
global.port = PORT

// Korisnicke biblioteke
const dbHelper = require('./dbHelper')

const filmoviRoute = require('./routes/filmoviRoute')
const loginRoute = require('./routes/loginRoute')
const uploadRoute = require('./routes/uploadRoute')
const registerRoute = require('./routes/registerRoute')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(fileUpload())

// Routes
app.use('/login',        loginRoute)
app.use('/register',     registerRoute)
app.use('/upload',       uploadRoute)
app.use('/filmovi',      filmoviRoute)

app.use(express.static(global.publicFolderPath))

app.get('/', (req, res) => {
    console.log(req.ip)
    return res.status(200).sendFile('index.html')
})

app.post('/signout', (req, res) => {
    return res.clearCookie('uname').status(200).redirect('/')
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`))
