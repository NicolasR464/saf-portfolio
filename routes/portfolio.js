const express = require('express')
const router = express.Router()

const portfolioContr = require('../controllers/portfolio')

router.get('/', portfolioContr.getIndex)
router.get('/home/:orientation', portfolioContr.getIndex)
router.get('/about', portfolioContr.getAbout)
router.get('/portfolio', portfolioContr.getPortfolio)
router.get('/contact', portfolioContr.getContact)
router.post('/contact', portfolioContr.postContact)
router.get('/thanks', (_req, res) => {
    res.render('portfolio/thanks', {
        pageTitle: 'Thanks',
        path: '/',
    })
})
router.get('/error', (_req, res) => {
    res.render('portfolio/error', {
        pageTitle: 'error',
    })
})
module.exports = router
