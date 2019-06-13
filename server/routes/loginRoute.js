const express = require('express')
const router = express.Router()

const userModel = require('../models/userModel')

router.post('/', async (req, res) => {
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

module.exports = router