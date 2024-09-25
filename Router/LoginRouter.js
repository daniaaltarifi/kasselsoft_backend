const express = require('express')
const router = express.Router();
const loginController = require('../Controller/LoginController.js')
const bodyParser=require("body-parser")
const app=express();
app.use(express.json());
app.use(bodyParser.json()); 

router.post('/signup/post', loginController.signUp);
router.post('/login/post',bodyParser.json(), loginController.login);
router.post('/logout', loginController.logout)

module.exports = router