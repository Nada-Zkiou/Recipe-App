<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | This determines what cross-origin operations may execute
    | in web browsers. Adjust these settings according to your frontend setup.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'graphql'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:3000'], // Change to match your frontend domain

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // Required if you're using credentials: 'include' in Apollo
];
