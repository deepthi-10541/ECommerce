import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiList from "../../api.json";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ 1️⃣ Step 1 - Send OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const otpEndpoint = `${API_URL}${apiList.auth.send_otp}`;
      // 🟢 Change "phone_number" → "phone"
      const { data } = await axios.post(otpEndpoint, { phone: phoneNumber});
      return data.message || "OTP sent successfully";
    } catch (err) {
      if (err.response?.data?.detail) {
        return rejectWithValue(err.response.data.detail);
      }
      return rejectWithValue("Failed to send OTP");
    }
  }
);

// ✅ 2️⃣ Step 2 - Verify OTP and Login
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ phoneNumber, otp }, { rejectWithValue }) => {
    try {
      const verifyEndpoint = `${API_URL}${apiList.auth.verify_otp}`;
      // 🟢 Change "phone_number" → "phone"
      const { data } = await axios.post(verifyEndpoint, {
        phone: phoneNumber,
        otp,
      });

      // Store tokens in localStorage
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("phone", phoneNumber);

      return { phoneNumber };
    } catch (err) {
      if (err.response?.data?.detail) {
        return rejectWithValue(err.response.data.detail);
      }
      return rejectWithValue("Invalid OTP");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("phone") || null,
    loading: false,
    error: null,
    otpSent: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      // OTP Send
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // OTP Verify
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.phoneNumber;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

