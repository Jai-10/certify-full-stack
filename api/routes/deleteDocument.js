const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const Document = require('../models/CertifyDocument')
const User = require('../models/CertifyUser')


router.delete('/:postId', (req, res) => {
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
                            .then(deletionResult => res.status(201).json({ message: "Document deleted.", res: deletionResult }))
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