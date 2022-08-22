const http = require('http')
const cors = require('cors')
const app = require('express')
const dotenv = require('dotenv')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const axios = require('axios').default

dotenv.config()
const express = app()
const online_users = []

const BASE_URL = "http://localhost:8000/api"
const { UsersDB } = require('./firebase')

const API_KEY = process.env.APIKEY
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

// GET THE STATUS FROM EVENT TYPE
const data_from_event = (event) => {
    return event == "login" ? true : false 
}

io.on("connection", (socket) => {
    socket.on("disconnecting", (reason) => {
        let v = {}
        const id = socket.id
        // LOOP ONLINE USERS
        online_users.forEach((k) => {
            if (k.socketid === id) {
                v = k
            }
        })
        if (v.user) {
            axios({
                method: "post",
                baseURL: BASE_URL,
                url:
                    '/user?apikey=' + API_KEY +
                    '&email=' + v.user +
                    '&id=' + v.id +
                    '&mode=update' +
                    '&data={"online": ' + data_from_event(reason) +'}'
            }).then(() => socket.emit("user_updated", {data: {mail: mail, uid: uid}, online: data_from_event(reason), firstjoin: false })
            ).catch((e) => socket.emit("user_updated", {error: "Sorry but we couldn't update your status, please contact the website administrator. Error code: " + e.message}))
        }
    })
    socket.on("user_event", ({data: {mail, uid, photo, event}}) => {
        let in_list = false
        online_users.forEach((k) => {
            if (k.user == mail) {
                in_list = true
                return
            }
        })
        if (!in_list) {
            online_users.push({
                id: uid,
                user: mail,
                socketid: socket.id 
            })
        }
        axios({
            method: "get",
            baseURL: BASE_URL,
            url: 
                '/user?apikey=' + API_KEY +
                '&email=' + mail +
                '&id=' + uid +
                '&mode=check'
        }).then(() => {
            // CREATE NEW USER
            axios({
                method: "post",
                baseURL: BASE_URL,
                url:
                    '/user?apikey=' + API_KEY +
                    '&email=' + mail +
                    '&id=' + uid +
                    '&photo=' + photo +
                    '&mode=create' +
                    '&data={"online": ' + data_from_event(event) + '}'
            }).then(() => socket.emit("user_updated", {data: {mail: mail, uid: uid}, online: data_from_event(event), firstjoin: true })
            ).catch((e) => socket.emit("user_updated", {error: "Sorry but we couldn't update your status, please contact the website administrator. Error code: " + e.message}))
        }).catch(() => {
            // ALREADY EXISTS
            axios({
                method: "post",
                baseURL: BASE_URL,
                url:
                    '/user?apikey=' + API_KEY +
                    '&email=' + mail +
                    '&id=' + uid +
                    '&mode=update' +
                    '&data={"online": ' + data_from_event(event) +'}'
            }).then(() => socket.emit("user_updated", {data: {mail: mail, uid: uid}, online: data_from_event(event), firstjoin: false })
            ).catch((e) => socket.emit("user_updated", {error: "Sorry but we couldn't update your status, please contact the website administrator. Error code: " + e.message}))
        })
    })
})

server.listen(PORT, () => {
    console.log("Server listening on port: " + PORT);
})

module.exports = {io, express}
