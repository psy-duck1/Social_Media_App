import { useState,useContext } from "react";
import { UserContext } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";
import{useRouter} from 'next/router';
import AuthForm from '../components/forms/AuthForms'
import {nanoid} from 'nanoid';
// import Login from "./login";
// import {SyncOutlined} from '@ant-design/icons'
// import { Icon } from 'antd';


// Dynamically import Modal
// Prevents server-side errors by only loading client-side components in the browser.
// Dynamic imports are evaluated at runtime,
// Dynamic imports are designed to work with both ESM  essentially telland CommonJS modules. They the JavaScript engine, "Fi gure out the module format and load it accordingly.

const Modal = dynamic(() => import("antd/lib/modal"), { ssr: false });

const Register = () => {
  const router=useRouter();
  const [state,setState]=useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOK] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // to stop browser from reloading
   
    try {
      const { data } = await axios.post(
        `/register`,
        {
          name,
          email,
          password,
          secret,
          username:nanoid(6),
        }
      );
      setOK(data.ok);
      setName("");
      setEmail("");
      setPassword("");
      setSecret("");
  
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

  if(state &&state.token)router.push("/");
  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <h1>Register</h1>
        </div>
      </div>
      <div className="m-4 d-flex align-items-center justify-content-center">
       <AuthForm
        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        secret={secret}
        setSecret={setSecret}
       />
      </div>
      <Modal
        title="Congratulations"
        open={ok}
        onCancel={() => setOK(false)}
        footer={null}
      >
        <p>You have successfully registered</p>
        <Link href="/login">
          <span className="btn btn-primary btn-sm">Login</span>
        </Link>
      </Modal>
      
      <div className="row">
        <div className="col">
          <p className="text-center">Already registered? <Link className=" text-decoration-none"href="/login">
          <span>Login</span>
        </Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
//
