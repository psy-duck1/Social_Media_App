import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context";
// import { SyncOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import axios from "axios";


const UserRoutes = ({ children }) => {
  const router = useRouter();
  const [state] = useContext(UserContext);
  const [ok, setOK] = useState(false);

  useEffect(() => {
   if(state&&state.token) getCurrentUser();
  }, [state && state.token]);

  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/currentUser`,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      console.log(data);
     
      if (data.ok) setOK(true);
    } catch (err) {
        console.log(err);
        router.push("/login");
    }
  };
  //this will only run when user is not logged in
 {process.browser &&
    state == null &&
    setTimeout(() => {
      getCurrentUser();
    }, 1000);}

  return !ok ?(
    <div>
<h1 className="d-flex justify-content-center display-1">Loading...</h1>
    </div>
  ) : <>{children}</>;
};

export default UserRoutes;
