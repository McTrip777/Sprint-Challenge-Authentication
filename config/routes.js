const axios = require('axios');
const secret = require('../api/secret.js').jwtSecret;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const User = require('../users/userModel.js');
const userRoute = require('../users/userRouter');
const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
  server.get('/api/user', authenticate, userRoute);
};

function register(req, res) {
  // implement user registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12)
  user.password = hash;

  User.add(user)
    .then(saved => {
        res.status(201).json(saved)
    })
    .catch(error => {
        res.status(500).json(error)
    })
} 

function login(req, res) {
  // implement user login
  let { username, password } = req.body;
    
    User.findBy({ username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);

            res.status(200).json({ message: `Welcome ${user.username}`, token})
        }else {
            res.status(401).json({ message: 'Try Again'})
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

function generateToken(user){
  const payload = {
      subject: user.id, 
      username: user.username,
  }
  const option = {
      expiresIn: '1d',
  }
  return jwt.sign(payload, secret, option);
}
