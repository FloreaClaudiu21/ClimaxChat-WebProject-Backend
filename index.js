const http = require('http')
const cors = require('cors')
const app = require('express')
const dotenv = require('dotenv')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')

dotenv.config()
const express = app()

require('./firebase')
const PORT = process.env.PORT || 5000
const server = http.createServer(express)
const {main_router, users_router} = require("./routes/api")


express.use(cors())
express.use(bodyParser.json())
express.use(bodyParser.urlencoded({ extended: true }))
express.use("/api", main_router)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id)
})

server.listen(PORT, () => {
    console.log("Server listening on port: " + PORT);
})

module.exports = {io, express}
