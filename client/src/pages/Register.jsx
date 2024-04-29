import React, { useCallback, useEffect, useState } from "react";
import useRegisterQuery from "src/hooks/useRegister";

const Register = () => {
  const { mutateAsync, error } = useRegisterQuery();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    mutateAsync(userInfo).then(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (error) {
      setIsLoading(false);
    }
  }, [error]);

  return (
    <div className="register-form-container">
      <h1>Register</h1>
      <form className="register-form">
        <div>
          <label htmlFor="username">Username</label>
          &nbsp; &nbsp; &nbsp;
          <input type="text" id="username" name="username" onChange={handleChange} value={userInfo.username} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          {/* add gap using html */}
          &nbsp; &nbsp; &nbsp;
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            onChange={handleChange}
            value={userInfo.password}
          />
        </div>
        <i
          className={`icon fa-regular fa-eye`}
          style={{ display: showPassword ? "block" : "none" }}
          onClick={togglePasswordVisibility}></i>
        <i
          className={`icon fa-regular fa-eye-slash`}
          style={{ display: showPassword ? "none" : "block" }}
          onClick={togglePasswordVisibility}></i>
        <button className="button" onClick={handleSubmit}>
          {isLoading ? "Please wait..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
