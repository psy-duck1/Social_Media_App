import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';



import Nav from "../components/Nav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "../context";
import "../public/css/stlyes.css";



function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>

      <Nav />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}              
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Component {...pageProps} />
    </UserProvider>
  );
}
export default MyApp;
