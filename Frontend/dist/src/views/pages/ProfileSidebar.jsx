import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, closeSidebar } from "../../redux/profileSlice";
import { logout } from "../../redux/authSlice";
import "../../Styles/pages/ProfileSidebar.css";
import { X } from "react-feather";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli",
  "Daman & Diu", "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

function ProfileSidebar() {
  const dispatch = useDispatch();
  const { sidebarOpen, loading } = useSelector((state) => state.profile);
  const token = localStorage.getItem("access");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address_line_1: "",
    street_name: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Live validation errors
    let newErrors = { ...errors };

    // NAME VALIDATION (letters only)
    if (name === "first_name" || name === "last_name") {
      if (!/^[A-Za-z]*$/.test(value)) {
        newErrors[name] = "Only letters are allowed";
      } else {
        newErrors[name] = "";
      }
    }

    // PINCODE VALIDATION (numbers only + must be 6 digits)
    if (name === "pincode") {
      if (!/^\d*$/.test(value)) {
        newErrors[name] = "Only numbers allowed";
      } else if (value.length > 6) {
        newErrors[name] = "Pincode cannot exceed 6 digits";
      } else {
        newErrors[name] = "";
      }
    }

    setErrors(newErrors);
    setForm({ ...form, [name]: value });
  };

  /* =============================
         SUBMIT VALIDATION
  ============================== */
  const validate = () => {
    let err = {};

    // FIRST NAME
    if (!form.first_name.trim())
      err.first_name = "First name is required";
    else if (!/^[A-Za-z]+$/.test(form.first_name))
      err.first_name = "Only letters allowed";

    // LAST NAME
    if (!form.last_name.trim())
      err.last_name = "Last name is required";
    else if (!/^[A-Za-z]+$/.test(form.last_name))
      err.last_name = "Only letters allowed";

    // EMAIL
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      err.email = "Invalid email address";

    // ADDRESS
    if (!form.address_line_1.trim())
      err.address_line_1 = "Address is required";

    if (!form.street_name.trim())
      err.street_name = "Street name is required";

    if (!form.city.trim())
      err.city = "City is required";

    // STATE
    if (!form.state.trim())
      err.state = "State is required";

    // PINCODE
    if (!form.pincode.trim())
      err.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode))
      err.pincode = "Pincode must be exactly 6 digits";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch(updateProfile({ token, data: form }));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(closeSidebar());
  };

  return (
    <>
      <div
        className={`overlay ${sidebarOpen ? "show-overlay" : ""}`}
        onClick={() => dispatch(closeSidebar())}
      ></div>

      <div className={`profile-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">

          <button className="sidebar-close-icon" onClick={() => dispatch(closeSidebar())}>
            <X size={22} />
          </button>

          <h2>Complete Your Profile</h2>

          {/* INPUT FIELDS */}
          {Object.keys(form).map((key) => (
            key !== "state" && (
              <div className="input-fields" key={key}>
                <label>{key.replace("_", " ").toUpperCase()}</label>
                <input
                  name={key}
                  value={form[key]}
                  placeholder={`Enter ${key.replace("_", " ")}`}
                  onChange={handleChange}
                />
                {errors[key] && <p className="error-text">{errors[key]}</p>}
              </div>
            )
          ))}

          {/* STATE */}
          <div className="input-fields">
            <label>STATE</label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="dropdown-input"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="error-text">{errors.state}</p>}
          </div>

          {/* BUTTONS */}
          <div className="sidebar-buttons">
            <button className="save-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
}
export default ProfileSidebar;
