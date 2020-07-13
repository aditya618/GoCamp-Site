const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');


router.get('/', (req,res) => {
	Campground.find({}, (err,body) => {
		if(err) {
			console.log(err);
		} else {
			res.render('campgrounds/campgrounds', {campgrounds: body,currentUser: req.user});
		}
	});
});

router.post('/',isLoggedIn, (req,res) => {
	const name = req.body.name;
	const img = req.body.image;
	const desc = req.body.desc;
	const price = req.body.price;
	const author = {
		id: req.user._id,
		username: req.user.username
	}
	Campground.create({
		name: name,
		price: price,
		image: img,
		desc: desc,
		author: author
	}, (err,campground) => {
		if(err) {
			console.log(err);
		} else {
			console.log('Successfully created');
			res.redirect('/campgrounds');
		}
	});
	
});

router.get('/new',isLoggedIn, (req,res) => {
	res.render('campgrounds/new',{currentUser: req.user});
});

router.get('/:id', (req,res) => {
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.render('campgrounds/show',{campgrounds: foundCampground,currentUser: req.user});
		}
	});
});

router.get('/:id/edit',checkOwnership, (req,res) => {
	Campground.findById(req.params.id, (err,campground) =>{
		res.render('campgrounds/edit',{campground: campground,currentUser: req.user});
	});
});

router.put('/:id',checkOwnership,(req,res) => {
	// console.log(req.body.campground);
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err){
			res.redirect('/campgrounds');
		}
		// console.log(updatedCampground);
		res.redirect('/campgrounds/' + req.params.id);
	});
});

router.delete('/:id',checkOwnership, (req,res) => {
	Campground.findByIdAndRemove(req.params.id, () => {
		res.redirect('/campgrounds');
		console.log('deleted');
	});
});

function checkOwnership(req,res,next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err,campground) =>{
		if(err){
			res.redirect('back');
		} else {
			if(campground.author.id.equals(req.user._id)){
				next();
			} else {
				res.redirect('back');
			}
		}
	});
	} else {
		res.redirect('back');
	}
}
function isLoggedIn(req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'Please Login first!');
	res.redirect('/login');
}

module.exports = router;
