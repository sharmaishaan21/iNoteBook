const express = require('express');
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchUser=require("../middleware/fetchUser")
const JWT_SECRET = "Light Yagami is kira";
const router = express.Router();
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {
  let success=false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({success, error: "Sorry, a user with the existing email already exists." })
    }
    //Check whether the user with given email already exists or not.
    //Create a new user
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, 10);
    let newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    const data = {
      user: {
        id: newUser.id
      }
     }
    const authToken = jwt.sign(data, JWT_SECRET)
    console.log(authToken);
    //   .then(user => res.json(user)).catch(err=>{console.log(err)
    // res.json({error: "Please enter a unique value",message: err.message})});
    success=true;
    return res.status(200).json({success})
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
})
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async (req, res) => {
  console.log("ee");
  let success=false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success=false;
      return res.status(400).json({success, error: "Try logging in with correct credentials." });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success=false;
      return res.status(400).json({success, error: "Please log in with correct credentials" });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    success=true;
    res.json({success,authToken})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
})
router.post('/getuser',fetchUser, async (req, res) => {
try {
  const userId=req.user.id;
  const user=await User.findById(userId).select("-password");
  res.send(user);
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}
})
module.exports = router;