import React from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/router";
const Avatar = dynamic(() => import("antd/lib/avatar"));
import { UserContext } from "../../../context";
import { useContext, useState, useEffect } from "react";
import Postimage from "../../../components/images/Postimage";
import moment from "moment";
import Userprofile from "../../../components/cards/Userprofile";
import { toast } from "react-toastify";
const HeartOutlined = dynamic(() => import("@ant-design/icons/HeartOutlined"), {
  ssr: false,
});
import Link from "next/link";
const RollbackOutlined=dynamic(() => import("@ant-design/icons/RollbackOutlined"), {
    ssr: false,
  });

const Modal = dynamic(() => import("antd/lib/modal"), { ssr: false });
const HeartFilled = dynamic(() => import("@ant-design/icons/HeartFilled"), {
  ssr: false,
});
const CommentOutlined = dynamic(
  () => import("@ant-design/icons/CommentOutlined"),
  {
    ssr: false,
  }
);

const DeleteOutlined = dynamic(
  () => import("@ant-design/icons/DeleteOutlined"),
  {
    ssr: false,
  }
);

import CommentForm from "../../../components/forms/ComentForm";
import Comment from "../../../components/showComments";
const UserProfile = (userData) => {
  if (!userData || !userData.user || !userData.user.posts) {
    // Handle case where userData or its properties are undefined
    return <div>Loading...</div>; // or any other fallback UI
  }
  const [state] = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (userData.user && userData.user.posts) {
      setUser(userData.user.user); // Assuming userData.user.user contains user details
      setPosts(userData.user.posts); // Initialize posts, handling if userData.user.posts is undefined
    }
  }, [userData.user, userData.user.posts]);

  console.log("here", userData.user.posts);
  const Feed = async () => {
    try {
      const { data } = await axios.get(`/user/${router.query.username}`);
      console.log("USER=>", data.user);
      console.log("POSTS=>", data.posts);
      setUser(data.user);
      setPosts(data.posts);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are yo sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      console.log(data);

      console.log("succesfullly deleted");
      toast.error("Post deleted"); //red
      Feed();
    } catch (err) {
      console.log("from handle delete", err);
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
      console.log("add comment", data);
      setCurrentPost(data);
      setComment("");
      Feed();
    } catch (err) {
      console.log(err);
    }
  };
  const removeComment = async (postId, commentId) => {
    try {
      console.log("removeComment", postId, commentId);

      const { data } = await axios.put("/removeComment", {
        postId: postId,
        commentId: commentId,
      });

      console.log("removed cooblbybmment", data);
      setCurrentPost(data);

      toast.error("Deleted comment");
      Feed();
    } catch (err) {
      console.log(err);
    }
  };

 
  const handleLike = async (_id) => {
    try {
      console.log("req recieved");
      const { data } = await axios.put("/like-post", { _id });
      console.log(data);
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

  return (
    <div className="container-fluid bg-light" style={{ minHeight: "100vh" }}>
      <div className="row">
        {/* Left Section */}
        <div className="px-0">
          <div className="text-white d-flex flex-column" style={{ backgroundColor: "#000", height: "20vh" }}>
            <div className="ms-4 mt-5 d-flex flex-column">
              {user.image ? (
                <Avatar
                  className="border border-secondary avatar-lg" // Default class for larger screens
                  shape="square"
                  src={user.image.url}
                />
              ) : (
                <Avatar
                  className="border border-secondary avatar-lg"
                  shape="square"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : ""}
                </Avatar>
              )}
            </div>
            <div style={{ marginTop: 90, marginRight: "60px" }}>
              <h5>{user.name}</h5>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-12 col-lg-6">
          <div className="p-4 text-black bg-body-tertiary">
            <div className="d-flex justify-content-end text-center py-1 text-body">
              <div>
                <p className="mb-1 h5">{posts.length}</p>
                <p className="small text-muted mb-0">Posts</p>
              </div>
              <div className="px-3">
                <p className="mb-1 h5">{user.followers ? user.followers.length : ""}</p>
                <p className="small text-muted">Followers</p>
              </div>
              <div>
                <p style={{ marginRight: "20px" }} className="mb-1 h5">{user.following ? user.following.length : ""}</p>
                <p style={{ marginRight: "20px" }} className="small text-muted mb-0">Following</p>
              </div>
            </div>
          </div>

          <div className="card-body p-4 text-black">
            <div className="mb-5 text-body">
              <p className="userprofile-container lead fw-normal mb-1">About</p>
              <div className="bg-body-tertiary">
                <p className="userprofile-container font-italic mb-1">{userData.user.user.bio}</p>
              </div>
            </div>
            <div className="userprofile-container d-flex justify-content-between align-items-center mb-4 text-body">
              <p className="lead fw-normal mb-0">Recent posts</p>
            </div>
            <div className="row g-2">
              <Userprofile
                posts={posts}
                user={user}
                handleLike={handleLike}
                handleUnLike={handleUnLike}
                handleComment={handleComment}
                addComment={addComment}
                removeComment={removeComment}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Comments */}
      <Modal
        title="Comments"
        open={visible}
        onCancel={() => {
          setVisible(false);
          setCurrentPost({});
        }}
        footer={null}
      >
        {currentPost.comments && currentPost.comments.length > 0 ? (
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
          <p>No comments</p>
        )}

        <CommentForm
          comment={comment}
          addComment={addComment}
          setComment={setComment}
        />
      </Modal>

      {/* Back to Dashboard Link */}
      <Link href="/user/dashboard">
        <span className="d-flex justify-content-center">
          <RollbackOutlined />
        </span>
      </Link>
    </div>
  );
};

export default UserProfile;