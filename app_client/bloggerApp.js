var app = angular.module('bloggerApp', ['ngRoute', 'ui.router']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
		    templateUrl: 'home.html',
		    controller: 'home',
		    controllerAs: 'vm'
		})
        .when('/!blogList', {
		    templateUrl: 'blogList.html',
		    controller: 'listAll',
		    controllerAs: 'vm'
		})
		.when('/!blogAdd', {
		    templateUrl: 'blogAdd.html',
		    controller: 'addBlog',
		    controllerAs: 'vm'
		})
		
		.when('/!blogComment/:id', {
		    templateUrl: 'blogComment.html',
		    controller: 'commentBlog',
		    controllerAs: 'vm'
		})

		.when('/!deleteComment/:blogid/:commentid', {
		    templateUrl: 'deleteComment.html',
		    controller: 'deleteComment',
		    controllerAs: 'vm'
		})

		.when('/!editComment/:blogid/:commentid', {
		    templateUrl: 'editComment.html',
		    controller: 'editComment',
		    controllerAs: 'vm'
		})

		.when('/!blogEdit/:id', {
		    templateUrl: 'blogEdit.html',
		    controller: 'editBlog',
		    controllerAs: 'vm'
		})

		.when('/!blogDelete/:id', {
		    templateUrl: 'blogDelete.html',
		    controller: 'deleteBlog',
		    controllerAs: 'vm'
		})

		.when('/!register', {
		    templateUrl: 'register.html',
		    controller: 'RegisterController',
		    controllerAs: 'vm'
		})

		.when('/!login', {
		    templateUrl: 'login.html',
		    controller: 'LoginController',
		    controllerAs: 'vm'
		})
		
    .otherwise({redirectTo: '/'});
});

app.config(function($stateProvider) {
    $stateProvider
        .state('blogList', {
          url: '/!blogList',
          templateUrl: 'blogList.html',
          controller : 'listAll'
        });
});

function getAllUsers($http) {
	return $http.get('/api/users');
}

function getAllBlogs($http) {
    return $http.get('/api/blogs');
}

function getComment($http, blogid, commentid) {
    return $http.get('/api/comments/' + blogid + "/" + commentid);
}

function getAllComments($http, id) {
    return $http.get('/api/comments/' + id);
}

function getBlogFromID($http, id) {
    return $http.get('/api/blogs/' + id);
}

