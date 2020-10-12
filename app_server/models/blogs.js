var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogTitle: {type: String, required: true},
    blogText: String,
    date: {type: Date, "default": Date.now}
});

mongoose.model('Blog', blogSchema);
