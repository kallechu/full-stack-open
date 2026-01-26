const LoginForm = ({
  handleUserNameChangeValue,
  handlePasswordChangeValue,
  usernameValue,
  passwordValue,
  onSubmitValue,
}) => {
  return (
    <div>
        <h1>log in to application</h1>
      <form onSubmit={onSubmitValue}>
        <div>
          <label>
            username
            <input
              type="text"
              value={usernameValue}
              onChange={handleUserNameChangeValue}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={passwordValue}
              onChange={handlePasswordChangeValue}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
