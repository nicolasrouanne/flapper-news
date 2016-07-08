var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');

// userProperty specifies which property on req to put the payload from the tokens
// default value for passport is 'user'. Renaiming it in 'payload' avoids confusion
var auth = jwt({secret: process.env.SECRET_JWT, userProperty: 'payload'});

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Posts */
router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts) {
		if(err) { return next(err); }

		res.json(posts);
	});
});

/* POST a Post */
router.post('/posts', auth, function(req, res, next) {
	var post = new Post(req.body);
	post.author = req.payload.username;

	post.save(function(err, post) {
		if(err) { return next(err); }

		res.json(post);
	});
});

/* Route for preloading Posts */
router.param('post', function(req, res, next, id) {
	var query = Post.findById(id);

	query.exec(function(err, post){
		if(err) { return next(err); }
		if(!post) { return next(new Error('can\'t find Post\n')); }
	
	req.post = post;
	return next();
	});
});

/* Route for preloading Comments */
router.param('comment', function(req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function(err, comment){
		if(err) { return next(err); }
		if(!comment) { return next(new Error('can\'t find Comment\n')); }
	
	req.comment = comment;
	return next();
	});
});


/* GET a specific Post */
router.get('/posts/:post', function(req, res, next) {
	req.post.populate('comments', function(err, post) {
		if(err) {return next(err); }

		res.json(req.post);
	});
});

/* PUT to increment upvotes for a Post */
router.put('/posts/:post/upvote', auth, function(req, res, next) {
	req.post.upvote(function(err, post) {
		if(err) { return next(err); }

		res.json(post);
	});
});

/* POST a comment on a post */
router.post('/posts/:post/comments', auth, function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;
	comment.author = req.payload.username;

	// Save the comment in comment object
	comment.save(function(err, comment) {
		if(err) { return next(err); }

		// Save the comment in post object
		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			if(err) { return next(err); }

			res.json(comment);
		});
	});
});

/* PUT to increment upvotes for a Comment */
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		if(err) { return next(err); }

		res.json(comment);
	});
}); 

/* POST to create a new User */
router.post('/register', function(req, res, next) {
	if(!req.body.username || !req.body.password) { 
		return res.status(400).json({message: 'Please fill in all the fields.'});
	}

	var user = new User();

	user.username = req.body.username;
	
	user.setPassword(req.body.password);

	user.save(function(err) {
		if(err) { return next(err); }

		return res.json({token: user.generateJWT()});
	});
});

/* POST to log in with an existing user */
router.post('/login', function(req, res, next) {
	if(!req.body.username || !req.body.password) { 
		return res.status(400).json({message: 'Please fill in all the fields.'});
	}

	passport.authenticate('local', function(err, user, info) {
		if(err) { return next(err); }

		if(user) {
			return res.json({token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		}
	})(req, res, next);
});

module.exports = router;
