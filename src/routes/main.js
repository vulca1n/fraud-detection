const express = require('express')
const router = express.Router()

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
router.get('/service', (req, res, next) => {
    res.render('service')
})
router.get('/pricing', (req, res, next) => {
    res.render('pricing')
})
router.get('/login', (req, res, next) => {
    res.render('login')
})
router.get('/register', (req, res, next) => {
    res.render('register')
})

module.exports = router