const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const joi = require('joi')
const jwt = require('jsonwebtoken')

const User = require('../models/CertifyUser');


// login
const loginSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(6).required()
})

router.post('/login', async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: "Please provide valid data for logging into your account." })
        return;
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        res.status(400).json({ message: "User does not exist. Create an account to move further." })
        return;
    }

    const isPassSame = await bcrypt.compare(req.body.password, user.password);
    if (isPassSame) {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN)
        // res.cookie('jwt_token', token, {
        //     httpOnly: true      // so we cannot access the token from the frontend
        // })
        res.cookie('jwt_token', token, {
            httpOnly: false
        })

        res.status(201).json({ message: "Login successful!", userDetails: user })
        return;
    }
    else {
        res.status(400).json({ message: "Incorrect Password." })
        return;
    }
})








// signup
const signupSchema = joi.object({
    username: joi.string().min(3).max(20).required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(6).required()
})

router.post('/signup', async (req, res) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: "Please provide valid data for signing up." })
        return;
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(400).json({ message: "User already exists. Try logging in." })
        return;
    }

    const saltRounds = 12;
    const hashedPass = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPass
    })

    newUser.save()
        .then(result => {
            // jwt.sign(payload, secret)
            const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_TOKEN)
            res.cookie('jwt_token', token, {
                httpOnly: true      // so we cannot access the token from the frontend
            })

            res.status(201).json({ message: "Sign up successful!", newUserDetails: result })
        })
        .catch(err => res.status(500).json({ message: "Signup error." }))
})





// log out
router.get('/logout', (req, res, next) => {
    res.clearCookie('jwt_token');
    res.status(200).json({ message: "User has been logged out successfully." });
})





module.exports = router;