const User = require('../models/user')
const {errorHandler} = require('../helpers/dbErrorHandler');
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');

exports.signup = async (req, res) => {
    try {
        console.log("Received Request Body:", req.body);
        
        // Create and save user
        const user = new User(req.body);
        const savedUser = await user.save();
        user.salt = undefined;
        user.hashed_password = undefined; // ✅ Use async/await

        res.status(201).json({
            message: "User registered successfully",
            user: savedUser
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(400).json({ error: errorHandler || "Signup failed" });
    }  
};

// exports.signin = (req, res) =>{
//     const {email, password} = req.body
//     User.findOne({email}, (err, user) => {
//         if(err || !user) {
//             return res.status(400).json({
//                 error: 'User with that Email does not exist. Please sign up'
//             });
//         }
//         //If user found make sure email and password match
//         //create authentication model
//         if(!user.authenticate(password)) {
//             return res.status(401).json({
//                 error: 'Email and password dont match'
//             })
//         }
//         //generate a signed token with an id and secrete
//         const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
//         //Percist token as 't' in cookie with expiry date
//         res.cookie('t', token, {expire: new Date() +9999});
//         //return response with user and token to frontend client
//         const{_id, name, email, role} = user
//         return res.json({token, user: {id, email, name, role} });
//     });

// };
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }); // ✅ Use async/await

        if (!user) {
            return res.status(400).json({
                error: 'User with that Email does not exist. Please sign up'
            });
        }

        // Check if password matches
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password do not match'
            });
        }

        // Generate a signed token with user ID and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        // Persist token as 't' in cookie with an expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });

        // Return response with user and token to frontend client
        const { _id, name, role } = user;
        return res.json({ token, user: { _id, email, name, role } });

    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({ error: "Something went wrong during signin" });
    }
};


exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({message: "Signout successfully"})
};

exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});