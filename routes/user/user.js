const express = require('express')
const {isEmpty} = require('../utils')
const {UsersDB, Firestore} = require('../../firebase')
const user_route = express.Router()

// VALIDATE THE EMAIL ADDRESS
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))
}

// CHECK IF THE MAIN DATA IS VALID FOR ALL METHODS
user_route.all("/", (req, res, next) => {
    const { id, email } = req.query
    if (isEmpty(id) || isEmpty(email)) {
        res.status(500).json({error: "Invalid data, check the user id or email, must not be empty or null."})
        return
    }
    if (!validateEmail(email)) {
        res.status(500).json({error: "Invalid email address."})
        return
    }
    // PASS THE DATA
    next()
})

// CHECK OR GET USER DATA TO THE DATABASE
user_route.get("/", async (req, res) => {
    const { mode, id, email } = req.query
    try {
        if (isEmpty(mode)) {
            res.status(500).json({error: "Please specify the action mode [check, get]."})
            return
        }
        const action = String(mode).toLowerCase()
        /////////////////////////////////////////
        switch (action) {
            case "check":
                const id_d = await UsersDB.where('uid', "==", id).get() 
                const email_d = await UsersDB.where("email", "==", email).get()
                if (!id_d.empty || !email_d.empty) {
                    res.status(400).json({error: "Email or UUID already exists in the database."})
                    break
                }
                res.status(200).json({success: "Seems fine! The user does not exist in the database."})
                break
            case "get":
                const user = UsersDB.where('uid', "==", id)
                const udata = await user.get()
                res.status(200).json({success: { user: udata.docs[0].data()}})
                break
            default:
                res.status(404).json({error: "Invalid action mode."})
                break
        } 
    } catch(e) {
        res.status(500).json({error: e.message})
        return
    }
})

// CREATE OR UPDATE THE USER DATA TO THE DATABASE
user_route.post("/", async (req, res) => {
    const { mode, id, email, photo, data } = req.query
    try {
        if (isEmpty(mode)) {
            res.status(500).json({error: "Please specify the action mode [create, update]."})
            return
        }
        const action = String(mode).toLowerCase()
        /////////////////////////////////////////
        switch (action) {
            case "create":
                let Jdata1 = null
                if (!isEmpty(data)) {
                    Jdata1 = JSON.parse(data)
                    if (typeof Jdata1 !== "object") {
                        res.status(500).json({error: "Invalid json data."})
                        break
                    }
                }
                await UsersDB.add({
                    uid: id,
                    email: email,
                    photo: photo ? photo : "",
                    online: Jdata1.online,
                    sendRequests: [],
                    receivedRequests: [],
                    chats: [],
                    groups: [],
                    blockedusers: []
                }).then((usera) =>
                    usera.get().then((d) => {
                        res.status(200).json({success: { user: d.data() }})
                    })
                )
                break
            case "update":
                const Jdata = JSON.parse(data)
                if (typeof Jdata !== "object") {
                    res.status(500).json({error: "Invalid json data."})
                    break
                }
                let list = []
                const docs = await UsersDB.where("uid", "==", id).get()
                await Promise.all(docs.docs.map(async (d) => {
                    let doc = UsersDB.doc(d.id)
                    await doc.update(Jdata)
                    let datad = await doc.get()
                    list.push(datad.data())
                })).then(() => {
                    res.status(200).json({success: list})
                }).catch((e) => console.log(e))
                break
            default:
                res.status(404).json({error: "Invalid action mode."})
                break
        }
    } catch(e) {
        res.status(500).json({error: e.lineNumber})
        return
    }
})

module.exports = {user_route}