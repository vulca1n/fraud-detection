const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {

    res.render('main')
})
router.get('/blog', (req, res, next) => {
    res.render('blog')
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
module.exports = router