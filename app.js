const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv/config')
const app = express()
const path = require('path')
const device = require('express-device')
const compression = require('compression')
const helmet = require('helmet')

const portfolioContr = require('./controllers/portfolio')

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [
                "'self'",
                'cdn.jsdelivr.net',
                'youtube.com/iframe_api',
                '*.vimeo.com',
                'vimeo.com',
                'www.youtube.com',
                'i.vimeocdn.com',
                'i.ytimg.com',
                'kit.fontawesome.com/',
                'cdnjs.cloudflare.com',
                'cloudflare.com',
                'ka-f.fontawesome.com/',
            ],
            styleSrc: [
                "'self'",
                'cdn.jsdelivr.net',
                "'unsafe-inline'",
                'fonts.googleapis.com',
                'cdnjs.cloudflare.com',
            ],
            fontSrc: [
                "'self'",
                'data:',
                'fonts.gstatic.com',
                'ka-f.fontawesome.com/',
            ],
            imgSrc: ["'self'", 'blob:', 'data:', 'gap:', 'res.cloudinary.com'],
        },
        reportOnly: false,
    })
)

const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 * 30,
})
const flash = require('connect-flash')
//

app.set('view engine', 'ejs')
app.set('views', 'views')
//
app.use(bodyParser.urlencoded({ extended: false }))
app.use(device.capture())
//
const adminRoutes = require('./routes/admin')
const portfolioRoutes = require('./routes/portfolio')
//
app.use(helmet())

app.use(compression())

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
        },
    })
)

app.use(flash())
//
app.use(express.static(path.join(__dirname, 'public')))

// 🚧
app.use('*', portfolioContr.getIndex)

// Routes
app.use('/admin', adminRoutes)

app.use(portfolioRoutes)

app.use((_req, res) => {
    res.redirect('/')
})

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('http://localhost:' + process.env.PORT, ' 🚀')
        app.listen(process.env.PORT || 5500)
    })
    .catch((err) => {
        console.log(err)
    })
