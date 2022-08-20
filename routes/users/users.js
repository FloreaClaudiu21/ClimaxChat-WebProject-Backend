const express = require('express')
const {isEmpty} = require('../utils')
const {UsersDB} = require('../../firebase')
const users_route = express.Router()

users_route.get("/", async (req, res) => {
  const { startAt, endAt, q, order } = req.query
  try {
    let results = []
    if (!isEmpty(q)) {
      const endv = q.replace(
        /.$/, c => String.fromCharCode(c.charCodeAt(0) + 1),
      );
      let query = UsersDB.where('email', '>=', q).where('email', '<=', endv);
      let result = !isEmpty(order) ? await query.orderBy(order).get() : await query.get()
      await Promise.all(result.docs.map(async (el) => {
          results.push(el.data())
      })).then(() => res.status(200).json({success: { results }}))
      return
    }
    let end = isEmpty(endAt) ? 0 : parseInt(endAt)
    let start = isEmpty(startAt) ? 0 : parseInt(startAt)
    let result1 = await UsersDB.orderBy("email").startAt(start).limit(end).get()
    await Promise.all(result1.docs.map(async (el) => {
      results.push(el.data())
    })).then(() => res.status(200).json({success: { results }}))
  } catch(err) {
    res.status(500).json({error: err.message})
    return
  }
})

module.exports = {users_route};