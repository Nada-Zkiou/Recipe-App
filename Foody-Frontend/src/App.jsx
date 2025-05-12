import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import NavBar from './NavBar';
import LoginComponent from './Login';
import RegisterComponent from './Register';
import RecipeForm from './RecipeForm';
import RecipeDetails from './RecipeDetails';
import RecipeList from './RecipeList';
import SearchRecipeForm from './SearchRecipe';
import SearchResults from './SearchResults';
import EditRecipeForm from './EditRecipeForm';
import UserRecipeList from './UserRecipeList';
import UserProfile from './UserProfile';

import { SEARCH_RECIPE } from './SearchQuery';
import { GET_ALL_RECIPES_QUERY } from './GetAllRecipesQuery';

// Apollo Client setup
const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
  headers: {
    Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
  }
});

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const loggedIn = Boolean(localStorage.getItem('token')); // Check if user is logged in

  const handleSearch = async (title) => {
    try {
      const query = title ? SEARCH_RECIPE : GET_ALL_RECIPES_QUERY;
      const { data } = await client.query({
        query,
        variables: { title },
      });

      setSearchResults(data?.searchRecipe || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
     <ApolloProvider client={client}>
      <Router>
        {/* Only render NavBar if the user is logged in */}
        {loggedIn && <NavBar onSearch={handleSearch} />}

        <Routes>
          {/* Public route */}
          <Route path="/" element={<RecipeList />} />

          {/* Routes for logged in users */}
          {loggedIn ? (
            <>
              <Route path="/recipeform" element={<RecipeForm />} />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
              <Route path="/searchrecipe" element={<SearchRecipeForm />} />
              <Route path="/searchresults" element={<SearchResults recipes={searchResults} />} />
              <Route path="/user-recipes/:id" element={<UserProfile />} />
              <Route path="/userrecipes" element={<UserRecipeList />} />
              <Route path="/edit-recipe/:id" element={<EditRecipeForm />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/register" element={<RegisterComponent />} />
              {/* Redirect to login if accessing an invalid route */}
              <Route path="/*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;

