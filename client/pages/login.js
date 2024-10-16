import { useState,useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";
import AuthForm from '../components/forms/AuthForms'
import{useRouter} from 'next/router';
import { UserContext } from "../context";



const Modal = dynamic(() => import("antd/lib/modal"), { ssr: false });

const Login = () => {
const router=useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state,setState]=useContext(UserContext);


  const handleSubmit = async (e) => {
    e.preventDefault(); // to stop browser from reloading
    
    try {
      const { data } = await axios.post(
        `/login`,
        {
      
          email,
          password,
       
        }
      );
      //updatecontext
      setState({
        user: data.user,
        token:data.token,
      });
      toast.success("Welcome",{ autoClose: 200,hideProgressBar: true});
     //save in local storage
     window.localStorage.setItem('auth',JSON.stringify(data));
      router.push("/user/dashboard")
     
      console.log(data);
   
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
//  if(state && state.token)router.push("/");
  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <h1>Login</h1>
        </div>
      </div>
      <div className=" d-flex align-items-center justify-content-center">
      <div className="col-md-8">
    <AuthForm
      handleSubmit={handleSubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      page="Login"
      
    />
  </div>
      </div>

      
      <div className="row">
        <div className="col">
          <p className="text-center">Dont have an account? <Link className=" text-decoration-none"href="/register">
          <span>Signup</span>
        </Link></p>
        </div>
      </div>
      <div className="row ">
        <div className=" d-flex col justify-content-center">
        <Link className=" text-decoration-none"href="/forgotPassword">
          <span className="text-center text-danger">Forgot password?</span>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
//
