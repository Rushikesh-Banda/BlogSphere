import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  articleBody,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common.js";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://blogsphere-mv7l.onrender.com";

function UserProfile() {

  const logout = useAuth((state) => state.logout);

  const currentUser = useAuth((state) => state.currentUser);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [articles, setArticles] = useState([]);

  useEffect(() => {

    const getArticles = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `${BASE_URL}/user-api/articles`,
          { withCredentials: true }
        );

        setArticles(res.data.payload);

      } catch (err) {

        setError(
          err.response?.data?.error || "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

    getArticles();

  }, []);

  // convert UTC → IST
  const formatDateIST = (date) => {

    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const onLogout = async () => {

    await logout();

    toast.success("Logged out successfully");

    navigate("/login");
  };

  const navigateToArticleByID = (articleObj) => {

    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {

    return (
      <p className={loadingClass}>
        Loading articles...
      </p>
    );
  }

  return (

    <div>

      {error && (
        <p className={errorClass}>
          {error}
        </p>
      )}

      {/* PROFILE SECTION */}
      <div className="flex justify-between items-center px-6 py-4">

        {/* PROFILE IMAGE + NAME */}
        <div className="flex items-center gap-3">

          <div>

            <h2 className="text-xl font-bold">
              {currentUser?.firstName}
            </h2>

            <p className="text-gray-500">
              {currentUser?.email}
            </p>

          </div>

        </div>

        {/* LOGOUT BUTTON */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

      {/* ARTICLES */}
      <h2 className="text-2xl font-bold px-6 py-2">Articles</h2>
      <div className={articleGrid}>

        {articles.map((articleObj) => (

          <div
            className={articleCardClass}
            key={articleObj._id}
          >

            <div className="flex flex-col h-full">

              {/* Top Content */}
              <div>

                <p className={articleTitle}>
                  {articleObj.title}
                </p>

                <p className={articleBody}>
                  {articleObj.content.slice(0, 20)}...
                </p>

                <p className={timestampClass}>
                  {formatDateIST(articleObj.createdAt)}
                </p>

              </div>

              {/* Button at bottom */}
              <button
                className={`${ghostBtn} mt-auto pt-4`}
                onClick={() =>
                  navigateToArticleByID(articleObj)
                }
              >
                Read Article →
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default UserProfile;