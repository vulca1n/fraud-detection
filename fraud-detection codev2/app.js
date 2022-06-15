var express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    fileUpload = require('express-fileupload');
var PythonShell = require('python-shell'),
    sys = require('util');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid').v4;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const User = require('./models/userModel');
const passport = require('passport');
//const challenges = multer({ dest: './challenges/' });
const { isLoggedIn } = require('./middleware');

mongoose.connect('mongodb://localhost:27017/fraud', {
        useNewUrlParser: true,
        useUnifiedTopology: true

    })
    .then(() => {
        console.log("Database Connected");
    })
    .catch(err => {
        console.log("DB Not Connected");
        console.log(err);
    })

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(fileUpload());
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res) {

    res.render("main");
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.get('/service', (req, res, next) => {
    res.render('service')
})
app.get('/pricing', (req, res, next) => {
        res.render('pricing')
    })
    // get login page

app.get('/login', (req, res) => {

        res.render('login');
    })
    // Login the existing user
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {


    res.redirect('/secret');
})
app.get('/secret', isLoggedIn, async(req, res) => {

    const user = await User.findById(req.user._id);

    res.render('start');
})

// Logout the user from the current session
app.get('/logout', (req, res) => {
    req.logout();

    res.redirect('/login');
})




app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async(req, res) => {

    const user = {
        username: req.body.username,
        email: req.body.email
    }

    const newUser = await User.register(user, req.body.password);

    res.redirect('/login');
})


app.get('/challenge', (req, res, next) => {
    res.render('challenge')
})
app.get('/contact', (req, res, next) => {
    res.render('contact')
})
app.get('/about', (req, res, next) => {
    res.render('about')
})
app.post('/classify', function(req, res) {
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
    sampleFile.mv(__dirname + '/data/' + filename, function(err) {
        if (err)
            return res.status(500).send(err);

        var options = {
            mode: 'text',
            pythonPath: "C:/Users/utilisateur/anaconda3/anaconda/envs/project/python.exe",
            pythonOptions: ['-u'],
            scriptPath: './',
            args: ["./data/" + filename, m]
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
                res.render("result", { obj: obj });
            });

        });

    });
});


app.get('/challenge2', isLoggedIn, async(req, res) => {

    const user = await User.findById(req.user._id);

    res.render('challenge2');
})


app.listen(5000, "localhost", function(err) {
    console.log("Server listening on port 5000!");
});