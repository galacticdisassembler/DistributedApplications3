const { Router } = require("express")
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { JWT_SECRET } = require('../consts')


const router = Router()

router.post('/register', async (req, resp) => {
  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user) {
      resp.status(400)
      resp.json({ message: 'User with this email exists' })
      return
    }

    const userToSave = new User({ email, password })
    await userToSave.save()

    resp.status(201)
    resp.json({ message: 'Created' })
  } catch (error) {
    resp.status(500)
    resp.json({ message: 'Something went wrong...' })
  }
})

router.post('/login', async (req, resp) => {
  try {

    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || user.password !== password) {
      resp.status(400)
      resp.json({ message: 'User not found' })
      return
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '5h' }
    )

    resp.status(200)
    resp.json({ id: user.id, token })

  } catch (error) {
    resp.status(500)
    resp.json({ message: 'Something went wrong...' })
  }
})

module.exports = router
