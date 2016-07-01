angular.module('flapperNews', ['ui.router'])

.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
		
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			}
		});
	
	$stateProvider
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl',
			resolve: {
				post: ['$stateParams', 'posts', function($stateParams, posts) {
					return posts.get($stateParams.id);
				}]
			}
		});

	$urlRouterProvider.otherwise('home');
}])


.factory('posts', ['$http', function($http){
	var o = {
		posts: []
	};

	// query the '/posts' route and bind a function when request returns
	// get back a list and copy to posts object using angular.copy()
	o.getAll = function() {
		return $http.get('/posts').success(function(data){
			angular.copy(data, o.posts);
		})
	};

	// uses router.post in index.js to post a new Post model to mongoDB
	// when $http gets success, it adds this post to the posts object in local factory
	o.create = function(post) {
		return $http.post('/posts', post).success(function(data){
			o.posts.push(data);
		})
	};
	
	o.upvote = function(post) {
		return $http.put('/posts/'+ post._id + '/upvote')
			.success(function(data){
				post.upvotes += 1;
			});
	};

	o.get = function(id) {
		return $http.get('/posts/' + id).then(function(res){
			return res.data;
		})
	};

	return o;
}])

.controller('MainCtrl', [
	'$scope',
	'posts',
	function($scope, posts) {
		$scope.posts = posts.posts;

		$scope.addPost = function() {
			if (!$scope.title | $scope.title === '') {return; }
			posts.create({
				title: $scope.title,
				link: $scope.link
			});
			$scope.title = '';
			$scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
			posts.upvote(post);
		}
}])

.controller('PostsCtrl', [
	'$scope',
	'posts',
	'post',
	function($scope, posts, post) {
		$scope.post = post;

		$scope.addComment = function(post) {
			if ($scope.body === '') { return; }
			$scope.post.comments.push({
				body: $scope.body,
				author: 'user',
				upvotes: 0
			});
			$scope.body = '';
		}

}])