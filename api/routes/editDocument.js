const express = require('express')
const router = express.Router()
const joi = require('joi')
const jwt = require('jsonwebtoken')

const Document = require('../models/CertifyDocument')
const verifyToken = require('./authenticateToken')


const editDocSchema = joi.object({
    userId: joi.string().required(),
    documentTitle: joi.string().min(3).required()
})


router.put('/:postId', verifyToken, (req, res) => {
    const { error } = editDocSchema.validate();

    if (error) {
        res.status(400).json({ message: "Please provide valid data to edit document." })
        return;
    }
    else {
        const token = req.cookies.jwt_token;
        if (token) {
            jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
                if (err) {
                    res.status(400).json({ message: "Access denied. Could not verify user." })
                }
                else {
                    Document.findByIdAndUpdate(req.params.postId, {documentTitle: req.body.documentTitle})
                        .then(result => res.status(201).json({ message: "Document title updated", res: result }))
                        .catch(err => res.status(500).json({ message: "Error updating document title.", err: err }))
                }
            })
        }
        else {
            res.status(400).json({ message: "Cannot edit. Access denied." })
        }
    }
});


module.exports = router;