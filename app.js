const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const methodOverride = require('method-override');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

// seedDB();
// mongodb://localhost/yelp_camp

mongoose.connect('mongodb+srv://aditya:aditya@firstapp.g4ykv.mongodb.net/gocamp?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
	console.log('DATABASE CONNECTED!!');
}).catch(err => console.log('ERROR OCCURED ',err));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
mongoose.set('useFindAndModify', false);
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

//PASSPORT CONFIG
app.use(require('express-session')({
	secret: 'This is my first node app',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
	app.locals.currentUser = req.user;
	app.locals.message = req.flash('error');
	next();
});


app.use(indexRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes);


app.listen(process.env.PORT,process.env.IP, () => {
	console.log('Server started');
})