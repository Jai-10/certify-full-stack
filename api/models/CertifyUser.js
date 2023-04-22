const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    documents: {
        type: Array,
        default: []
    },
    pfp: {
        type: String
    }
},
{
    timestamps: true
})


module.exports = mongoose.model('CertifyUser', userSchema)