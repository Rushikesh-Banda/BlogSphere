import { create } from "zustand";
import axios from "axios";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://blogsphere-mv7l.onrender.com";

export const useAuth = create((set) => ({

  currentUser: null,

  loading: false,

  isAuthenticated: false,

  error: null,

  login: async (userCredWithRole) => {

    const { role, ...userCredObj } = userCredWithRole;

    console.log(role);

    try {

      // set loading true
      set({
        loading: true,
        error: null,
      });

      // make api call
      let res = await axios.post(
        `${BASE_URL}/common-api/login`,
        userCredObj,
        { withCredentials: true }
      );

      console.log("login response:", res.data);

      // update state
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
      });

    } catch (err) {

      console.log(err.response?.data);

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error:
          err.response?.data?.error ||
          "Login failed",
      });
    }
  },

  logout: async () => {

    try {

      // set loading state
      set({
        loading: true,
        error: null,
      });

      // make logout api req
      await axios.get(
        `${BASE_URL}/common-api/logout`,
        { withCredentials: true }
      );

      // update state
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });

    } catch (err) {

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error:
          err.response?.data?.error ||
          "Logout failed",
      });
    }
  },

  // restore login
  checkAuth: async () => {

    try {

      set({
        loading: true,
      });

      const res = await axios.get(
        `${BASE_URL}/common-api/check-auth`,
        { withCredentials: true }
      );

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });

    } catch (err) {

      // If user is not logged in
      if (err.response?.status === 401) {

        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });

        return;
      }

      // other errors
      console.error("Auth check failed:", err);

      set({
        loading: false,
      });
    }
  },

}));