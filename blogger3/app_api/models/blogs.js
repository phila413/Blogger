var mongoose = require('mongoose');

var time = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});

var blogSchema = new mongoose.Schema({
    blogTitle: {type: String, required: true},
    blogText: String,
    date: {type: String, "default": time}
});

mongoose.model('blogs', blogSchema);
