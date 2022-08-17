const http = require('http')
const dotenv = require('dotenv')
const server = http.createServer()
const app = require('express')
const express = require('express')()
const { Server } = require('engine.io')

dotenv.config()
express.use(app.json())
const PORT = process.env.PORT || 5000
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id)
    console.log(socket.PORT)
})

server.listen(PORT, () => {
    console.log("Server listening on port: " + PORT);
})

module.exports = {io, express}