function updateCommentFromId($http, authentication, id, data) {
    return $http.put('/api/comments/' + id, data, { headers: { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function updateBlogFromId($http, authentication, id, data) {
    return $http.put('/api/blogs/' + id, data, { headers: { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function updateCommentNumFromId($http, authentication, id, data) {
    return $http.put('/api/blogs/' + id + '/num', data, { headers: { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function addBlog($http, authentication, data) {
    return $http.post('/api/blogs/', data, { headers: { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function addComment($http, authentication, data, id) {
    return $http.post('/api/comments/' + id, data, { headers: { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function deleteBlog($http, id, authentication) {
	return $http.delete('/api/blogs/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function deleteComment($http, id, authentication) {
	return $http.delete('/api/comments/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() }} );
}

app.controller('home', function HomeController() {
    var vm = this;
    vm.pageHeader = {
		title: "Phil"
    };
});

app.controller('listAll', ['$http', '$scope', '$interval', 'authentication', function listAll($http, $scope, $interval, authentication){
    var vm = this;
    vm.pageHeader = {
		title:"List All Blogs"
    };
    
	vm.logout = function() {
		authentication.logout();
		$location.path('/');
	};
	vm.currentUser = function() {
		return authentication.currentUser();
	}

    getAllBlogs($http)
    	.success(function(data) {
	    	vm.blogs = data;
	   		vm.message = "Blogs found!";
		})
		.error( function (e) {
	    	vm.message = "Blogs not found!";
		});

	// Initially gets list of users								 
	getAllUsers($http)
	  .success(function(data) {
		vm.users = data;
		vm.message = "Users list found!";
	  })
	  .error(function (e) {
		vm.message = "Could not get list of users";
	});

	// Refreshes lists of users periodically					  
	$scope.callAtInterval = function() {
		console.log("Interval occurred");
		getAllBlogs($http)
		  .success(function(data) {
			vm.blogs = data;
			vm.message = "Users list found!";
		  })
		  .error(function (e) {
			vm.message = "Could not get list of users";
		});								  
	}
	$interval( function(){$scope.callAtInterval();}, 3000, 0, true);
}]);

app.controller('addBlog', [ '$http', '$routeParams', '$state', 'authentication', function AddController($http, $routeParams, $state, authentication) {
    var vm = this;
    vm.blog = {};
    vm.pageHeader = {
        title: 'Add Blog'
    };

    // Submit function attached to ViewModel for use in form
    vm.submit = function() {
        var data = vm.blog;
        data.blogTitle = userForm.blogTitle.value;
        data.blogText = userForm.blogText.value;
        data.email = authentication.currentUser().email;
        data.name = authentication.currentUser().name;
        addBlog($http, authentication, data)
        	.success( function(data) {
            	vm.message = "Blog data added!";
            	$state.go('blogList');
         	})
         	.error(function (e) {
            	vm.message = "Could not add blog";
          	});
    }
}]);



app.controller('commentBlog', [ '$http', '$scope', '$interval', '$routeParams', '$state', 'authentication', function CommentController($http, $scope, $interval, $routeParams, $state, authentication) {
	var vm = this;
	vm.blog = {};
	vm.id = $routeParams.id;
	vm.pageHeader = {
		title: "Comment Blog"
	};

	vm.currentUser = function() {
		return authentication.currentUser();
	}

	getBlogFromID($http, vm.id)
		.success(function(data) {
			vm.blog = data;
			vm.message = "Blog data found!";
		})
		.error(function(e) {
			vm.message = "Could not find blog given id of " + vm.id;
		});

	vm.commentList = {}
	
	getAllComments($http, vm.id)
    	.success(function(data) {
	    	vm.commentList = data;
	   		vm.message = "Comments found!";
		})
		.error( function (e) {
	    	vm.message = "Comments not found!";
		});

    vm.comment = {};
    
    // Initially gets list of users								 
	getAllUsers($http)
	  .success(function(data) {
		vm.users = data;
		vm.message = "Users list found!";
	  })
	  .error(function (e) {
		vm.message = "Could not get list of users";
	});

	// Refreshes lists of users periodically					  
	$scope.callAtInterval = function() {
		console.log("Interval occurred");
		getAllComments($http, vm.id)
		  .success(function(data) {
			vm.commentList = data;
			vm.message = "Users list found!";
		  })
		  .error(function (e) {
			vm.message = "Could not get list of users";
		});								  
	}
	$interval( function(){$scope.callAtInterval();}, 3000, 0, true);


    // Submit function attached to ViewModel for use in form
    vm.submit = function() {
        var data = vm.comment;
        data.comment = userForm.comment.value;
        data.name = authentication.currentUser().name;
        data.blogid = vm.blog._id;
        data.email = authentication.currentUser().email;

        addComment($http, authentication, data, vm.id)
        	.success( function(data) {
        		var data = vm.blog;
        		data.commentNum = ++vm.blog.commentNum;

				updateCommentNumFromId($http, authentication, vm.id, data)
					.success(function(data) {
						vm.message = "Blog data updated!";
					})
					.error(function (e) {
						vm.message = "Could not update blog!";
					});
            	vm.message = "Comment data added!";
            	$state.go('blogList');
         	})
         	.error(function (e) {
            	vm.message = "Could not add Comment";
          	});
    }
}]);

app.controller('deleteComment', [ '$http', '$routeParams', '$state', 'authentication', function DeleteCommentController($http, $routeParams, $state, authentication) {
    var vm = this;
    vm.blog = {};
    vm.comment = {};
    vm.blogid = $routeParams.blogid;
    vm.commentid = $routeParams.commentid;
    vm.pageHeader = {
        title: 'Delete Comment'
    };

    getBlogFromID($http, vm.blogid)
    	.success(function(data) {
        	vm.blog = data;
        	vm.message = "Blog data found!";
	    })
	    .error(function (e) {
	    	vm.message = "Could not find blog!";
	    });

	getComment($http, vm.blogid, vm.commentid)
    	.success(function(data) {
        	vm.comment = data;
        	vm.message = "Comment data found!";
	    })
	    .error(function (e) {
	    	vm.message = "Could not find comment!";
	    });


    vm.submit = function() {
        var data = {};

        deleteComment($http, vm.commentid, authentication)
        	.success(function(data) {
        		var data = vm.blog;
        		data.commentNum = --vm.blog.commentNum;

				updateCommentNumFromId($http, authentication, vm.blogid, data)
					.success(function(data) {
						vm.message = "Blog data updated!";
					})
					.error(function (e) {
						vm.message = "Could not update blog!";
					});
        		vm.message = "Comment data deleted!";
        		$state.go('blogList');
        	})
        	.error(function (e) {
        		vm.message = "Could not delete comment!";
        	});
    }
    
    vm.cancel = function() {
        $state.go('blogList');
    }
}]);

app.controller('editComment', [ '$http', '$routeParams', '$state', 'authentication', function EditCommentController($http, $routeParams, $state, authentication) {
	var vm = this;
    vm.blog = {};
    vm.comment = {};
    vm.blogid = $routeParams.blogid;
    vm.commentid = $routeParams.commentid;
    vm.pageHeader = {
        title: 'Delete Comment'
    };

    getBlogFromID($http, vm.blogid)
    	.success(function(data) {
        	vm.blog = data;
        	vm.message = "Blog data found!";
	    })
	    .error(function (e) {
	    	vm.message = "Could not find blog!";
	    });

	getComment($http, vm.blogid, vm.commentid)
    	.success(function(data) {
        	vm.comment = data;
        	vm.message = "Comment data found!";
	    })
	    .error(function (e) {
	    	vm.message = "Could not find comment!";
	    });


    vm.submit = function() {
		var data = vm.comment;
		data.comment = userForm.comment.value;

		updateCommentFromId($http, authentication, vm.commentid, data)
			.success(function(data) {
				vm.message = "Comment data updated!";
				$state.go("blogList");
			})
			.error(function (e) {
				vm.message = "Could not update comment!";
			});
	}
}]);

app.controller('editBlog', [ '$http', '$routeParams', '$state', 'authentication', function EditController($http, $routeParams, $state, authentication) {
	var vm = this;
	vm.blog = {};
	vm.id = $routeParams.id;
	vm.pageHeader = {
		title: "Edit Blog"
	};

	getBlogFromID($http, vm.id)
		.success(function(data) {
			vm.blog = data;
			vm.message = "Blog data found!";
		})
		.error(function(e) {
			vm.message = "Could not find blog given id of " + vm.id;
		});

	vm.submit = function() {
		var data = vm.blog;
		data.blogTitle = userForm.blogTitle.value;
		data.blogText = userForm.blogText.value;

		updateBlogFromId($http, authentication, vm.id, data)
			.success(function(data) {
				vm.message = "Blog data updated!";
				$state.go("blogList");
			})
			.error(function (e) {
				vm.message = "Could not update blog!";
			});
	}
}]);

app.controller('deleteBlog', [ '$http', '$routeParams', '$state', 'authentication', function DeleteController($http, $routeParams, $state, authentication) {
    var vm = this;
    vm.blog = {};
    vm.id = $routeParams.id;
    vm.pageHeader = {
        title: 'Delete Blog'
    };

    getBlogFromID($http, vm.id)
    	.success(function(data) {
        	vm.blog = data;
        	vm.message = "Blog data found!";
	    })
	    .error(function (e) {
	    	vm.message = "Could find blog!";
	    });

    vm.submit = function() {
        var data = {};

        deleteBlog($http, vm.id, authentication)
        	.success(function(data) {
        		vm.message = "Blog data deleted!";
        		$state.go('blogList');
        	})
        	.error(function (e) {
        		vm.message = "Could not delete blog!";
        	});
    }
    
    vm.cancel = function() {
        $state.go('blogList');
    }
}]);