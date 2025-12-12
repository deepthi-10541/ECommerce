import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiList from "../../api.json";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// ------------------------ API CALL ------------------------
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const url = `${API_URL}${apiList.products.categories}`;
      const { data } = await axios.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch categories"
      );
    }
  }
);

// ------------------------ SLICE ------------------------
const categoriesSlice = createSlice({
  name: "categories",

  initialState: {
    list: [],
    loading: false,
    error: null,

    // UI States
    selectedCategory: null,
    subcategories: [],
    selectedSubcategory: null,
    products: [],
  },

  reducers: {
    // ------------------------ SELECT CATEGORY ------------------------
    selectCategory: (state, action) => {
      const categoryId = action.payload;

      // CASE 1: USER CLICKED **ALL** (id = 0)
      if (categoryId === 0) {
        state.selectedCategory = { id: 0, name: "All" };

        state.subcategories = state.list
          .filter((cat) => cat.id !== 0)
          .flatMap((cat) => cat.subcategories || []);

        state.selectedSubcategory = null;
        state.products = [];
        return;
      }

      // CASE 2: SPECIFIC CATEGORY
      const category = state.list.find((c) => c.id === categoryId);

      state.selectedCategory = category;
      state.subcategories = category?.subcategories || [];
      state.selectedSubcategory = null;
      state.products = [];
    },

    // ------------------------ SELECT SUBCATEGORY ------------------------
    selectSubcategory: (state, action) => {
      const subcatId = action.payload;

      const subcategory = state.subcategories.find(
        (s) => s.id === subcatId
      );

      state.selectedSubcategory = subcategory;
      state.products = subcategory?.products || [];
    },

    // ------------------------ GO BACK (FROM PRODUCTS TO SUBCATEGORIES) ------------------------
    goBack: (state) => {
      state.selectedSubcategory = null;
      state.products = [];
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { selectCategory, selectSubcategory, goBack } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
