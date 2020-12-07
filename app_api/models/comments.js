var mongoose = require('mongoose');

var time = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});

var commentSchema = new mongoose.Schema({
	blogid: {type: String, required: true},
    comment: {type: String, required: true},
    date: {type: String, "default": time},
    email: {type: String, required: true},
    name: {type: String, required: true}
});

mongoose.model('comments', commentSchema);