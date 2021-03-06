var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var flash = require('connect-flash')
var moment = require('moment')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var methodOverride = require('method-override')
var Recipe = require('./models/recipe')
var Comment = require('./models/comment')
var User = require('./models/user')
var seedDB = require('./seeds')

// requiring routes
var commentRoutes = require('./routes/comments')

var recipeRoutes = require('./routes/recipes')

var indexRoutes = require('./routes/index')

// exprot DATABASEURL=mongodb://conn.string...
var url = process.env.DATABASEURL || 'mongodb://localhost:27017/cook_grimoire'
mongoose.connect(
  url,
  { useNewUrlParser: true }
)
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())
// seedDB(); //seed the database

// MOMENT app var declaration
app.locals.moment = require('moment')

// PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'very#$%@#%secretive@#%@#$%#@%secret!@$#@%#%@#',
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req, res, next) {
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})

app.use('/', indexRoutes)
app.use('/recipes', recipeRoutes)
app.use('/recipes/:id/comments', commentRoutes)

app.use(function (req, res, next) {
  res
    .status(404)
    .render('404_error_template', { title: 'Sorry, page not found' })
})

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log('server started...')
})
