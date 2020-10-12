var request = require('request');
var apiOptions = {
    server : "http://localhost:80"
};

module.exports.add = function(req, res) {
    res.render('addBlog', { title: 'Blog Add' });
};

module.exports.addPost = function(req, res) {
    var requestOptions, path, postdata;
    path = '/api/blogs/';

    postdata = {
	blogTitle: req.body.blogTitle,
	blogText: req.body.blogText,
	date: new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
    };

    requestOptions = {
	url : apiOptions.server + path,
	method : "POST",
	json : postdata
    };

    request(
	requestOptions,
	function(err, response, body) {
	    if(response.statusCode === 201) {
		res.redirect('/blogList');
	    } else {
		_showError(req, res, response.statusCode);
	    }
	}
    );
};


module.exports.list = function(req, res) {
    var requestOptions, path;
    path = '/api/blogs';
    requestOptions = {
	url : apiOptions.server + path,
	method : "GET",
	json : {},
	qs : {}
    };
    request (
	requestOptions,
	function(err, response, body) {
	    renderListPage(req, res, body);
	}
    );
};

var renderListPage = function (req, res, responseBody) {
    res.render('listBlog', {
	title: 'Blog List',
	blogs: responseBody
    });
};

module.exports.edit = function(req, res) {
    var requestOptions, path;
    path = '/api/blogs/' + req.params.blogid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request (
        requestOptions,
        function(err, response, body) {
            renderEditPage(req, res, body);
	}
    );
};

var renderEditPage = function (req, res, responseBody) {
    res.render('edit', {
        title: 'Blog Edit',
        blogs: responseBody
    });
};

module.exports.updateBlog = function(req, res) {
    var requestOptions, path, postdata;
    var id = req.params.blogid;
    path = '/api/blogs/' + id;
    
    postdata = {
	blogTitle: req.body.blogTitle,
	blogText: req.body.blogText,
	date: req.body.date
    };

    requestOptions = {
	url : apiOptions.server + path,
	method : "PUT",
	json : postdata
    };

    request(
	requestOptions,
	function(err, response, body) {
	    if (response.statusCode === 200) {
		res.redirect('/blogList');
	    } else {
		_showError(req, res, response.statusCode);
	    }
	}
    );
};

module.exports.del = function(req, res) {
    var requestOptions, path;
    path = "/api/blogs/" + req.params.blogid;
    requestOptions = {
	url : apiOptions.server + path,
	method : "GET",
	json : {}
    };
    request (
	requestOptions,
	function (err, response, body) {
	    renderDeletePage(req, res, body);
	}
    );
};

var renderDeletePage = function(req, res, responseBody) {
    res.render('delete', {
	title: 'Blog Delete',
	blogs: responseBody
    });
};

module.exports.deletePost = function(req, res) {
    var requestOptions, path, postdata;
    var id = req.params.blogid;
    path = '/api/blogs/' + id;

    requestOptions = {
	url : apiOptions.server + path,
	method : "DELETE",
	json : {}
    };

    request(
	requestOptions,
	function(err, response, body) {
	    if (response.statusCode === 204) {
		res.redirect('/blogList');
	    } else {
		_showError(req, res, response.statusCode);
	    }
	}
    );
};