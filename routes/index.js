var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* GET home page. */
router.get('/', ctrlHome.home);

/* GET blog page. */
router.get('/blogList', ctrlBlog.list);
router.get('/blogAdd', ctrlBlog.add);

module.exports = router;
