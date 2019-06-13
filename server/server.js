// Biblioteke
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
// const mongoDb = require('mongodb')
const dbHelper = require('./dbHelper')
const cookieParser = require('cookie-parser')
const fs = require('fs') // Za file system (citanje i pisanje fileova)
const userModel = require('./models/userModel')
const moviesModel = require('./models/moviesModel')
const fileUpload = require('express-fileupload')

const url = 'mongodb://localhost:27017';
const publicFolderPath = path.join(__dirname, '../public')
const dbName = 'zavrsni'

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(fileUpload())
app.use(express.static(publicFolderPath))

app.get('/', (req, res) => {
    console.log(req.ip)
    return res.status(200).sendFile('index.html')
})

app.get('/filmovi', (req, res) => {
    const filmoviPath = path.join(publicFolderPath, 'filmovi.html')
    return res.status(200).sendFile(filmoviPath)
})

app.get('/filmovi/:movieName', (req, res) => {
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

app.get('/watchMovie', (req, res) => {
    res.sendFile('watchMovie.html', {root:publicFolderPath})
})

app.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    let doesExist = false
    let result = await userModel.findOne({
        $and: [
            { username },
            { password }
        ]
    })
    if (!!result) {
        return res.cookie('uname',username).status(200).redirect('/')
    }
    return res.status(200).redirect('/?failed=True')
})

app.post('/register', async (req, res) => {
    const { username, 
    password,
    firstname,
    lastname,
    email,
    age } = req.body

    let ageNum = parseInt(age)
    if (ageNum < 13) {
        return res.status(404).send('Ne moze')
    }

    let result = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (!!result) {
        return res.status(200).redirect('/?userExists=True')
    } else {
        newUser = new userModel({
            username,
            password,
            email,
            firstName:firstname,
            lastName: lastname,
            age
        })
        result = await newUser.save()
        if (!!result) {
            return res.cookie('uname',username).status(200).redirect('/')
        }
    }
    return res.status(200).redirect('/?failed=True')
})

app.post('/signout', (req, res) => {
    return res.clearCookie('uname').status(200).redirect('/')
})

app.get('/upload', (req, res) => {
    const userCookie = req.cookies['uname']
    if (!userCookie) {
        return res.status(200).redirect('/?upload=Login-first')
    }

    return res.sendFile('uploadMovie.html', {root:publicFolderPath})
})

app.post('/upload', async (req, res) => {
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

    const filmoviPath = path.join(__dirname, 'filmovi')
    fs.writeFile(`${filmoviPath}/${movieFile}`)
})



app.listen(8080, () => console.log('Server is listening on port 8080!'))