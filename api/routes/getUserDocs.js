const router = require('express').Router();
const Document = require('../models/CertifyDocument');

router.get('/:userId', (req, res) => {
    Document.find({ userId: req.params.userId })
        .then(result => res.status(200).json({ message: "Fetching user documents.", docs: result }))
        .catch(err => res.status(500).json({ message: "Error fetching user documents.", err: err }))
});

module.exports = router;