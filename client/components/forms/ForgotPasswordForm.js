// import '././public'

const ForgotPasswordForm = ({
    handleSubmit,
    email,
    setEmail,
    NewPassword,
    setNewPassword,
    secret,
    setSecret,
    loading,
  
  }) => (
    <form
      onSubmit={handleSubmit}
      className="row g-3 py-4 d-inline align-items-center justify-content-center"
    >
      
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
        />
      </div>
      <div className="md-4">
        <label htmlFor="inputPassword4" className="form-label">
          New password
        </label>
        <input
          value={NewPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          className="form-control  "
          id="inputPassword4"
          placeholder="Enter new password"
        />
      </div>
     <div id="passwordHelpBlock" className="form-text">
        Your password must be 6-20 characters long, contain letters and numbers,
        and must not contain spaces, special characters, or emoji.
      </div>
   <>
      <div className="md-4">
        <label htmlFor="securityQuestion" className="form-label">
   Your security Question:
        </label>
        <select id="securityQuestion" className="form-control wider-input ">
          <option value={1}>What is your favourite color?</option>
          <option value={2}>What is your best friend's name?</option>
          <option value={3}>What city you were born?</option>
        </select>
      </div>
  <div className="form-text">
       
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
      <div className="col-12">
        <button
          disabled={!email || !NewPassword ||!secret||loading}
          type="submit"
          className="btn btn-primary"
        >
       {loading===true?"Loading...":"Submit"}
        </button>
      </div>
    </form>
  );
  export default ForgotPasswordForm;
  