import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context";
import axios from "axios";
import People from "./cards/People";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import ChatButton from "./ChatButton";
const Avatar = dynamic(() => import("antd/lib/avatar"));

const Nav = () => {
  const router = useRouter();
  const [state, setState] = useContext(UserContext);
  const [current, setCurrent] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [people, setPeople] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };
  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get("/user-following");
      setFollowing(data);
    } catch (err) {
      console.log(err);
    }
  };
  const searchUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/search-user/${query}`);
      setResult(data);
      setShowDropdown(true);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.closest(".dropdown-menu")) return;
    setShowDropdown(false);
  };

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
      console.log("handleFollow", data);
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = result.filter((p) => p._id !== user._id);
      setResult(filtered);
      toast.success(`Following ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnFollow = async (user) => {
    try {
      const { data } = await axios.put("/user-unfollow", { _id: user._id });
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = result.filter((p) => p._id !== user._id);
      setResult(filtered);
      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };
  const isLoginPage = router.pathname === "/login";
  const isRegisterPage = router.pathname === "/register";
  if (isLoginPage || isRegisterPage) {

    return(
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#000" }}>
      <div className="container-fluid">
        <Link href="/user/dashboard" className="navbar-brand">
          SOCIAL
        </Link>
    
        <div className="navbar-nav">
         
            {state !== null ? (
              <li className="nav-item">
                <a onClick={logout} className="pointer nav-link active text-light">
                  Logout
                </a>
              </li>
            ) : (
              <div className="d-flex ">
               <div className="mx-2 px-2">
                  <Link
                    href="/login"
                    className="nav-link active login text-light"
                    style={current === "/login" ? { backgroundColor: "blue" } : {}}
                    
                  >
                    Login
                  </Link>
               </div>
               
                  <Link
                    href="/register"
                    className="nav-link active login text-light"
                    style={current === "/register" ? { backgroundColor: "blue" } : {}}
                  >
                    Signup
                  </Link>
              
              </div>
            )}
          
        </div>
      </div>
    </nav>
    );
  };
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#000" }}
    >
      <div className="container-fluid">
        <Link href="/user/dashboard" className="navbar-brand">
          SOCIAL
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {state !== null && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {state && state.user && state.user.name}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link href="/user/dashboard" className="dropdown-item">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/user/profile/update" className="dropdown-item">
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <a onClick={logout} className="dropdown-item">
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {state && state.user && (
            <div
              className="input-group mx-auto mb-3 mb-lg-0"
              style={{ position: "relative", maxWidth: "40vw" }}
            >
              <input
                className="form-control"
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setResult([]);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchUser(e);
                  }
                }}
              />
              <span className="input-group-append">
                <i
                  className="d-flex py-2 px-2 bi-search pointer bg-primary"
                  onClick={(e) => searchUser(e)}
                  style={{ marginLeft: "1rem", marginTop: "3px" }}
                ></i>
              </span>
              {result && showDropdown && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    zIndex: 1000,
                    top: "100%",
                    left: 0,
                  }}
                >
                  <People
                    people={result}
                    handleFollow={handleFollow}
                    handleUnFollow={handleUnFollow}
                    setShowDropdown={setShowDropdown}
                    page="profile"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="ms-auto d-flex justify-content-center"
          style={{ marginRight: "20vw", marginTop: "2px" }}
        >
          {state && state.user && (
            <ChatButton
              followingUsers={following}
              fetchFollowing={fetchFollowing}
            />
          )}
        </div>

        {state && state.user && state.user.name && (
          <div className="ms-3">
            <Link href={`/user/${state.user.username}`}>
              <Avatar
                className="bg-light"
                size={40}
                src={state.user.image ? state.user.image.url : ""}
              >
                {!state.user.image && state.user.name.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
