import { useState,useContext,useEffect } from "react";
import { UserContext } from "../../../context";
import axios from "axios";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";
import{useRouter} from 'next/router';
import AuthForm from '../../../components/forms/AuthForms'
const Avatar = dynamic(() => import("antd/lib/avatar"));
const UserOutlined  = dynamic(() => import("@ant-design/icons/UserOutlined"), {
  ssr: false,
});
const LoadingOutLined  = dynamic(() => import("@ant-design/icons/LoadingOutlined"), {
  ssr: false,
});
// import {nanoid} from 'nanoid';
// import Login from "./login";
// import {SyncOutlined} from '@ant-design/icons'
// import { Icon } from 'antd';


// Dynamically import Modal
// Prevents server-side errors by only loading client-side components in the browser.
// Dynamic imports are evaluated at runtime,
// Dynamic imports are designed to work with both ESM  essentially telland CommonJS modules. They the JavaScript engine, "Fi gure out the module format and load it accordingly.

const Modal = dynamic(() => import("antd/lib/modal"), { ssr: false });

const updateProfile = () => {
  const router=useRouter();
  const [state,setState]=useContext(UserContext);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileUpdate,setProfileUpdate]=useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOK] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image,setImage]=useState({});
  const [uploading,setUploading]=useState(false);

  useEffect(()=>{
    if(state&&state.user){
   setName(state.user.name);
   setBio(state.user.bio);
   setUsername(state.user.username);
   setEmail(state.user.email);
   setSecret(state.user.secret);
   setImage(state.user.image);
    }

  },[state && state.user]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    console.log("this", [...formData]);
    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      console.log("uploaded image", data);
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
  const handleSubmit = async (e) => {
    e.preventDefault(); // to stop browser from reloading
   setLoading(true);
    try {
      const { data } = await axios.put(
        `/profile-update`,
        {
          username,
          bio,
          name,
          email,
          password,
          secret,
          image,
        }
      );
      console.log("succedd",data);
      
      setOK(true);
      setName("");
      setEmail("");
      setPassword("");
      setSecret("");
      setLoading(false);
  //update local storage
  let auth=JSON.parse(localStorage.getItem("auth"));
  auth.user=data;
  localStorage.setItem("auth",JSON.stringify(auth));
  //update context
  setState({...state,user:data});
    } catch (err) {
      setLoading(false);
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

  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <h1>Profile</h1>
        </div>
      </div>
      <div className=" row md-5 d-flex align-items-center ">
<div className=" col offset-md-2  d-flex justify-content-start">
      <label className=" pointer mr-1 py-5" >
              {image && image.url ? (
                (<Avatar size={300} src={image.url}/>)
              ) : uploading ? (
                <LoadingOutLined />
              ) : (
                <Avatar size={300} icon={<UserOutlined />} />
              )}
              <input
                onChange={handleImage}
                type="file"
                accept="images/*"
                hidden
              />
            </label>
            </div>
<div className="col offset-md-1 ">
       <AuthForm
       username={username}
       setUsername={setUsername}
       bio={bio}
       setBio={setBio}
       profileUpdate={true}

        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        secret={secret}
        setSecret={setSecret}
        loading={loading}
        page="edit"
       />
       </div>
      </div>
      <Modal
        title="Congratulations"
        open={ok}
        onCancel={() => setOK(false)}
        footer={null}
      >
        <p>You have successfully updated your profile</p>
        <Link href="/user/dashboard">
          <span className="btn btn-primary btn-sm">Go to dashboard</span>
        </Link>
      </Modal>
      

  
    </div>
  );
};

export default updateProfile;
//
