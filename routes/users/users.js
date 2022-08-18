const express = require('express')
const {UsersDB} = require('../../firebase')
const users_route = express.Router()

users_route.get("/", async (req, res) => {
   const VALUE = []
   let ST = 0, EN = 0
   const {START, END} = req.query
   try {
     if (START) ST = parseInt(START)
     if (END) EN = parseInt(START)
   } catch(error) {
     console.log(error)
   }
   const data = await UsersDB.limit(0).get()
   data.docs.map((e)=> {
     VALUE.push(e.data())
   })
   res.status(200).json({success: VALUE, size: data.docs.length})
})

module.exports = {users_route};