import express from 'express';
const router = express.Router();
// controllers
import { register,login, currentUser,forgotPassword,profileUpdate,findPeople,addFollower,userFollow,userFollowing,removeFollower,userUnfollow,searchUser,getUser} from '../controllers/auth.js';
import {requireSignIn} from '../middlewares/auth.js';

router.post("/register", register);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.get("/currentUser", requireSignIn, currentUser);
router.put("/profile-update",requireSignIn,profileUpdate);
router.get("/find-people",requireSignIn,findPeople);
router.put("/user-follow",requireSignIn,addFollower,userFollow);
router.put("/user-unfollow",requireSignIn,removeFollower,userUnfollow);
router.get("/user-following",requireSignIn,userFollowing);
router.get("/search-user/:query",requireSignIn,searchUser);

router.get("/user/:username",getUser);




export default router;
