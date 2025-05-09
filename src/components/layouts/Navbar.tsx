import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const { user } = state;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-white font-bold text-xl">
                DBT Journey
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/dashboard" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/modules" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  DBT Modules
                </Link>
                <Link to="/progress" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  My Progress
                </Link>
                <Link to="/achievements" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  Achievements
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-white flex items-center space-x-2">
                    <span className="text-xs font-medium">Points</span>
                    <span className="bg-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                      {user.points}
                    </span>
                  </div>
                  <div className="text-white flex items-center space-x-2">
                    <span className="text-xs font-medium">Level</span>
                    <span className="bg-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                      {user.level}
                    </span>
                  </div>
                  <div className="text-white text-sm font-medium">
                    {user.name || user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/login" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/dashboard" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
            Dashboard
          </Link>
          <Link to="/modules" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
            DBT Modules
          </Link>
          <Link to="/progress" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
            My Progress
          </Link>
          <Link to="/achievements" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
            Achievements
          </Link>
          {user ? (
            <>
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-white flex items-center space-x-2">
                  <span className="text-xs font-medium">Points</span>
                  <span className="bg-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                    {user.points}
                  </span>
                </div>
                <div className="text-white flex items-center space-x-2">
                  <span className="text-xs font-medium">Level</span>
                  <span className="bg-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                    {user.level}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
                Login
              </Link>
              <Link to="/register" className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
