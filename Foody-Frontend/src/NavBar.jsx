import React, { useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { IoLogOutOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { RiFileListLine } from "react-icons/ri";
import { AiFillHeart } from "react-icons/ai";
import SearchBar from './SearchBar';

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const NavBar = ({ onSearch }) => {
  const navigate = useNavigate();

  const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
    context: {
      headers: {
        Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
      },
    },
  });

  const handleLogout = async () => {
    try {
      const { data } = await logoutMutation();
      const logoutSuccess = data?.logout;

      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      
      navigate('/login');
      
      if (!logoutSuccess) {
        console.error('Server-side logout verification failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local storage and update state if mutation fails
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');

      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Brand */}
      <Link
        to="/"
        className="text-3xl font-bold text-gray-900 tracking-tight hover:text-orange-500 transition-colors"
      >
        F<span className="text-orange-500">OO</span>Dy
      </Link>

      {/* SearchBar */}
      <div className="flex-grow mx-6 max-w-xl">
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-xl">
      
          <>
            {/* My Recipes */}
            <Link
              to="/userrecipes"
              title="My Recipes"
              className="text-xl text-gray-700 hover:text-orange-500 transition-colors"
            >
              <RiFileListLine />
            </Link>

            {/* Favorites ❤️ */}
            <Link
              to="/favorites"
              title="My Favorites"
              className="text-xl text-gray-700 hover:text-orange-500 transition-colors"
            >
              <AiFillHeart />
            </Link>

            {/* Add Recipe */}
            <Link
              to="/recipeform"
              title="Add Recipe"
              className="text-xl text-gray-700 hover:text-orange-500 transition-colors"
            >
              <IoMdAdd />
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="text-xl text-gray-700 hover:text-orange-500 transition-colors"
            >
              <IoLogOutOutline />
            </button>
          </>
        
      </div>
    </nav>
  );
};

export default NavBar;