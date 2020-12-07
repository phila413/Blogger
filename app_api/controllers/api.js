var mongoose = require('mongoose');
var Blog = mongoose.model('blogs');
var Comment = mongoose.model('comments');
var User = mongoose.model('User');

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
	    date: obj.date,
	    email: obj.email,
	    name: obj.name
	});
    });
    return blogs;
};

var buildUsersList = function(req, res, test) {
    var users = [];
    test.forEach(function(obj) {
	users.push({
	    email: obj.email,
	    name: obj.name
	});
    });
    return users;
};

var buildCommentList = function(req, res, test, id) {
    var comments = [];
    test.forEach(function(obj) {
    	if(obj.blogid == id){
			comments.push({
			    _id: obj._id,
			    blogid: obj.blogid,
			    comment: obj.comment,
			    date: obj.date,
			    email: obj.email,
			    name: obj.name
			});
		}
    });
    return comments;
};

module.exports.allUsers = function (req, res) {
	console.log("test");
    User
        .find()
        .exec(function(err, test) {
        	console.log("tes2t");
	    	if (!test) {
				sendJsonResponse(res, 404, {"message": "no blogs found"});
				return;
	   		} else if (err) {
				console.log(err);
				sendJsonResponse(res, 404, err);
				return;
	   		}
	    	console.log(test);
	    	sendJsonResponse(res, 200, buildUsersList(req, res, test));
		});  
};

module.exports.singleComment = function (req, res){
    if (req.params && req.params.commentid) {
	Comment
            .findById(req.params.commentid)
            .exec(function(err, test) {
		if(!test) {
		    sendJsonResponse(res, 404, {
			"message": "commentid not found"
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
	    "message": "No commentid in request"
	});
    }
};

module.exports.fullCommentList = function (req, res) {
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
			console.log(test);
			Comment
	        	.find()
	        	.exec(function(err, test2) {
		    	if (!test2) {
					sendJsonResponse(res, 404, {
					    "message": "no comments found"
					});
					return;
			    } else if (err) {
					console.log(err);
					sendJsonResponse(res, 404, err);
					return;
			    }
			    sendJsonResponse(res, 200, buildCommentList(req, res, test2, test._id));
			}); 
	    });
    } else {
	sendJsonResponse(res, 404, {
	    "message": "No blogid in request"
	});
    }
   
};

module.exports.addComment = function (req, res){
    Comment.create({
    blogid: req.body.blogid,
	comment: req.body.comment,
	date: req.body.date,
	email: req.body.email,
	name: req.body.name
    }, function(err, test) {
	if (err) {
	    sendJsonResponse(res, 400, err);
	} else {
	    sendJsonResponse(res, 201, test);
	}
    });
};

module.exports.deleteComment = function (req, res){
    var commentid = req.params.commentid;
    if(commentid) {
	Comment
	    .findByIdAndRemove(commentid)
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
	    "message": "No commentid"
	});
    }
};

module.exports.updateComment = function (req, res){
    if(!req.params.commentid) {
	sendJsonResponse(res, 404, {
	    "message": "Not found, commentid is required"
	});
	return;
    }
    Comment
        .findById(req.params.commentid)
        .exec(
	    function(err, test) {
		if(!test) {
		    sendJsonResponse(res, 404, {
			"message": "commentid not found"
		    });
		    return;
		} else if (err) {
		    sendJsonResponse(res, 400, err);
		    return;
		}
		test.comment = req.body.comment;
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
	date: req.body.date,
	email: req.body.email,
	name: req.body.name
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
