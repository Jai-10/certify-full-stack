const http = require('http')
const PORT = process.env.port || 5500

const app = require('./app')

const server = http.createServer(app)
server.listen(PORT)