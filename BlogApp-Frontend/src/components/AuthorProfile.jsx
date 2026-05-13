import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";

import {
  pageWrapper,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
  divider,
} from "../styles/common";

function AuthorProfile() {

  const currentUser = useAuth((state) => state.currentUser);

  const logout = useAuth((state) => state.logout);

  const navigate = useNavigate();

  const onLogout = async () => {

    await logout();

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (

    <div className={pageWrapper}>

      {/* PROFILE SECTION */}
      <div className="flex justify-between items-center px-6 py-4">

        {/* PROFILE IMAGE + NAME */}
        <div className="flex items-center gap-3">

          <img
            src={
              currentUser?.profileImageUrl ||
              "https://via.placeholder.com/80"
            }
            alt="profile"
            className="w-16 h-16 rounded-full object-cover border"
          />

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

      <div className={divider}></div>

      {/* Author Navigation */}
      <div className={navLinksClass}>

        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Write Article
        </NavLink>

      </div>

      <div className={divider}></div>

      {/* Nested route content */}
      <Outlet />

    </div>
  );
}

export default AuthorProfile;