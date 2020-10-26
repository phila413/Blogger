var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');
var ctrlApi = require('../controllers/api');

/* GET home page. */
router.get('/', ctrlHome.home);

/* GET blog page. */
router.get('/blogList', ctrlBlog.list);
router.get('/blogAdd', ctrlBlog.add);
router.get('/blogEdit/:blogid', ctrlBlog.edit);
router.get('/blogDelete', ctrlBlog.del);

router.get('/blogs', ctrlApi.fullList);
router.get('/blogs/:blogid', ctrlApi.singleBlog);
router.post('/blogs', ctrlApi.addBlog);
router.put('/blogs/:blogid', ctrlApi.updateBlog);
router.delete('/blogs/:blogid', ctrlApi.deleteBlog);

module.exports = router;
