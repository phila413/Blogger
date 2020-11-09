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

function getAllBlogs($http) {
    return $http.get('/api/blogs');
}

function getBlogFromID($http, id) {
    return $http.get('/api/blogs/' + id);
}

function updateBlogFromId($http, authentication, id, data) {
    return $http.put('/api/blogs/' + id, data, { headers: { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function addBlog($http, authentication, data) {
	console.log(data);
    return $http.post('/api/blogs/', data, { headers: { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function deleteBlog($http, id, authentication) {
	return $http.delete('/api/blogs/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() }} );
}

app.controller('home', function HomeController() {
    var vm = this;
    vm.pageHeader = {
		title: "Phil"
    };
});

app.controller('listAll', function listAll($http, authentication){
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
});

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