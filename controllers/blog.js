module.exports.add = function(req, res) {
    res.render('addBlog', { title: 'Blog Add' });
};

module.exports.list = function(req, res) {       
    res.render('listBlog', { title: 'Blog List' });
}
