const app = require('express')
const main_router = app.Router()
const paths = ["users", "user", "groups", "group", "chats", "chat"]
const {user_route} = require('./user/user')
const {users_route} = require("./users/users")

main_router.all("/:path", (req, res) => {
    const {apikey} = req.query
    const {path} = req.params
    if (apikey !== process.env.APIKEY) {
        res.status(400).json({error: "Invalid api key."})
        return
    }
    if (!paths.includes(path)) {
        res.status(404).json({error: "Invalid path name."})
    }
    // PASS THE REQUEST
    req.next()
    return
})

main_router.use("/user", user_route)
main_router.use("/users", users_route)

module.exports = {main_router};