// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // login action
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async ({ username, password }) => {
//     const { data } = await axios.post("http://localhost:8000/api/login/", {
//       username,
//       password,
//     });
//     localStorage.setItem("user", JSON.stringify(data.user));
//     localStorage.setItem("token", data.token);
//     return data.user;
//   }
// );
// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: JSON.parse(localStorage.getItem("user")) || null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       localStorage.clear();
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(loginUser.rejected, (state) => {
//         state.loading = false;
//         state.error = "Invalid credentials";
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---------- LOGIN THUNK ----------
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      // Store tokens in localStorage
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", username);

      // Return username to Redux
      return { username };
    } catch (err) {
      if (err.response && err.response.data.non_field_errors) {
        return rejectWithValue(err.response.data.non_field_errors[0]);
      } else if (err.response && err.response.data.detail) {
        return rejectWithValue(err.response.data.detail);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);

// ---------- AUTH SLICE ----------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("username") || null, // NO JSON.parse for plain string
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.username;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid credentials";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
