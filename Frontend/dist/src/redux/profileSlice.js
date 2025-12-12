// src/redux/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiList from "../../api.json";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// -----------------------------------------------------------------------------
// 1️⃣ Update Profile API (PUT)
// -----------------------------------------------------------------------------
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");
      const endpoint = `${API_URL}${apiList.profile.complete_profile}`;

      const { data } = await axios.put(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });

      return data; // success response
    } catch (err) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue("Failed to update profile");
    }
  }
);

// -----------------------------------------------------------------------------
// SLICE
// -----------------------------------------------------------------------------
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    sidebarOpen: false,
  },

  reducers: {
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { openSidebar, closeSidebar } = profileSlice.actions;
export default profileSlice.reducer;
