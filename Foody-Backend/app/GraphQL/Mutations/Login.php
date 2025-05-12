<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;

final readonly class Login
{
    public function __invoke(mixed $_, array $args)
    {
        try {
            // Validate input
            if (!isset($args['input']['email']) || !isset($args['input']['password'])) {
                throw new \Exception('Email and password are required');
            }

            $credentials = [
                'email' => $args['input']['email'],
                'password' => $args['input']['password'],
            ];

            // Attempt authentication
            if (!Auth::attempt($credentials)) {
                Log::error('Login failed for: ' . $args['input']['email']);
                throw new \Exception('Invalid credentials');
            }

            $user = Auth::user();
            
            if (!$user) {
                throw new \Exception('User not found');
            }

            // Revoke existing tokens
            $user->tokens()->delete();
            
            // Create new token
            $token = $user->createToken('auth-token')->plainTextToken;

            return [
                'user' => $user,
                'token' => $token,
            ];

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            throw new \Exception('Authentication failed. Please try again.');
        }
    }
}