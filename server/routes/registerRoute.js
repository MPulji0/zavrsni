const express = require('express')
const router = express.Router()

const userModel = require('../models/userModel')

router.post('/', async (req, res) => {
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

module.exports = router