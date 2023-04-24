const express = require('express')
const app = express()

const mongoose = require('mongoose')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const cors = require('cors')
app.use(cors({
    origin: [
        "*"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Access-Control-Allow-Origin', 'Content-Type', 'Authorization'
    ]
}));


const dotenv = require('dotenv')
dotenv.config();

const morgan = require('morgan')
app.use(morgan('dev'))

const cookieParser = require('cookie-parser')
app.use(cookieParser());



mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_CONNECTION_STR)
    .then(res => console.log('Connection to the DB successful!'))
    .catch(err => console.log(err))



// routes
const getLoggedInUser = require('./api/routes/getLoggedInUserDetails')
const authRoute = require('./api/routes/auth')
const postRoute = require('./api/routes/postDocument')
const getUserDocsRoute = require('./api/routes/getUserDocs')
const editDocRoute = require('./api/routes/editDocument')
const deleteDocRoute = require('./api/routes/deleteDocument')

app.use('/getLoggedInUser', getLoggedInUser)
app.use('/auth', authRoute)
app.use('/postDocument', postRoute)
app.use('/getUserDocuments', getUserDocsRoute)
app.use('/editDocument', editDocRoute)
app.use('/deleteDocument', deleteDocRoute)


// default route
app.use('/', (req, res) => {
    res.status(404).json({ message: "The page you're looking for doesn't exist." })
})


module.exports = app;