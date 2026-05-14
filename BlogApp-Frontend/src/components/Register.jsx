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

function Register() {
  const { register, handleSubmit } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);

    // Get role and user data
    let { role, ...userObj } = newUser;

    if (!role) {
      setError("Please select User or Author");
      setLoading(false);
      return;
    }

    const normalizedRole =
      role === "user" ? "USER" : role === "author" ? "AUTHOR" : "USER";

    try {
      // Send registration request
      const endpoint =
        normalizedRole === "USER"
          ? "http://localhost:4000/user-api/users"
          : "http://localhost:4000/author-api/users";

      const resObj = await axios.post(endpoint, {
        ...userObj,
        role: normalizedRole,
      });

      if (resObj.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.log("Registration error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Registration failed";
      setError(errorMessage);
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