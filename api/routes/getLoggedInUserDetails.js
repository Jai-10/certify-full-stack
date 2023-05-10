const jwt = require('jsonwebtoken')
const User = require('../models/CertifyUser')
const router = require('express').Router();


router.get('/', (req, res) => {
    const token = req.cookies.jwt_token

    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN, async function(err, decodedToken) {
            if (!err) {
                const user = await User.findById(decodedToken._id)
                res.status(200).json({ message: "Logged-in user found.", loggedInUser: user })
            }
            else {
                res.status(400).json({ message: "Access denied.", loggedInUser: null })
            }
        })
    }
    else {
        res.status(200).json({ message: "No user is logged in.", loggedInUser: null })
    }
})


module.exports = router;