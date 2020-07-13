const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');


//Comment routes

router.get('/new',isLoggedIn, (req,res) => {
	Campground.findById(req.params.id, (err,campground) => {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new',{campground: campground,currentUser: req.user});
		}
	});
	;
});

router.post('/',isLoggedIn, (req,res) => {
	const comment = req.body.comment;
	const author = req.body.author;
	Campground.findById(req.params.id,(err,foundCampground) => {
		if(err) {
			console.log(err);
		} else {
			Comment.create({
				text: comment,
				author: author
			}, (err, comment) => {
				if(err) {
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					console.log('comment saved')
					res.redirect('/campgrounds/'+ foundCampground._id);
				}
			});
		}
	});
});

router.get('/:comment_id/edit', checkCommentOwnership,(req,res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err){
			return res.redirect('back');
		}
		res.render('comments/edit',{campground_id: req.params.id, comment: foundComment,currentUser: req.user});
	})
});

router.put('/:comment_id',checkCommentOwnership, (req,res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
		if(err){
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});

router.delete('/:comment_id',checkCommentOwnership, (req,res) => {
	Comment.findByIdAndRemove(req.params.comment_id, () => {
		console.log('comment deleted');
		res.redirect('/campgrounds/'+req.params.id);
	});
});

function isLoggedIn(req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'Please Login first!');
	res.redirect('/login');
}

function checkCommentOwnership(req,res,next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err,comment) =>{
		if(err){
			res.redirect('back');
		} else {
			if(comment.author.id.equals(req.user._id)){
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

module.exports = router;
