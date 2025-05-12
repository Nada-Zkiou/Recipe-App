import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';

// Define the GraphQL query to fetch a single recipe by ID
const GET_RECIPE_DETAILS = gql`
  query GetRecipeDetails($id: ID!) {
    getRecipe(id: $id) {
      id
      title
      ingredients
      steps
      tags
      image_path
    }
  }
`;

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Component to render tags
const TagsList = ({ tags }) => (
  <div className="flex flex-wrap gap-4"> {/* Increased gap for horizontal spacing between tags */}
    {tags.map((tag, index) => (
      <span key={index} className="bg-orange-500 text-white px-3 py-1 rounded-full">
        {tag}
      </span>
    ))}
  </div>
);

// Component to render the recipe image
const RecipeImage = ({ imagePath, title, className }) => {
  if (!imagePath) return <div className="text-center text-gray-500">No image available</div>;

  return (
    <div className="mt-4"> {/* Added margin-top for spacing */}
      <img
        src={`${baseUrl}/storage/${imagePath}`}
        alt={`Image for ${title}`}
        className={`max-w-full rounded-md ${className}`} // Apply the passed className
      />
    </div>
  );
};

const RecipeDetails = () => {
  const { id } = useParams();
  // Use the useQuery hook to fetch recipe details
  const { loading, error, data } = useQuery(GET_RECIPE_DETAILS, {
    variables: { id },
  });

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error: {error.message}</p>;

  const recipe = data.getRecipe;

  return (
    <>
      <div className="w-[90%] max-w-5xl mx-auto mt-8 p-4 bg-white">
        {/* Image */}
        <RecipeImage
          imagePath={recipe.image_path}
          title={recipe.title}
          className="w-[55vw] h-auto mb-4" // 55% of the viewport width
        />

        {/* Title */}
        <h1 className="text-4xl font-bold mb-8">{recipe.title}</h1> {/* Increased title font size */}

        {/* Ingredients */}
        <h2 className="text-2xl font-semibold mb-3">Ingredients:</h2> {/* Increased ingredient title font size */}
        <ul className="list-disc list-inside mb-6 text-gray-700 text-lg">
          {recipe.ingredients.split(',').map((item, index) => (
            <li key={index}>{item.trim()}</li>
          ))}
        </ul>

        {/* Steps */}
        <h2 className="text-2xl font-semibold mb-3">Steps:</h2> {/* Increased steps title font size */}
        <ol className="list-decimal list-inside mb-6 text-gray-700 text-lg">
          {recipe.steps.split(/[0-9]+\.\s*/).filter(Boolean).map((step, index) => (
            <li key={index}>{step.trim()}</li>
          ))}
        </ol>

        {/* Tags */}
        <TagsList tags={recipe.tags} />
      </div>
    </>
  );
};

export default RecipeDetails;
