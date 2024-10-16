import dynamic from "next/dynamic";
const Avatar = dynamic(() => import("antd/lib/avatar"));

const DeleteOutlined = dynamic(
  () => import("@ant-design/icons/DeleteOutlined"),
  {
    ssr: false,
  }
);
const Comment = ({
  author,
  content,
  datetime,
  comment,
  state,
  currentPost,
  removeComment,
}) => {
    console.log(comment);
  return (
 
    <div style={{ marginBottom: "10px"
     }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {comment.postedBy.image && comment.postedBy.image.url ? (
          <Avatar size={30} src={comment.postedBy.image.url} />
        ) : (
          <Avatar size={30}>{author&&author.charAt(0)}</Avatar>
        )}
        <span style={{ marginLeft: "10px" }}>{author}</span>
        <span style={{ fontSize: "smaller", color: "gray", marginLeft: "5px" }}>
          {datetime}
        </span>
      </div>
      <div style={{ marginLeft: "40px" }}>
        {content}
        {(state && state.user._id === comment.postedBy._id ||
          state.user._id === currentPost.postedBy._id) && (
          <span className="mx-auto my-1">
            <DeleteOutlined
              className="pointer"
              onClick={
                () => {removeComment(currentPost._id, comment._id )}}
              style={{ marginLeft: "10px" }}
            />
          </span>
        )}
      </div>
    </div>
  );
};
export default Comment;
