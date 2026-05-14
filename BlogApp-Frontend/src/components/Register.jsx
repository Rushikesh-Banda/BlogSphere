import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  divider,
  loadingClass,
} from "../styles/common";
import { NavLink } from "react-router";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function Register() {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const { register, handleSubmit } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {

    setLoading(true);
    setError(null);

    const formData = new FormData();

    //get user object
    let { role, profilePic, ...userObj } = newUser;

    if (!role) {
      setError("Please select User or Author");
      setLoading(false);
      return;
    }

    // add all text fields to FormData object
    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });

    const normalizedRole = role === "user" ? "USER" : role === "author" ? "AUTHOR" : "USER";
    formData.append("role", normalizedRole);

    // add profilePic only when a file was selected
    if (profilePic && profilePic.length > 0) {
      formData.append("profilePic", profilePic[0]);
    }

    try {

      if (role === "user") {

        let resObj = await axios.post(
          "http://localhost:4000/user-api/users",
          formData
        );

        if (resObj.status === 201) {
          navigate("/login");
        }
      }

      if (role === "author") {

        let resObj = await axios.post(
          "http://localhost:4000/author-api/users",
          formData
        );

        console.log("res obj is ", resObj);

        if (resObj.status === 201) {
          navigate("/login");
        }
      }

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading === true) {
    return <p className={loadingClass}></p>;
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>

        <h2 className={formTitle}>Create an Account</h2>

        {error && <p className={errorClass}>{error}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>

          <div className="mb-5">
            <p className={labelClass}>Register as</p>

            <div className="flex gap-6 mt-1">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  id="user"
                  value="user"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">
                  User
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  id="author"
                  value="author"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">
                  Author
                </span>
              </label>

            </div>
          </div>

          <div className={divider} />

          <div className="sm:flex gap-4 mb-4">

            <div className="flex-1">
              <label className={labelClass}>First Name</label>

              <input
                type="text"
                {...register("firstName")}
                placeholder="First name"
                className={inputClass}
              />
            </div>

            <div className="flex-1">
              <label className={labelClass}>Last Name</label>

              <input
                type="text"
                {...register("lastName")}
                placeholder="Last name"
                className={inputClass}
              />
            </div>

          </div>

          <div className={formGroup}>
            <label className={labelClass}>Email</label>

            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Password</label>

            <input
              type="password"
              {...register("password")}
              placeholder="Min. 8 characters"
              className={inputClass}
            />
          </div>

          <div className={formGroup}>

            <label className={labelClass}>Profile Image URL</label>

            <input
              type="file"
              accept="image/png, image/jpeg"
              {...register("profilePic")}
              onChange={(e) => {

                //get image file
                const file = e.target.files[0];

                // validation for image format
                if (file) {

                  if (!["image/jpeg", "image/png"].includes(file.type)) {
                    setError("Only JPG or PNG allowed");
                    return;
                  }

                  //validation for file size
                  if (file.size > 2 * 1024 * 1024) {
                    setError("File size must be less than 2MB");
                    return;
                  }

                  //Converts file → temporary browser URL(create preview URL)
                  const previewUrl = URL.createObjectURL(file);

                  setPreview(previewUrl);

                  setError(null);
                }

              }}
            />

            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              </div>
            )}

          </div>

          <button type="submit" className={submitBtn}>
            Create Account
          </button>

        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}

          <NavLink
            to="/login"
            className="text-violet-600 hover:text-violet-500 font-medium"
          >
            Sign in
          </NavLink>

        </p>

      </div>
    </div>
  );
}

export default Register;