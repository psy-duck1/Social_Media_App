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
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

const List = dynamic(() => import("antd/lib/list/index"), { ssr: false });

const Following = () => {
  // console.log("da",people);
  const [state,setState] = useContext(UserContext);
  const [people, setPeople] = useState([]);

  const router = useRouter();
  useEffect(() => {
    if (state && state.token) fetchFollowing();
  }, [state && state.token]);

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get("/user-following");
      console.log("following data", data);
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put("/user-unfollow", { _id: user._id });
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update the context
      setState({ ...state, user: data });
      //rerenderlist
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      toast.error(`Unfollowed ${user.name}`);
      //rerender posts


     
    } catch (err) {console.log(err);}
  };
  return (
    <div className="row col-md-6 offset-md-3">
      <ul className="list-group">
        {people.map((person, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center">
              {person.image ? (
                <Avatar size={20}>{person.image.url}</Avatar>
              ) : (
                <Avatar className="avatar rounded-circle bg-primary me-3">
                  {person.name.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <span>{person.name}</span>
            </div>
            <span
              className="badge bg-primary rounded-pill pointer"
              onClick={() => handleUnfollow(person)}
            >
              Unfollow
            </span>
          </li>
        ))}
      </ul>
      <Link href="/user/dashboard">
        <span className="d-flex justify-content-center py-5">
          <RollbackOutlined />
        </span>
      </Link>
    </div>
  );
};

export default Following;
