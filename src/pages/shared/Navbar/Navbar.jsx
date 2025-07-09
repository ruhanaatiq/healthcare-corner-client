import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth'; // ✅ correct
import { FaShoppingCart } from 'react-icons/fa'; // Cart icon
import logo from '../../../assets/logo.png'; // Path to your logo image

const Navbar = () => {
  const { user, logout } = useAuth(); // Get user info and logout function from context
  const [isDropdownOpen, setDropdownOpen] = useState(false); // To toggle the dropdown menu

  const handleDropdownToggle = () => setDropdownOpen(!isDropdownOpen); // Toggle dropdown state

  return (
    <nav className="bg-red-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Website Name */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-8 h-8" /> {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">E-Pharma</Link> {/* Website Name */}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:underline">Home</Link>
          <Link to="/shop" className="text-white hover:underline">Shop</Link>

          {/* Cart Icon */}
          <Link to="/cart" className="text-white">
            <FaShoppingCart size={24} />
          </Link>

          {/* Language Dropdown */}
          <select className="bg-white text-gray-800 px-4 py-2 rounded">
            <option value="en">English</option>
            <option value="fr">French</option>
            {/* Add more languages here */}
          </select>

          {/* Conditional rendering for Join Us / Profile Section */}
          {user ? (
            <div className="relative">
              <button onClick={handleDropdownToggle} className="text-white flex items-center space-x-2">
                <img src={user?.profilePicture} alt="Profile" className="w-8 h-8 rounded-full" /> {/* Profile picture */}
              </button>

              {/* Dropdown Menu for Profile */}
              {isDropdownOpen && (
                <div className="absolute right-0 bg-white shadow-lg rounded-lg w-48 mt-2">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Update Profile</Link>
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Dashboard</Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth/register" className="text-white hover:underline">Join Us</Link> 
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
