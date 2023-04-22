const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String
    },
    documentTitle: {
        type: String
    }
    // documentUrl: {
    //     type: String
    // }
},
{
    timestamps: true
})


module.exports = mongoose.model('CertifyDocument', docSchema)