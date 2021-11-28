const { Router } = require("express")
const {Post, User} = require('../models')
const { decodeJwt } = require('../security/jwtLogic')

const router = Router()

const addPostToUser = async function(postId, userId) {
  return User.findByIdAndUpdate(
    userId,
    { $push: { posts: postId } },
    { new: true, useFindAndModify: false }
  );
};

router.post('/addPost', async (req, resp) => {
  try {

    const { title, content } = req.body


    const decodedJwt = await decodeJwt(req.headers.authorization)
    const { userId } = decodedJwt

    if (decodedJwt === null || !userId ) {
      resp.status(401)
      resp.json({ message: 'Access denied' })
      return
    }

    const postToSave = new Post({ title, content, createdAt: new Date(), users: [userId] })
    await postToSave.save()

    await addPostToUser(postToSave._id, userId)

    resp.status(201)
    resp.json({ message: 'Created', _data: postToSave })
  } catch (error) {
    resp.status(500)
    resp.json({ message: 'Something went wrong...' })
  }
})

router.get('/posts', async (req, resp) => {
  try {
    const decodedJwt = await decodeJwt(req.headers.authorization)
    const { userId } = decodedJwt

    if (decodedJwt === null || !userId ) {
      resp.status(401)
      resp.json({ message: 'Access denied' })
      return
    }

    const offset = Number(req.query.offset) || 0
    const length = Number(req.query.length) || 10

    console.log(offset, length)
    
    const posts = await Post.find(
      {},
      ['_id', 'title', 'content', 'createdAt', 'users'],
      {
        sort:{
          createdAt: 'desc'
        }
      }
    ).skip(offset).limit(length)

    resp.status(200)
    resp.json({ posts })
  } catch (error) {
    resp.status(500)
    resp.json({ message: 'Something went wrong...' })
  }
})


module.exports = router
