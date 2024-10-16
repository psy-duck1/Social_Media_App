const Postimage = ({ url }) => {
  
    return (
  <div className="p-2"
    style={{
      backgroundImage:`url(${url})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center ",
      backgroundSize: "cover",
      height: "400px",
  
    }}
  />)
};
export default Postimage;
