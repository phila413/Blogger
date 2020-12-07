var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});

var ctrlApi = require('../controllers/api');
var ctrlAuth = require('../controllers/authentication');

/* GET home page. */

/* GET blog page. */
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/blogs', ctrlApi.fullList);
router.get('/blogs/:blogid', ctrlApi.singleBlog);
router.post('/blogs', auth, ctrlApi.addBlog);        //added auth
router.put('/blogs/:blogid', auth, ctrlApi.updateBlog);  //added auth
router.delete('/blogs/:blogid', auth, ctrlApi.deleteBlog); //added auth
router.put('/blogs/:blogid/num', auth, ctrlApi.updateCommentNum);

router.get('/comments/:blogid', ctrlApi.fullCommentList);
router.get('/comments/:blogid/:commentid', ctrlApi.singleComment);
router.post('/comments/:blogid', ctrlApi.addComment);
router.delete('/comments/:commentid', auth, ctrlApi.deleteComment); //added auth
router.put('/comments/:commentid', ctrlApi.updateComment);

router.get('/users', ctrlApi.allUsers);

module.exports = router;
