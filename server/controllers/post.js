import Post from "../models/post.js";
import cloudinary from "cloudinary";
import User from "../models/user.js";
import Message from "../models/Message.js";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const createPost = async (req, res) => {
  // console.log(req.body);

  const {
    content,
    "image[url]": url,
    "image[public_id]": public_id,
  } = req.body;

  if (!content) {
    return res.status(400).send("Content is required");
  }
  try {
    const post = new Post({
      content,
      image: { url, public_id },
      postedBy: req.auth._id,
    });
    post.save();
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};
const uploadImage = async (req, res) => {
  // console.log(req);
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    // console.log(result);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.log(err);
  }
};
const postsByUser = async (req, res) => {
  console.log(req.auth._id);
  try {
    // const posts = await Post.find({ postedBy: req.auth._id })
    const posts = await Post.find()
      .populate("postedBy", "_id name image")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};
const DeletePost = async (req, res) => {
  try {
    // console.log("here it sit",req.auth._id);
    const post = await Post.findByIdAndDelete(req.params._id);
    if (post.image && post.image.public_id) {
      console.log("bfa;nba;en");
      const result = await cloudinary.uploader.destroy(post.image.public_id);
    }
    res.send({ ok: true });

  } catch (err) {
    console.log("from delete post", err);
  }
};
const newsFeed = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    let following = user.following;
    following.push(req.auth._id);

    const posts = await Post.find({ postedBy: { $in: following } })
      .populate("postedBy", "_id name image username")
      .populate("comments.postedBy", "_id name image")
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      {
        $addToSet: { likes: req.auth._id },
      },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      {
        $pull: { likes: req.auth._id },
      },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};
const addComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    console.log(req.body);
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { text: comment, postedBy: req.auth._id } },
      },
      { new: true }
    ).populate("postedBy", "_id name image").populate(`comments.postedBy`, "_id name image")

      console.log(post);
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};
const removeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;
console.log("removeCOmment",req.body);
    const post= await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: { _id: commentId } },
      },
      { new: true }
    ).populate("postedBy", "_id name image")
    .populate("comments.postedBy", "_id name image");
 
    console.log("updated post",post);
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};
const GetMessages=async(req,res)=>{
 
    const { currentUser, chatUser } = req.params;
    try {
      const messages = await Message.find({
        $or: [
          { from: currentUser, to: chatUser },
          { from: chatUser, to: currentUser },
        ]
      }).populate('from to', 'name');
      res.json(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      res.status(500).json({ error: 'Failed to load messages' });
    }
  
};
const SendMessages=async(req,res)=>{
  try {
    console.log("reached",req.body);
    const { to, text } = req.body;
    const newMessage = new Message({ from: req.auth._id, to, text });
    const savedMessage = await newMessage.save();
    await savedMessage.populate('from to', 'name');
  
    res.json(savedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }


};

export {
  createPost,
  uploadImage,
  postsByUser,
  DeletePost,
  newsFeed,
  likePost,
  unlikePost,
  addComment,
  removeComment,
  SendMessages,
  GetMessages,
};
