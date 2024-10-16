// import expressJwt from "express-jwt";
// var { expressjwt: jwt } = require("express-jwt");
import { expressjwt } from "express-jwt";
import Post from "../models/post.js";

const requireSignIn =expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  });

  const canDelete=async(req,res,next)=>{
    console.log(req.auth);
    console.log(req.params._id);
    try{
    const post=await Post.findById(req.params._id);
    console.log(post);
    if(req.auth._id!=post.postedBy){
        res.status(400).send("Unauthorized");
    }else{
        next();
    }
    }
catch(err){
console.log(err);

    }
}
  export  {requireSignIn, canDelete};