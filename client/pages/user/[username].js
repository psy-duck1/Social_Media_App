import dynamic from "next/dynamic";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { useContext, useEffect, useState } from "react";
const Avatar = dynamic(() => import("antd/lib/avatar"));
const RollbackOutlined = dynamic(
  () => import("@ant-design/icons/RollbackOutlined"),
  { ssr: false }
);
import UserProfile from "./profile/UserProfile";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

const List = dynamic(() => import("antd/lib/list/index"), { ssr: false });

const Username = () => {
  const [state, setState] = useContext(UserContext);
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (router.query.username) fetchUser();
  }, [router.query.username]);
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/user/${router.query.username}`);
    //   console.log("following data", data);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
  
      <>
      <UserProfile 
      user={user}/>
         
      </>
  );
};

export default Username;
