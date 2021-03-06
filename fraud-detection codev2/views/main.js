const express = require('express');
const router = express.Router();
const multer = require('multer');
const uuid = require('uuid').v4;
const User = require('../models/userModel');
const passport = require('passport');
const uploader = multer({ dest: 'uploads/' });
const challenges = multer({ dest: 'challenges/' });
const { isLoggedIn } = require('../../middleware.js');

var bodyParser = require("body-parser");

var fileUpload = require('express-fileupload');
const { PythonShell } = require("python-shell");
var sys = require('util');

router.use(fileUpload());
router.use(express.static(__dirname));
router.use(bodyParser.urlencoded({ extended: true }));
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
router.get('/classify', uploader.single('avatar'), async(req, res) => {

    res.render('upload')
})

router.post('/classify', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    console.log('body' + req.body);
    let sampleFile = req.files.sampleFile;
    var filename = req.files.sampleFile.name;
    var Id = parseFloat(req.body.Id);
    var cc_num = parseFloat(req.body.cc_num);
    var trans_date = parseFloat(req.body.trans_date);
    var unix_time = parseFloat(req.body.unix_time);
    var amt = parseFloat(req.body.amt);
    var merch_lat = parseFloat(req.body.merch_lat);
    var merch_long = parseFloat(req.body.merch_long);
    var is_fraud = 0;
    var m = [cc_num, trans_date, unix_time, amt, merch_lat, merch_long]
        // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(__dirname + '/../uploads/' + filename, function(err) {
        if (err)
            return res.status(500).send(err);

        var options = {
            mode: 'text',
            pythonPath: "C:/Users/utilisateur/anaconda3/anaconda/envs/project/python.exe",
            pythonOptions: ['-u'],
            scriptPath: './',
            args: ["../../uploads/" + filename, m]
        };

        var shell = new PythonShell('classification.py', options);
        shell.on('message', function(message) {

            var len = message.length;
            var fs = require('fs');
            var obj;
            fs.readFile('output', 'utf8', function(err, data) {
                if (err) throw err;
                obj = JSON.parse(data);
                console.log((obj));
                res.render("upload", { obj: obj });
            });

        });

    });
});




router.get('/upload2', challenges.single('challenger'), async(req, res) => {

    res.render('upload2')
})
router.post('/challenge2', challenges.single('challenger'), async(req, res) => {

    res.redirect('/upload2');
})
router.get('/challenge2', isLoggedIn, async(req, res) => {

    const user = await User.findById(req.user._id);

    res.render('challenge2');
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