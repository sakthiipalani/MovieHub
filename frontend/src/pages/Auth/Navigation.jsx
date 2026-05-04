import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineLogout,
} from "react-icons/ai";
import { MdLocalMovies, MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <MdLocalMovies className="text-teal-500" size={32} />
            <span className="text-xl font-bold text-white">
              Movie<span className="text-teal-500">Hub</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-teal-500 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="text-gray-300 hover:text-teal-500 transition-colors font-medium"
            >
              Movies
            </Link>
          </div>

          {/* User Section */}
          <div className="relative">
            {userInfo ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-all"
                >
                  {userInfo.image ? (
                    <img
                      src={userInfo.image}
                      alt={userInfo.username}
                      className="w-8 h-8 rounded-full object-cover border border-teal-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {userInfo.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-white font-medium">{userInfo.username}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                    {userInfo.isAdmin && (
                      <Link
                        to="/admin/movies/dashboard"
                        className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-teal-500 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <MdDashboard size={20} />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-teal-500 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <AiOutlineUserAdd size={20} />
                      Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-2 w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-red-500 transition-colors"
                    >
                      <AiOutlineLogout size={20} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
