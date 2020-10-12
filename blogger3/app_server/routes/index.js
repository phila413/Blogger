var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* GET home page. */
router.get('/', ctrlHome.home);

/* GET blog page. */
router.get('/blogList', ctrlBlog.list);
router.get('/blogAdd', ctrlBlog.add);
router.get('/blogEdit/:blogid', ctrlBlog.edit);
router.get('/blogDelete/:blogid', ctrlBlog.del);

router.post('/blogEdit/:blogid', ctrlBlog.updateBlog);
router.post('/blogAdd', ctrlBlog.addPost);
router.post('/blogDelete/:blogid', ctrlBlog.deletePost);

module.exports = router;
