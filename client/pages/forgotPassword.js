import { useState, useContext } from "react";
import { UserContext } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from 'next/router';
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";

const Modal = dynamic(() => import("antd/lib/modal"), { ssr: false });

const ForgotPassword = () => {
  const router = useRouter();
  const [state, setState] = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOK] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Submitting form with data:", { email, NewPassword, secret });

      const { data } = await axios.post(`/forgotPassword`, {
        email,
        NewPassword,
        secret,
      });
      console.log("Response data:", data);

      
      
        setEmail("");
        setNewPassword("");
        setSecret("");
        setOK(true);
        setLoading(false);
      
    } catch (err) {
      console.log("Error submitting form:", err);

      toast.error(err.response.data.error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setLoading(false);
    }
  };

  if (state && state.token) router.push("/");

  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <h1>Reset your password</h1>
        </div>
      </div>
      <div className="m-4 d-flex align-items-center justify-content-center">
        <ForgotPasswordForm
          handleSubmit={handleSubmit}
          email={email}
          setEmail={setEmail}
          NewPassword={NewPassword}
          setNewPassword={setNewPassword}
          secret={secret}
          setSecret={setSecret}
          loading={loading}
        />
      </div>
      <Modal
        title="Congratulations"
        open={ok}
        onCancel={() => setOK(false)}
        footer={null}
      >
        <p>You can now login with your new password</p>
        <Link href="/login">
          <span className="btn btn-primary btn-sm">Login</span>
        </Link>
      </Modal>
      <div className="row">
        <div className="col">
          <p className="text-center">
            Already registered? <Link className="text-decoration-none" href="/login"><span>Login</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
