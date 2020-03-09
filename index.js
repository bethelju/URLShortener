var express = require('express')
var ShortUrl = require('./models/shortUrl')
var mongoose = require('mongoose')
var app = express()
const shortID = require("shortid")
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost/urlShortener", {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    const urls = await ShortUrl.find()
    res.render('index', {shortUrls: urls})
})

app.get('/view-db-table', async (req, res) => {
    const table = await ShortUrl.find()
    res.render('db-table', {shortUrls: table})
})

app.post('/shortenUrl', async (req, res) => {
    const shortenedUrl = shortID.generate()
    console.log(req.body.UrlFull)
    await ShortUrl.create({fullUrl: req.body.UrlFull, short: shortenedUrl})
    res.redirect(`/view-shortUrl/${shortenedUrl}`)
})

app.get('/view-shortUrl/:shortUrl', async (req, res) => {
    const requestedShortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    if(requestedShortUrl == null){
        return res.sendStatus(404)
    }
    res.render('view-short', {shortUrl: requestedShortUrl})
})
 
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    if(shortUrl == null){
        return res.sendStatus(404)
    }
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.fullUrl)
})

app.listen(process.env.PORT || 5000)
