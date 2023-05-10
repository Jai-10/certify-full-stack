const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String,
        required: true
    },
    documentTitle: {
        type: String,
        required: true
    },
    documentUrl: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})


module.exports = mongoose.model('CertifyDocument', docSchema)