import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRegisterQuery from "./hooks/useRegister";

const Register = () => {
  const navigate = useNavigate();
  const { mutate } = useRegisterQuery();
  const [showPassword, setShowPassword] = useState(false);
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
    console.log({ userInfo });
    mutate(userInfo);
  };

  return (
    <div className="register-form-container">
      <h1>Register</h1>
      <form className="register-form">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" onChange={handleChange} value={userInfo.username} />
        <label htmlFor="password">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          onChange={handleChange}
          value={userInfo.password}
        />
        <i
          className={`icon fa-regular fa-eye`}
          style={{ display: showPassword ? "block" : "none" }}
          onClick={togglePasswordVisibility}></i>
        <i
          className={`icon fa-regular fa-eye-slash`}
          style={{ display: showPassword ? "none" : "block" }}
          onClick={togglePasswordVisibility}></i>
        <button className="form-button" onClick={handleSubmit}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
