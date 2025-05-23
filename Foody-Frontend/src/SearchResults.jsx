// SearchResults.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ recipes }) => {

    const navigate = useNavigate();

    
    return (
      <div className="container mx-auto my-8">
      <h1 className="text-4xl font-bold mb-4">Search results</h1>
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white p-4 rounded-md shadow-md">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/storage/${recipe.image_path}`}
                alt={`Image for ${recipe.title}`}
                className="w-full h-40 object-cover mb-4 rounded-md"
                />
              <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
              <p className="text-gray-700">{recipe.ingredients}</p>
              <div className="mt-4">
              {recipe.user && (
                <p className="text-orange-500 cursor-pointer" onClick={() => navigate(`/user-recipes/${recipe.user.id}`)}>
                    Posted by: {recipe.user.name}
                  </p>
                )}
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-md"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-8">No recipes found.</p>
      )}
    </div>
  );
};

export default SearchResults;
