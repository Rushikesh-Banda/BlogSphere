import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
} from "../styles/common";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://blogsphere-mv7l.onrender.com";

function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setError(null);
      await axios.put(`${BASE_URL}/common-api/forgot-password`, data);
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Forgot Password</h2>
        {error && <p className={errorClass}>{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input type="email" {...register("email", { required: true })} placeholder="you@example.com" className={inputClass} />
          </div>
          <div className={formGroup}>
            <label className={labelClass}>New Password</label>
            <input type="password" {...register("newPassword", { required: true })} placeholder="••••••••" className={inputClass} />
          </div>
          <button type="submit" className={submitBtn}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
