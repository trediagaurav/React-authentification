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

const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');

app.use(express.json())

app.use(express.static(__dirname + '/client/src/'));

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser('user_sid'));

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));


app.use(
  session({
    key: 'user_sid',
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires: 3600000*9
        // expires: 1000*10
    }
  })
);
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');
  }
  next();
});

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      next();
  } else {
    // db.select('email').from('users')
    // .where('email', '=', req.session.user.email)
    // .update({ login : "false"})
    // .then(data => {
    //   res.send({loggedIn: false})
    // })
    res.send({loggedIn: false})
    res.clearCookie('user_sid');
  }
};

const otpChecker = (req, res, next) => {
  const { email, otp } = req.body;
  if(!email || !otp){
    res.send({missing: true});
  }else{
    if (req.session.OTP  || req.cookies.OTP) {
      console.log("opt checker pass")
      next();
    } else {
      res.send({otpChecker: false})
    }
  } 
};

// Sending Mail

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

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

/////////////////////////////////////////////
  //Test DB Connection
  //console.log(db.select('*').from('users'));

  //Get Users data from Database
  db.select('*').from('users').then(data => {
    // console.log('Users:', data);
  });
  



//Root Route
app.get('/', (req, res) => {
  if(req.session.user){
    console.log('session.user', req.session.user)
    res.json({loggedIn:true, sessionUser:req.session})
  }
  if(req.session.OTP && req.cookies.OTP){
    console.log('session.otp', req.session.OTP)
    res.json({OTP:true, otp:req.session.otp})
  }
})

app.post('/text',sessionChecker, (req, res) =>{
  res.send({message:"Text received"})
})

//Check the input from the frontend sign in from with the user data from the database
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
  .then(data => {
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
    if(isValid){
      db.select('email', 'hash').from('users')
      .where('email', '=', req.body.email)
      .update({ login : "true"})
      .then(data =>{
        return db.select('*').from('users')
      .where('email', '=', req.body.email)
      .then(user => {
        req.session.user = user[0]
        res.json({loggedIn: true, user:user[0] })
      })
      })
     
       .catch(err => res.status(400).json('unable to get user'))
    } else {
      res.status(400).json("wrong credentials")
    }
  })
   .catch(err => res.status(400).json('wrong credentials'))
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
            req.session.user = user[0]
            res.json({loggedIn: true, user:user[0] })
          })
       })
       .then(trx.commit)
       .catch(trx.rollback)
    })
     .catch(err => res.status(400).json('unable to register'));
})

app.post('/forgetpassword', (req, res) => {
  db.select('email').from('login')
  .where('email', '=', req.body.email)
  .then(data => {
    if(data[0].email === req.body.email){
      let userMail = data[0].email
      let otp = Math.floor((Math.random()*10000)+1)
      let Otpdata = ({mail:userMail,otp:otp})
      req.session.OTP = Otpdata
      console.log(req.session.OTP)
      res.cookie('OTP',process.env.REFRESH_TOKEN_SECRET, {
        maxAge: 1000*60*5,
        httpOnly: true,
       })
      let mailOptions = {
        from: process.env.EMAIL,
        to: userMail,
        subject: 'OTP for change password',
        text:`Given Otp for the new password ${otp}, will expire in 5 minutes.`
      };
      transporter.sendMail(mailOptions, function(){
        if (err) {
          console.log('mail error occurs', err)
        } 
      })
      res.send({mailSend : true})
    }
  })
  .catch(err => res.status(400).send('wrong Email'))
})

app.post('/otp',otpChecker, (req, res) =>{
  console.log("otp", req.session.OTP)
  const OldOtp = req.session.OTP
     if (req.session.OTP.mail == req.body.email && req.session.OTP.otp == req.body.otp) {
      res.clearCookie('OTP').clearCookie('user_sid').send({otp: true, email:req.body.email})
    }else{
      res.send({otp: false})
    }     
})

app.post('/newpassword', (req, res) =>{
  const { email, newPassword, confirmPassword } = req.body;
    if(!email || !newPassword || !confirmPassword){
      return res.json({missingPassword : true});
    }
    if(newPassword === confirmPassword){
      const newhash = bcrypt.hashSync(confirmPassword);
      db.select('email').from('login')
      .where('email', '=', email)
      .update({
        hash: newhash,
      })
      .then(data =>{
        res.send({newPassword : true})
      })
      .catch(err => res.status(400).send({newPassword : false}))
    } else {
      res.send({newPassword : false})
  }
  
})
app.post('/logout', (req, res) => {
  console.log("logout", req.session.user)
  db.select('email').from('users')
  .where('email', '=', req.session.user.email)
  .update({ login : "false"})
  .then(data => {
    res.clearCookie('user_sid');
    res.clearCookie('OTP');
    res.render({loggedOut:true})
    // res.send({loggedOut:true});
  })
  .catch(err => res.status(400).send({loggedOut : false}))
})


//Profile params Route
// app.get('/profile/:id', (req, res)=> {

//     const { id } = req.params;

//     db.select('*').from('users').where({id})
//   .then(user => {
//     if(user.length){
//       res.json(user[0]);
//     } else{
//       res.status(400).json('Not found')
//     }
//   })
//    .catch(err => res.status(400).json('Error getting user'))
// })
//TEST ON BROWSER: http://localhost:3001/profile/1




app.listen(3001, ()=> {
    console.log('app is running on port 3001')
})