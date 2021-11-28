const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../consts')

async function decodeJwt(jwtToken) {
  try {
    const decoded = await jwt.verify(jwtToken, JWT_SECRET);

    return decoded

  } catch (error) {
    return null
  }
}

module.exports = { decodeJwt }
