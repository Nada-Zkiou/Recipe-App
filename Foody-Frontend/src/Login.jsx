import React, { useState, useContext } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const client = useApolloClient();
 // Get auth context

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onError: (err) => {
      setError(err.message);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data, errors } = await loginMutation({
        variables: { email, password },
      });

      if (errors) {
        console.error('GraphQL Errors:', errors);
        setError(errors[0]?.message || 'Login failed');
        return;
      }

      if (data?.login) {
        const { token, user } = data.login;
        
        // Store authentication data
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user.id);
        
        // Update global auth state
       
        // Reset Apollo cache and navigate
        await client.resetStore();
        navigate('/');
      }
    } catch (err) {
      console.error('Full error object:', err);
      const errorMessage = err?.networkError?.result?.errors?.[0]?.message || 
                          err?.graphQLErrors?.[0]?.message ||
                          err?.message || 
                          'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold m-5 text-black">
        F<span className='text-orange-500'>OO</span>DY
      </h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>
        <p className="mt-4 text-center">
          Want to sign up?{' '}
          <b>
            <a href="/register" className="text-orange-500 hover:underline">
              Register
            </a>
          </b>{' '}
          here
        </p>
      </form>
    </div>
  );
};

export default LoginComponent;