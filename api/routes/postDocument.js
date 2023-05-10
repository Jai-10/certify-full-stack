const express = require('express')
const router = express.Router()
const joi = require('joi')
const jwt = require('jsonwebtoken')

const Document = require('../models/CertifyDocument')
const User = require('../models/CertifyUser')
const mongoose = require('mongoose')
const verifyToken = require('./authenticateToken')



const postDocSchema = joi.object({
    userId: joi.string().required(),
    documentTitle: joi.string().min(3).required(),
    documentUrl: joi.string().min(10).required()
})


router.post('/', verifyToken, async (req, res) => {
    const { error } = postDocSchema.validate();

    if (error) {
        res.status(400).json({ message: "Please provide valid data." })
        return;
    }
    else {
        const token = req.cookies.jwt_token;
        if (token) {
            jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
                if (err) {
                    res.status(400).json({ message: "Access denied. Could not verify token." })
                }
                else {
                    const newDoc = new Document({
                        _id: new mongoose.Types.ObjectId(),
                        userId: decodedToken._id,
                        documentTitle: req.body.documentTitle,
                        documentUrl: req.body.documentUrl
                    })
                    newDoc.save()
                        .then(saveResult => {
                            const postId = newDoc._id.toString();
                            const userId = decodedToken._id;
                            User.findByIdAndUpdate(userId,  {$push: {documents: postId}})
                                .then(updateResult => {
                                    res.status(201).json({ message: "Document posted successfully!", res: saveResult })
                                })
                                .catch(err => res.status(500).json({ message: "User documents update error.", err: err }))
                            })
                        .catch(err => res.status(500).json({ message: "Document post error.", error: err }))
                }
            })
        }
        else {
            res.status(400).json({ message: "Access denied." })
        }
    }
})



module.exports = router;