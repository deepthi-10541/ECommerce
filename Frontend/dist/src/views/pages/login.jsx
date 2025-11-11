import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
// import { faFacebookF, faTwitter, faGoogle } from "@fortawesome/free-brands-svg-icons";
import "../../Styles/pages/login.css";
// import Shopping from '../../assets/images/Shopping.png';
import shoppingcart from '../../assets/images/shoppingcart.png';
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser({username, password }));
  };

  const SocialIconLink = ({ icon, brandClass }) => (
    <a href="#!" className={`social-icon ${brandClass}`}>
      <FontAwesomeIcon icon={icon} />
    </a>
  );

  return (
    <div className="login-container">
      {/* LEFT SIDE - Store Theme */}
      <div className="login-left">
        <div className="left-content">
          <h1>
            Shop Everything <br /> You <span>Love</span> in One Place
          </h1>
          <p>
            Discover groceries, fashion, snacks, and more — all delivered to your doorstep. 
            Experience convenience like never before with our trusted online store.
          </p>
          <div className="left-illustration">
            <img
              src={shoppingcart}
              alt="shopping"
              className="illustration-img"
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Card */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Login to continue shopping</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* <div className="forgot-password">
              <a href="#!">Forgot password?</a>
            </div> */}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <div className="error-message">{error}</div>}
          </form>

          {/* <div className="social-login">
            <p>Or login with</p>
            <div className="social-icons">
              <SocialIconLink icon={faFacebookF} brandClass="facebook" />
              <SocialIconLink icon={faTwitter} brandClass="twitter" />
              <SocialIconLink icon={faGoogle} brandClass="google" />
            </div>
          </div> */}

          {/* <div className="signup-link">
            <p>
              Don’t have an account? <a href="#!">Sign Up</a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
