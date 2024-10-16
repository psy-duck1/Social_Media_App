// import '././public'

const AuthForm = ({
  username,
  setUsername,
  bio,
  setBio,
  profileUpdate,
  handleSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  secret,
  setSecret,
  page,
  loading,
}) => (
  <form
    onSubmit={handleSubmit}
    className="row g-3 py-4 d-inline align-items-center justify-content-center"
  >
    {profileUpdate?
    ( <>
      <div className="md-4">
      <label className="form-label">Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="form-control "
        placeholder="Full name"
        id="inputName"
      />
    </div>
    <div className="md-4">
      <label className="form-label">Bio</label>
      <input
        type="text"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="form-control "
        placeholder="Full name"
        id="inputName"
      />
    </div>
    </>)
    :null}
    
    {page !== "Login" && (
      <div className="md-4">
        <label className="form-label">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control "
          placeholder="Full name"
          id="inputName"
        />
      </div>
    )}
    <div className="md-4">
      <label htmlFor="inputEmail4" className="form-label">
        Email
      </label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="form-control "
        placeholder="xyz@gmail.com"
        id="inputEmail4"
        disabled={profileUpdate}
      />
    </div>
    <div className="md-4">
      <label htmlFor="inputPassword4" className="form-label">
        Password
      </label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="form-control  "
        id="inputPassword4"
        placeholder={profileUpdate?"Enter new password":""}
      />
    </div>
    {page !== "Login" && (
      <div id="passwordHelpBlock" className="form-text">
        Your password must be 6-20 characters long, contain letters and numbers,
        and must not contain spaces, special characters, or emoji.
      </div>
    )}
    {page !== "Login" && (
      <>
        <div className="md-4">
          <label htmlFor="securityQuestion" className="form-label">
            Pick a question
          </label>
          <select id="securityQuestion" className="form-control wider-input ">
            <option value={1}>What is your favourite color?</option>
            <option value={2}>What is your best friend's name?</option>
            <option value={3}>What city you were born?</option>
          </select>
        </div>
        <div className="form-text">
          *You can use this to reset your password if forgotten.
        </div>
        <div className="md-4">
          <label className="form-label">Write your answer here</label>
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            type="text"
            className="form-control "
          />
        </div>
      </>
    )}
    <div className="col-12">
      <button
        disabled={
          profileUpdate? (!username||!email||!name):(
          page === "Login"
            ? !email || !password
            : !name || !email || !password || !secret)
        }
        type="submit"
        className="btn btn-primary"
      >

        {page === "Login" ? "Login" :(page==="edit"?"Done":"Signup")}
      </button>
    </div>
  </form>
);
export default AuthForm;
