const express = require('express');
const router = express.Router();
const multer = require('multer');
const uuid = require('uuid').v4;
const User = require('../models/userModel');
const passport = require('passport');
const upload = multer({ dest: 'uploads/' });
const challenges = multer({ dest: 'challenges/' });
const { isLoggedIn } = require('C:/Users/utilisateur/Desktop/fraud-detection/middleware.js');




router.get('/', (req, res, next) => {

    res.render('main')
})
router.get('/challenge', (req, res, next) => {
    res.render('challenge')
})
router.get('/contact', (req, res, next) => {
    res.render('contact')
})
router.get('/about', (req, res, next) => {
    res.render('about')
})
router.get('/secret', isLoggedIn, async(req, res) => {

    const user = await User.findById(req.user._id);

    res.render('secret');
})

router.get('/upload', upload.single('avatar'), async(req, res) => {

    res.render('upload')
})
router.get('/upload2', challenges.single('challenger'), async(req, res) => {

    res.render('upload2')
})
router.post('/challenge2', challenges.single('challenger'), async(req, res) => {

    res.redirect('/upload2');
})
router.post('/secret', upload.single('avatar'), (req, res) => {


    res.redirect('/upload');
})


router.get('/service', (req, res, next) => {
    res.render('service')
})
router.get('/pricing', (req, res, next) => {
        res.render('pricing')
    })
    // get login page

router.get('/login', (req, res) => {

    res.render('login');
})


// Login the existing user
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {


    res.redirect('/secret');
})


// Logout the user from the current session
router.get('/logout', (req, res) => {
    req.logout();

    res.redirect('/login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

// Register the new user
router.post('/register', async(req, res) => {

    const user = {
        username: req.body.username,
        email: req.body.email
    }

    const newUser = await User.register(user, req.body.password);

    res.redirect('/login');
})

module.exports = router