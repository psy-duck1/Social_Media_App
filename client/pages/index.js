import Link from "next/link";
const home = () => {
  return (
    <div className="container ">
      <div className="row ">
        <div className="col text-center">
          <h1>Login to continue </h1>
          <Link href="/login"> <span>Login</span></Link>
        </div>
      </div>
    </div>
  );
};
export default home;


