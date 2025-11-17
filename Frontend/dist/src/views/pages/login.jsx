// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { sendOtp, verifyOtp } from "../../redux/authSlice";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPhone, faKey } from "@fortawesome/free-solid-svg-icons";
// import "../../Styles/pages/login.css";
// import shoppingcart from "../../assets/images/shoppingcart.png";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { loading, error, otpSent, user } = useSelector((state) => state.auth);

//   // ✅ Redirect to home after successful OTP verification
//   useEffect(() => {
//     if (user) {
//       navigate("/home"); // Change to your actual dashboard/home route
//     }
//   }, [user, navigate]);

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     if (!phone.match(/^\d{10}$/)) {
//       alert("Please enter a valid 10-digit phone number");
//       return;
//     }
//     await dispatch(sendOtp(phone));
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (otp.trim().length === 0) {
//       alert("Please enter OTP");
//       return;
//     }
//     await dispatch(verifyOtp({ phoneNumber: phone, otp }));
//   };

//   return (
//     <div className="login-container">
//       {/* LEFT SIDE */}
//       <div className="login-left">
//         <div className="left-content">
//           <h1>
//             Shop Everything <br /> You <span>Love</span> in One Place
//           </h1>
//           <p>
//             Discover groceries, fashion, snacks, and more — all delivered to your doorstep.
//             Experience convenience like never before with our trusted online store.
//           </p>
//           <div className="left-illustration">
//             <img src={shoppingcart} alt="shopping" className="illustration-img" />
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="login-right">
//         <div className="login-card">
//           <h2 className="login-title">Welcome Back</h2>
//           <p className="login-subtitle">
//             {otpSent ? "Enter the OTP sent to your phone" : "Login with your phone number"}
//           </p>

//           <form
//             onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
//             className="login-form"
//           >
//             {/* Phone Number Input */}
//             <div className="input-group">
//               <FontAwesomeIcon icon={faPhone} className="input-icon" />
//               <input
//                 type="tel"
//                 placeholder="Enter phone number"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 required
//                 disabled={otpSent}
//               />
//             </div>

//             {/* OTP Input */}
//             {otpSent && (
//               <div className="input-group">
//                 <FontAwesomeIcon icon={faKey} className="input-icon" />
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                 />
//               </div>
//             )}

//             <button type="submit" className="login-button" disabled={loading}>
//               {loading
//                 ? otpSent
//                   ? "Verifying..."
//                   : "Sending OTP..."
//                 : otpSent
//                 ? "Verify OTP"
//                 : "Send OTP"}
//             </button>

//             {error && <div className="error-message">{error}</div>}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "../../redux/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faKey } from "@fortawesome/free-solid-svg-icons";
import "../../Styles/pages/login.css";
import shoppingcart from "../../assets/images/shoppingcart.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState(""); // 👈 for client-side validation errors
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, otpSent, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Local validation error
    if (!phone.match(/^\d{10}$/)) {
      setLocalError("Please enter a valid 10-digit phone number");
      return;
    }

    setLocalError("");
    await dispatch(sendOtp(phone));
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.trim().length === 0) {
      setLocalError("Please enter the OTP");
      return;
    }

    setLocalError("");
    await dispatch(verifyOtp({ phoneNumber: phone, otp }));
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="left-content">
          <h1>
            Shop Everything <br /> You <span>Love</span> in One Place
          </h1>
          <p>
            Discover groceries, fashion, snacks, and more — all delivered to your
            doorstep. Experience convenience like never before with our trusted
            online store.
          </p>
          <div className="left-illustration">
            <img src={shoppingcart} alt="shopping" className="illustration-img" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">
            {otpSent ? "Enter the OTP sent to your phone" : "Login with your phone number"}
          </p>

          <form
            onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
            className="login-form"
          >
            {/* Phone Number Input */}
            <div className="input-group">
              <FontAwesomeIcon icon={faPhone} className="input-icon" />
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={otpSent}
              />
            </div>

            {/* 🔴 Error message for phone number */}
            {(!otpSent && (localError || error)) && (
              <div className="error-message">
                {localError || error}
              </div>
            )}

            {/* OTP Input */}
            {otpSent && (
              <>
                <div className="input-group">
                  <FontAwesomeIcon icon={faKey} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                {/* 🔴 Error message for OTP */}
                {otpSent && error && (
                  <div className="error-message">{error}</div>
                )}
              </>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading
                ? otpSent
                  ? "Verifying..."
                  : "Sending OTP..."
                : otpSent
                ? "Verify OTP"
                : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
