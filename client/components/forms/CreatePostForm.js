const Avatar = dynamic(() => import('antd/lib/avatar'));

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const CameraOutlined = dynamic(
  () => import("@ant-design/icons/CameraOutlined"),
  { ssr: false }
);
const LoadingOutLined = dynamic(
  () => import("@ant-design/icons/LoadingOutlined"),
  { ssr: false }
);

import "react-quill/dist/quill.snow.css";

const CreatePostForm = ({
  content,
  setContent,
  postSubmit,
  handleImage,
  uploading,

  image,
}) => {
  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div >
            <form className="form-group " onSubmit={postSubmit}>
              <textarea
                theme="snow"
                className="form-control "
                placeholder="Whats on you mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </form>
          </div>
          <div className="card-footer d-flex justify-content-between ">
            <button className="btn  btn-sm btn-primary " onClick={postSubmit}>
              Post
            </button>
            <label>
              {image && image.url ? (
                (<Avatar size={30} src={image.url}/>)
              ) : uploading ? (
                <LoadingOutLined />
              ) : (
                <CameraOutlined className="pointer" />
              )}
              <input
                onChange={handleImage}
                type="file"
                accept="images/*"
                hidden
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePostForm;
