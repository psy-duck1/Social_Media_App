import express from 'express';
import formidable from 'express-formidable';
const router = express.Router();
// controllers
import { createPost ,uploadImage,postsByUser,DeletePost,newsFeed,likePost,unlikePost,addComment,removeComment,GetMessages,SendMessages} from '../controllers/post.js';
import {requireSignIn,canDelete} from '../middlewares/auth.js';

router.post("/create-post",requireSignIn, createPost);
router.post("/upload-image",requireSignIn,formidable({maxFileSize:5*1024*1024}),uploadImage);

router.get("/user-posts",requireSignIn,postsByUser);
router.delete('/delete-post/:_id',requireSignIn,canDelete,DeletePost);
router.get("/Feed",requireSignIn,newsFeed);
router.put('/like-post',requireSignIn,likePost);
router.put('/unlike-post',requireSignIn,unlikePost);
router.put('/add-comment',requireSignIn,addComment);
router.put('/removeComment',requireSignIn,removeComment);
router.get('/messages/:currentUser/:chatUser',requireSignIn,GetMessages);
router.post('/send-message',requireSignIn,SendMessages);




export default router;
