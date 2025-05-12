<?php

namespace App\GraphQL\Resolvers;

use App\Models\Recipe;
use App\Models\Rating;
use Illuminate\Support\Facades\Auth;

class RecipeResolver
{
    public function isFavorited($root)
    {
        $user = Auth::user();
        if (!$user) return false;

        return $user->favorites()->where('recipe_id', $root->id)->exists();
    }

    public function averageRating($root)
    {
        return round($root->ratings()->avg('rating'), 1);
    }

    public function userRating($root)
    {
        $user = Auth::user();
        if (!$user) return null;

        $rating = $root->ratings()->where('user_id', $user->id)->first();
        return $rating ? $rating->rating : null;
    }

    public function toggleFavorite($_, array $args)
    {
        $user = Auth::user();
        $recipeId = $args['recipeId'];

        if ($user->favorites()->where('recipe_id', $recipeId)->exists()) {
            $user->favorites()->detach($recipeId);
            return false;
        } else {
            $user->favorites()->attach($recipeId);
            return true;
        }
    }

    public function rateRecipe($_, array $args)
    {
        $user = Auth::user();
        $recipeId = $args['recipeId'];
        $rating = $args['rating'];

        if ($rating < 1 || $rating > 5) {
            throw new \Exception('Rating must be between 1 and 5.');
        }

        Rating::updateOrCreate(
            ['user_id' => $user->id, 'recipe_id' => $recipeId],
            ['rating' => $rating]
        );

        return true;
    }
}
