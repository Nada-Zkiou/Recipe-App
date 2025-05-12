import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import chefImage from './assets/chef.png';

// GraphQL Query to get all recipes
const GET_RECIPES_QUERY = gql`
  query GetRecipes {
    getRecipes {
      id
      title
      ingredients
      steps
      tags
      image_path
      isFavorited
      averageRating
      userRating
      user {
        id
        name
      }
    }
  }
`;

// Mutation to toggle favorite
const TOGGLE_FAVORITE_MUTATION = gql`
  mutation ToggleFavorite($recipeId: ID!) {
    toggleFavorite(recipeId: $recipeId) {
      id
      isFavorited
    }
  }
`;

// Mutation to rate a recipe
const RATE_RECIPE_MUTATION = gql`
  mutation RateRecipe($recipeId: ID!, $rating: Int!) {
    rateRecipe(recipeId: $recipeId, rating: $rating) {
      id
      userRating
      averageRating
    }
  }
`;

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const RecipeList = () => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_RECIPES_QUERY);
  
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_MUTATION, {
    optimisticResponse: (variables) => {
      return {
        __typename: 'Mutation',
        toggleFavorite: {
          __typename: 'Recipe',
          id: variables.recipeId,
          isFavorited: !data.getRecipes.find((recipe) => recipe.id === variables.recipeId).isFavorited,
        },
      };
    },
    update: (cache, { data: { toggleFavorite } }) => {
      const existingRecipes = cache.readQuery({ query: GET_RECIPES_QUERY });
      const updatedRecipes = existingRecipes.getRecipes.map((recipe) =>
        recipe.id === toggleFavorite.id ? toggleFavorite : recipe
      );
      cache.writeQuery({
        query: GET_RECIPES_QUERY,
        data: { getRecipes: updatedRecipes },
      });
    },
  });

  const [rateRecipe] = useMutation(RATE_RECIPE_MUTATION, {
    optimisticResponse: (variables) => {
      return {
        __typename: 'Mutation',
        rateRecipe: {
          __typename: 'Recipe',
          id: variables.recipeId,
          userRating: variables.rating,
          averageRating: data.getRecipes.find((recipe) => recipe.id === variables.recipeId).averageRating,
        },
      };
    },
    update: (cache, { data: { rateRecipe } }) => {
      const existingRecipes = cache.readQuery({ query: GET_RECIPES_QUERY });
      const updatedRecipes = existingRecipes.getRecipes.map((recipe) =>
        recipe.id === rateRecipe.id ? rateRecipe : recipe
      );
      cache.writeQuery({
        query: GET_RECIPES_QUERY,
        data: { getRecipes: updatedRecipes },
      });
    },
  });

  if (loading) {
    return <p className="text-center mt-8 text-lg text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500 text-lg">Error loading recipes. Please try again later.</p>;
  }

  const recipes = data.getRecipes;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="ml-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 mb-12">
          <div className="space-y-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800">
              Cook Like a Pro with Our <span className="text-orange-500">Easy</span> and <span className="text-orange-500">Tasty</span> Recipes
            </h2>
            <p className="text-gray-600 text-2xl">
              From quick and easy meals to gourmet delights, we have something for every taste and occasion.
            </p>
            <button
              onClick={() => navigate('/recipes')}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition duration-300"
            >
              Explore All Recipes
            </button>
          </div>
          <div>
            <img src={chefImage} alt="Chef Cooking" className="w-100 h-100 px-10" />
          </div>
        </section>

        {/* Recipes Section */}
        <section>
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Discover other users recipies</h3>

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white py-6 rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
                >
                  <img
                    src={`${baseUrl}/storage/${recipe.image_path}`}
                    alt={`Image for ${recipe.title}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h4 className="text-xl font-semibold mb-2 text-gray-800">{recipe.title}</h4>

                    {/* Author & Details Button */}
                    <div className="flex items-center justify-between mb-3">
                      <p
                        className="text-sm text-orange-600 hover:underline cursor-pointer"
                        onClick={() => navigate(`/user-recipes/${recipe.user.id}`)}
                      >
                        By {recipe.user.name}
                      </p>
                      <button
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-md"
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                      >
                        View Details
                      </button>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={async () => {
                        try {
                          await toggleFavorite({ variables: { recipeId: recipe.id } });
                        } catch (err) {
                          console.error("Failed to toggle favorite", err);
                        }
                      }}
                      className={`mb-2 text-sm px-4 py-1 rounded-full border ${
                        recipe.isFavorited
                          ? 'bg-red-100 text-red-600 border-red-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {recipe.isFavorited ? '❤️ Favorited' : '🤍 Favorite'}
                    </button>

                    {/* Rating Stars */}
                    <div className="mt-2 flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={async () => {
                            try {
                              await rateRecipe({
                                variables: { recipeId: recipe.id, rating: star }
                              });
                            } catch (err) {
                              console.error("Failed to rate", err);
                            }
                          }}
                          className={`cursor-pointer text-xl ${
                            recipe.userRating >= star ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Average Rating */}
                    <p className="text-sm text-gray-500 mt-1">
                      Average Rating: {recipe.averageRating ?? 'No ratings yet'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center mt-8 text-gray-500">No recipes found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default RecipeList;
