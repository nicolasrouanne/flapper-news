var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


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
router.post('/posts', function(req, res, next) {
	var post = new Post(req.body);

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

/* GET a specific Post */
router.get('/posts/:post', function(req, res) {
	res.json(req.post);
});

/* PUT to increment upvotes for a Post */
router.put('/posts/:post/upvote', function(req, res, next) {
	req.post.upvote(function(err, post) {
		if(err) { return next(err); }

		res.json(post);
	});
});

/* POST a comment on a post */
router.post('/posts/:post/comments', function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;

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

module.exports = router;
