import React, { useContext, useState, useEffect } from "react";
import UserRoutes from "../../routes/UserRoutes";
import CreatePostForm from "../../components/forms/CreatePostForm";
import { UserContext } from "../../context";
import axios from "axios";
import { toast } from "react-toastify";
import People from "../../components/cards/People";
import PostPage from "../../components/cards/PostPage";
import Link from "next/link";
import dynamic from "next/dynamic";
import moment from "moment";
import io from "socket.io-client";
import { useRouter } from "next/router";
import ChatButton from "../../components/ChatButton";
const Avatar = dynamic(() => import("antd/lib/avatar"));
const Modal = dynamic(() => import("antd/lib/modal"), { ssr: false });
import Comment from "../../components/showComments";
import CommentForm from "../../components/forms/ComentForm"

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true,
});

const Home = () => {
  const [state, setState] = useContext(UserContext);
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [people, setPeople] = useState([]);
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [following, setFollowing] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (state && state.token) {
      Feed();
      findPeople();
      fetchFollowing();
    }
  }, [state && state.token]);

  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get("/user-following");
      setFollowing(data);
    } catch (err) {
      console.log(err);
    }
  };

  const Feed = async () => {
    try {
      const { data } = await axios.get("/feed");
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/create-post", { content, image });
      Feed();
      toast.success("Post created");
      setContent("");
      setImage({});
    } catch (err) {
      console.log(err);
      toast.error(err.response.data, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      toast.success(`Following ${user.name}`, {
        onClick: () => {
          router.push(`/user/${user.username}`);
        },
      });
      Feed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      Feed();
      toast.error("Post deleted");
    } catch (err) {
      console.log("from handle delete", err);
    }
  };

  const handleLike = async (_id) => {
    try {
      const { data } = await axios.put("/like-post", { _id });
      Feed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnLike = async (_id) => {
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      Feed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (post) => {
    setCurrentPost(post);
    setVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/add-comment", {
        postId: currentPost._id,
        comment,
      });
      setCurrentPost(data);
      setComment("");
      Feed();
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async (postId, commentId) => {
    try {
      const { data } = await axios.put("/removeComment", {
        postId: postId,
        commentId: commentId,
      });
      setCurrentPost(data);
      toast.error("Deleted comment");
      Feed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnFollow = async (user) => {
    try {
      const { data } = await axios.put("/user-unfollow", { _id: user._id });
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      toast.error(`Unfollowed ${user.name}`);
      Feed();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserRoutes>
      <div className="container-fluid">
        <div className="row py-5 text-tertiary bg-default-image">
          <div className="col text-center">
            <h1>Newsfeed</h1>
          </div>
        </div>
        <div className="row py-3">
          <div className="col-md-8 offset-md-2">
            <CreatePostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
          </div>
        </div>
        <div className="row py-3">
          <div className="col-md-8 offset-md-2">
            {posts.length > 0 ? (
              <PostPage
                posts={posts}
                handleDelete={handleDelete}
                handleLike={handleLike}
                handleUnLike={handleUnLike}
                handleComment={handleComment}
                addComment={addComment}
                removeComment={removeComment}
              />
            ) : (
              <p className="text-center">No posts</p>
            )}
          </div>
          <div className="col-md-4">
            {state && state.user && state.user.following && (
              <Link className="text-decoration-none" href="/user/following">

                  <span >Following: {state.user.following.length}</span>
     
              </Link>
            )}
            <div className="mt-4">
              <People people={people} handleFollow={handleFollow} handleUnFollow={handleUnFollow} />
            </div>
            {/* <ChatButton className="" followingUsers={following} fetchFollowing={fetchFollowing} /> */}
          </div>
        </div>
        <Modal
          title="Comments"
          open={visible}
          onCancel={() => {
            setVisible(false);
            setCurrentPost({});
          }}
          footer={null}
        >
          {currentPost.comments ? (
            currentPost.comments.map((item) => (
              <Comment
                key={item._id}
                author={item.postedBy.name}
                content={item.text}
                datetime={moment(item.created).fromNow()}
                comment={item}
                state={state}
                currentPost={currentPost}
                removeComment={removeComment}
              />
            ))
          ) : (
            <div className="my-3">No comments</div>
          )}
          <CommentForm comment={comment} addComment={addComment} setComment={setComment} />
        </Modal>
      </div>
    </UserRoutes>
  );
};

export default Home;
