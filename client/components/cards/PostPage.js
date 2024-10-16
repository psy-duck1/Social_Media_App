import React from "react";
import dynamic from "next/dynamic";
import Postimage from "../images/Postimage";
import { UserContext } from "../../context";
import { useContext } from "react";
import Link from "next/link";
import moment from "moment";
const Avatar = dynamic(() => import("antd/lib/avatar"));

const HeartOutlined = dynamic(() => import("@ant-design/icons/HeartOutlined"), {
  ssr: false,
});
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
const SyncOutlined = dynamic(() => import("@ant-design/icons/SyncOutlined"));
const PostPage = ({
  posts,
  handleDelete,
  handleLike,
  handleUnLike,
  handleComment,
  addComment,
  removeComment,
}) => {
  const [state] = useContext(UserContext);
  console.log(state);
  return (
    <div className="container-fluid">
      <div className="row ">
        {posts.map((post, index) => (
          <>
            <div
              key={post._id}
              className=" mb-3 border  rounded"
              style={{ border: "2px" }}
            >
              <div className="header py-2">
                {state &&
                state.user &&
                state.user.image &&
                state.user.image.url &&
                post.postedBy._id === state.user._id ? (
                  <Avatar size={40} src={state.user.image.url} />
                ) : (
                  <Avatar size={40}>{post.postedBy.name[0]}</Avatar>
                )}

<Link className="pointer text-decoration-none text-dark" href={`/user/${post.postedBy.username}`}><span style={{ marginLeft: "1rem" }}>{post.postedBy.name}</span></Link>
                <span className="py-2" style={{ marginLeft: "1rem" }}>
                  {moment(post.createdAt).fromNow()}
                </span>
              </div>
              <div key={index} className="col-12 mb-4">
                <div className="card shadow-sm">
                  {post.image && <Postimage url={post.image.url} />}
                  <div className="card-body">
                    <h5 className="card-title">{post.content}</h5>
                  </div>
                {/* </div> */}
              </div>
              <div className="d-flex pt-2">
                {state && post.likes.includes(state.user._id) ? (
                  <HeartFilled
                    onClick={() => handleUnLike(post._id)}
                    className="text-danger pointer pt-2 h5"
                  />
                ) : (
                  <HeartOutlined
                    onClick={() => handleLike(post._id)}
                    className="text-danger pointer pt-2 h5"
                  />
                )}
                <div className="pt-2 px-1"> {post.likes.length} likes</div>
                <CommentOutlined onClick={()=>handleComment(post)}className="text-danger mx-2 pt-2 h5" />
                <div className="pt-2 "> {post.comments.length} comments</div>

                {state &&
                  state.user &&
                  state.user._id === post.postedBy._id && (
                    <DeleteOutlined
                      onClick={() => handleDelete(post)}
                      className="text-danger  pt-2 h5"
                      style={{ marginLeft: "15px" }}
                    />
                  )}
              </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
