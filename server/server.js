/*

Routes:

/ --> res = this is working

/signin --> POST  success/fail

/register --> POST = user

/profile/:userId --> GET = user


*/
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

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));



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

app.use(
  session({
    key: 'user_sid',
    secret: 'some_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 300000,
        httpOnly:true
    }
  })
);
app.use((req, res, next) => {
  console.log('Cookies.User_sid', req.cookies.user_sid)
  console.log('sesion.user', req.session.user)
  // if (req.cookies.user_sid && !req.session.user) {
  //     res.clearCookie('user_sid');
  // }
  next();
});

// const sessionChecker = (req, res, next) => {
//   if (req.session.user && req.cookies.user_sid) {
//       res.redirect('/signin');
//   } else {
//       next();
//   }
// };

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      console.log('sessionUser', req.session.user)
      console.log('CookieUser', req.cookies.user_sid)
      next();
  } else {
      next();
  }
};

//CONNECT TO LOCAL POSTGRESQL DATABASE
const db = knex({

     client: 'pg',
     connection: {
     port: '5432',
     host : '127.0.0.1',
     user : 'postgres',
     password : 'jaan143',
     database : 'Auth'

    }

  });

  ////////////////// JWT Testing /////////////////
  
  app.get('/posts', (req, res) =>{
    const verify = (posts.filter(post => post.username === req.user.name))
    console.log(verify)
    res.json(verify)
  })

  app.post('/login', (req, res) =>{
    //AUthenticate the user
    console.log(req)
    const username = req.body.username
    const user = { name: username }
    console.log("user", user)
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '15s'})
    res.json({accessToken: accessToken})

  })


/////////////////////////////////////////////
  //Test DB Connection
  //console.log(db.select('*').from('users'));

  //Get Users data from Database
  db.select('*').from('users').then(data => {
    // console.log('Users:', data);
  });
  



//Root Route
app.get('/', (req, res) => {
  if(req.cookies.user_sid){
    console.log('Cookies.User_sid', req.cookies.user_sid)
  }
  if(req.session.user){
    console.log('sesion.user', req.session.user)
    res.send({loggedIn:true, sessionUser:req.session.user[0]})
  }
    // res.send('this is working');
    //response with the users database
    // res.send(database.users);
  //  res.send("working")
})

app.post('/text',sessionChecker, (req, res) =>{
  // const authHeader = req.headers['authorization']
  //   console.log("authHead of post:", authHeader)
  res.send({message:"Text received"})
})

//Check the input from the frontend sign in from with the user data from the database
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
  .then(data => {
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
    // console.log(isValid);
    if(isValid){
     return db.select('*').from('users')
      .where('email', '=', req.body.email)
      .then(user => {
        req.session.user = user
        // console.log("req.session", req.session.user)
        // res.json(user[0])
        res.json({loggedIn: true, user:user[0] })
      })
       .catch(err => res.status(400).json('unable to get user'))
    } else {
      res.status(400).json("wrong credentials")
    }
  })
   .catch(err => res.status(400).json('wrong credentials'))
})

app.get("/signin",(req, res) =>{
  // if(req.session.user){
  //   res.send({loggedIn: true, user: req.session.user})
  // }else{
  //   res.send({loggedIn: false})
  // }
})

//Check input from the frontend register form with the data in the database, insert the data in the database
app.post('/register', (req, res) => {

  //Destructure the request from the body
  const { email, name, password } = req.body;

  //Security in server
  if(!email || !name || !password){
    return res.status(400).json('incorrect form submission');
  }

  //Bcrypt Hash
  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
  
      })
       .into('login')
       .returning('email')
       .then(loginEmail => {
         return  trx('users')
         .returning('*')
         .insert({
           email: loginEmail[0],
           name: name,
           joined: new Date()
         })
          .then(user => {
            res.json(user[0]);
          })
       })
       .then(trx.commit)
       .catch(trx.rollback)
    })
  
  
     .catch(err => res.status(400).json('unable to register'));
})

app.get('/logout', (req, res) => {
  res.clearCookie('user_sid');
  res.send({loggedOut:true});
})


//Profile params Route
app.get('/profile/:id', (req, res)=> {

    const { id } = req.params;

    db.select('*').from('users').where({id})
  .then(user => {
    if(user.length){
      res.json(user[0]);
    } else{
      res.status(400).json('Not found')
    }
  })
   .catch(err => res.status(400).json('Error getting user'))
})
//TEST ON BROWSER: http://localhost:3001/profile/1




app.listen(3001, ()=> {
    console.log('app is running on port 3001')
})