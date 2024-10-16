import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// to populate the state even when the reload happens use useEffect hook
const UserContext = createContext();
const UserProvider = ({ children }) => {
    const router=useRouter();
  const [state, setState] = useState({
    user: {},
    token: "",
  });
  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth")));
  }, []);

  const token=state&&state.token?`Bearer ${state.token}`:"";

  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
axios.defaults.headers.common['Authorization'] =token;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.interceptors.response.use(
    function (response) {
      // Log response data
      console.log(response.data);
      // Return the response as is
      return response;
    },
    function (error) {

     console.log(error.response.status);
      

        if (error.response.status === 401) {
          console.log("Unauthorized access, logging out...");
          setState(null);
          window.localStorage.removeItem("auth");
          router.push("/login");
        } 
      
      // Forward the error
      return Promise.reject(error);
    }
  );

  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserProvider };
