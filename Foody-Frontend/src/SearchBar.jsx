import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    onSearch(searchTerm);
    navigate("/searchresults");
  };

  return (
    <div className="flex items-center w-full">
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-l-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button
        onClick={handleSearch}
        className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition-colors"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
