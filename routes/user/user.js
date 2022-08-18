const express = require('express')
const {UsersDB, Firestore} = require('../../firebase')
const user_route = express.Router()

// CHECK IF THE VALUE EXISTS
const isEmpty = (val) => {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

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
                res.status(500).json({error: "Email or UUID already exists in the database."})
                break
            }
            res.status(200).json({success: "Seems fine! The user does not exist in the database."})
            break
        case "get":
            const user = UsersDB.where('uid', "==", id)
            try {
                const udata = await user.get()
                res.status(200).json({success: { user: udata.docs[0].data()}})
                break
            } catch(e) {
                res.status(500).json({error: e.message})
                break
            }
        default:
            res.status(404).json({error: "Invalid action mode."})
            break
    }
})

// CREATE OR UPDATE THE USER DATA TO THE DATABASE
user_route.post("/", async (req, res) => {
    const { mode, id, email, username, photo, data } = req.query
    if (isEmpty(mode)) {
        res.status(500).json({error: "Please specify the action mode [create, update]."})
        return
    }
    const action = String(mode).toLowerCase()
    /////////////////////////////////////////
    switch (action) {
        case "create":
            const user = await UsersDB.add({
                uid: id,
                email: email,
                username: username ? username : "",
                photo: photo ? photo : "",
                online: false,
                sendRequests: [{}],
                receivedRequests: [{}],
                chats: [{}],
                groups: [{}],
                blockedusers: []
            })
            res.status(200).json({success: { user: (await user.get()).data() }})
            break
        case "update":
            try {
                const Jdata = JSON.parse(data)
                if (typeof Jdata !== "object") {
                    res.status(500).json({error: "Invalid json data."})
                    break
                }
                const doc = await UsersDB.doc(id).update(Jdata)
                res.status(200).json({success: doc})
                break
            } catch(e) {
                res.status(500).json({error: e.message})
                break
            }
        default:
            res.status(404).json({error: "Invalid action mode."})
            break
    }
})

module.exports = {user_route}