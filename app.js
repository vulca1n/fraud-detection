const express = require('express');
const app = express();
const multer = require('multer');
const uuid = require('uuid').v4;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override')
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./src/models/userModel');
const Routes = require('./src/routes/main');
//const tabledep = require('./src/views/js/main')
//const upload = multer({dest : 'uploads/'})



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


app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))


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

// seedDB();

app.get('/', (req, res) => {
    res.render('main');
})


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

// Routes


app.use(Routes);
//app.use(tabledep);



app.listen(5000, () => {
    console.log("Server Running At port 5000");
});