const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require("bcrypt")

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post("/register", async(req, res)=>{
  try{
    username = req.body.username
    password = req.body.password
//hashing password
const hashed = await bcrypt.hash(password, 7)
const newUser = await User.create({username, password: hashed})
res.send(`successfully created user ${username}`)

  }catch(error){
    res.send({message: " FIll out form again, something went wrong"}, error)
  }
})

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

app.post("/login", async(req, res)=>{
  try {
    const {username, password} = req.body
    const mightBuser = await User.findOne({where: {username}})
    const hashedPW = mightBuser.password
    const matched = await bcrypt.compare(password, hashedPW)
    if(mightBuser && matched){
      res.send(`successfully logged in user ${username}`).status(200)
    }else{
      res.send( "incorrect username and password", error).status(401)
    }
  }catch(error){
    res.send({message: "Something went wrong"}, error).status(400)
  }
})

// we export the app, not listening in here, so that we can run tests
module.exports = app;
