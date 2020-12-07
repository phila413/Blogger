var mongoose = require('mongoose');

var time = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});

var blogSchema = new mongoose.Schema({
    blogTitle: {type: String, required: true},
    blogText: String,
    date: {type: String, "default": time},
    email: {type: String, required: true},
    name: {type: String, required: true},
    commentNum: {type: Number, required: true}
});

mongoose.model('blogs', blogSchema);
