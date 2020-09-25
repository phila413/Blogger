module.exports.add = function(req, res) {
    res.render('addBlog', { title: 'Blog Add' });
};

module.exports.list = function(req, res) {       
    res.render('listBlog', {
	title: 'Blog List',
	blogs: [{
            blogTitle: "test1",
            blogText: "here is my first blog",
            date: "2020-09-21"
        }, {
            blogTitle: "test2",
            blogText: "here is my second blog",
            date: "2020-09-22"
        }, {
            blogTitle: "test3",
            blogText: "here is my third blog",
            date: "2020-09-23"
        }]
    });
};

module.exports.edit = function(req, res) {
    res.render('edit', { title: 'Blog Edit' });
};

module.exports.del = function(req, res) {
    res.render('delete', { title: 'Blog Delete' });
};