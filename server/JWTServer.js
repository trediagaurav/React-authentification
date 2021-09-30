require('dotenv').config()
const express = require('express');

const bodyParser = require('body-parser');

const bcrypt = require('bcrypt-nodejs');

const cors = require('cors');

const knex = require('knex');

const session = require('express-session');

const cookieParser = require('cookie-parser');

const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json())

app.use(express.static(__dirname + '/client/src/'));

app.use(bodyParser.json());

app.use(cors());

app.use(cookieParser());


const posts = [
    {
      username: 'Gaurav',
      title: "session"
    },
    {
      username: "Ramya",
      title: "JWT"
    }
  ]


  app.get('/posts', authenticateToken, (req, res) =>{
    console.log(req.user.name)
    res.json(posts.filter(post => post.username === req.user.name))
  })
  app.post('/login', (req, res) =>{
    //AUthenticate the user
    const username = req.body.username
    const user = { name: username }
    console.log("user", user)
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    console.log(accessToken)
    res.json({accessToken: accessToken})

  })

  function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user)=>{
      if(err) return res.sendStatus(403)
      req.user = user
      console.log('req.user',req.user)
      next()
    })
  }