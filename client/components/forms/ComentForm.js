const CommentForm = ({comment,addComment,setComment}) => {
  return (
    <div className="mb-3">
      <label htmlFor="comment" className="form-label">
        Add a comment:
      </label>
      <input
        type="text"
        className="form-control"
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addComment(e);
          }
        }}
      />
      <button
        onClick={(e) => addComment(e)}
        className="btn btn-primary btn-sm my-2"
      >
        Submit
      </button>
    </div>
  );
};
export default CommentForm;