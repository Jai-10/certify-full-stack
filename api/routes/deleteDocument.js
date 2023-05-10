const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const Document = require('../models/CertifyDocument')
const User = require('../models/CertifyUser')

const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


router.delete('/:postId/:public_id', (req, res) => {
    const token = req.cookies.jwt_token;
    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
            if (err) {
                res.status(400).json({ message: "Access denied. Could not verify user." })
            }
            else {
                User.findOneAndUpdate({ _id: decodedToken._id }, {$pull: {documents: req.params.postId}})
                    .then(updationRes => {
                        Document.findByIdAndDelete(req.params.postId)
                            .then(async (deletionResult) => {
                                cloudinary.v2.uploader.destroy(`certify/${req.params.public_id}`)
                                    .then(deletionRes => res.status(201).json({ message: "Document deleted.", res: deletionRes }))
                                    .catch(deletionError => res.status(400).json({ message: "Document deletion error.", err: deletionError }))
                            })
                            .catch(deletionErr => res.status(500).json({ message: "Error deleting document.", err: deletionErr }))
                    })
                    .catch(updationErr => res.status(500).json({ message: "Error upating user documents.", err: updationErr}))
            }
        })
    }
    else {
        res.status(400).json({ message: "Cannot delete. Access denied." })
    }
});


module.exports = router;