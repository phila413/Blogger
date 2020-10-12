var mongoose = require('mongoose');
var Blog = mongoose.model('blogs');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var buildBlogList = function(req, res, test) {
    var blogs = [];
    test.forEach(function(obj) {
	blogs.push({
	    _id: obj._id,
	    blogTitle: obj.blogTitle,
	    blogText: obj.blogText,
	    date: obj.date
	});
    });
    return blogs;
};

module.exports.fullList = function (req, res) {
    Blog
        .find()
        .exec(function(err, test) {
	    if (!test) {
		sendJsonResponse(res, 404, {
		    "message": "no blogs found"
		});
		return;
	    } else if (err) {
		console.log(err);
		sendJsonResponse(res, 404, err);
		return;
	    }
	    console.log(test);
	    sendJsonResponse(res, 200, buildBlogList(req, res, test));
	});  
};

module.exports.singleBlog = function (req, res){
    if (req.params && req.params.blogid) {
	Blog
            .findById(req.params.blogid)
            .exec(function(err, test) {
		if(!test) {
		    sendJsonResponse(res, 404, {
			"message": "blogid not found"
		    });
		    return;
		} else if (err) {
		    sendJsonResponse(res, 404, err);
		    return;
		}

		    
		sendJsonResponse(res, 200, test);
	    });
    } else {
	sendJsonResponse(res, 404, {
	    "message": "No blogid in request"
	});
    }
};

module.exports.addBlog = function (req, res){
    Blog.create({
	blogTitle: req.body.blogTitle,
	blogText: req.body.blogText,
	date: req.body.date
    }, function(err, test) {
	if (err) {
	    sendJsonResponse(res, 400, err);
	} else {
	    sendJsonResponse(res, 201, test);
	}
    });
};

module.exports.updateBlog = function (req, res){
    if(!req.params.blogid) {
	sendJsonResponse(res, 404, {
	    "message": "Not found, blogid is required"
	});
	return;
    }
    Blog
        .findById(req.params.blogid)
        .exec(
	    function(err, test) {
		if(!test) {
		    sendJsonResponse(res, 404, {
			"message": "blogid not found"
		    });
		    return;
		} else if (err) {
		    sendJsonResponse(res, 400, err);
		    return;
		}
		test.blogTitle = req.body.blogTitle;
		test.blogText = req.body.blogText;
		test.date = req.body.date;
		test.save(function (err, test) {
		    if(err) {
			sendJsonResponse(res, 404, err);
		    } else {
			sendJsonResponse(res, 200, test);
		    }
		});
	    }
	);
};

module.exports.deleteBlog = function (req, res){
    var blogid = req.params.blogid;
    if(blogid) {
	Blog
	    .findByIdAndRemove(blogid)
	    .exec(
		function(err, test) {
		    if(err) {
			sendJsonResponse(res, 404, err);
			return;
		    }
		    sendJsonResponse(res, 204, null);
		}
	    );
    } else {
	sendJsonResponse (res, 404, {
	    "message": "No blogid"
	});
    }
};
