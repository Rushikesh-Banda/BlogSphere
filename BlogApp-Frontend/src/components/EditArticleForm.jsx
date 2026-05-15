import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  formCard, 
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  articlePageWrapper,
} from "../styles/common";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://blogsphere-mv7l.onrender.com";

function EditArticle() {

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const article = location.state;

  console.log(id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {

    if (!article) return;

    setValue("title", article.title);
    setValue("category", article.category);
    setValue("content", article.content);

  }, [article, setValue]);

  const updateArticle = async (data) => {

    console.log(data);

    data.articleId = article._id;

    try {

      let res = await axios.put(
        `${BASE_URL}/author-api/articles`,
        data,
        { withCredentials: true }
      );

      console.log("res update article", res);

      toast.success("Article updated successfully");

      navigate(`/article/${article._id}`, {
        state: res.data.payload,
      });

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.error || "Failed to update article"
      );
    }
  };

  return (

    <div className={`${articlePageWrapper} ${formCard} mt-10`}>

      <h2 className={formTitle}>
        Edit Article
      </h2>

      <form onSubmit={handleSubmit(updateArticle)}>

        {/* Title */}
        <div className={formGroup}>

          <label className={labelClass}>
            Title
          </label>

          <input
            className={inputClass}
            {...register("title", {
              required: "Title required",
            })}
          />

          {errors.title && (
            <p className={errorClass}>
              {errors.title.message}
            </p>
          )}

        </div>

        {/* Category */}
        <div className={formGroup}>

          <label className={labelClass}>
            Category
          </label>

          <select
            className={inputClass}
            {...register("category", {
              required: "Category required",
            })}
          >

            <option value="">
              Select category
            </option>

            <option value="technology">
              Technology
            </option>

            <option value="programming">
              Programming
            </option>

            <option value="ai">
              AI
            </option>

            <option value="web-development">
              Web Development
            </option>

          </select>

          {errors.category && (
            <p className={errorClass}>
              {errors.category.message}
            </p>
          )}

        </div>

        {/* Content */}
        <div className={formGroup}>

          <label className={labelClass}>
            Content
          </label>

          <textarea
            rows="14"
            className={inputClass}
            {...register("content", {
              required: "Content required",
            })}
          />

          {errors.content && (
            <p className={errorClass}>
              {errors.content.message}
            </p>
          )}

        </div>

        <button className={submitBtn}>
          Update Article
        </button>

      </form>

    </div>
  );
}

export default EditArticle;