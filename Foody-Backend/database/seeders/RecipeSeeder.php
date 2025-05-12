<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Recipe;

class RecipeSeeder extends Seeder
{
    public function run()
    {
        // Optional: clear old records
        DB::table('recipes')->truncate();

        // Add recipes with image path relative to public/storage
        Recipe::create([
            'user_id' => 1,
            'title' => 'Spaghetti Bolognese',
            'ingredients' => 'Spaghetti, Ground Beef, Tomato Sauce, Onion, Garlic, Olive Oil, Salt, Pepper',
            'steps' => '1. Cook the spaghetti. 2. Brown the beef. 3. Make the sauce. 4. Combine.',
            'tags' => ['Italian', 'Pasta', 'Main Course'],
            'image_path' => 'images/spaghettip.jpeg',
        ]);

        Recipe::create([
            'user_id' => 1,
            'title' => 'Chicken Curry',
            'ingredients' => 'Chicken, Curry Powder, Coconut Milk, Onion, Garlic, Ginger, Salt, Pepper',
            'steps' => '1. Brown the chicken. 2. Make the curry sauce. 3. Simmer and serve.',
            'tags' => ['Indian', 'Chicken', 'Spicy'],
            'image_path' => 'images/chickencurry.jpeg',
        ]);

        Recipe::create([
            'user_id' => 1,
            'title' => 'Vegetable Stir Fry',
            'ingredients' => 'Broccoli, Carrots, Bell Peppers, Soy Sauce, Garlic, Sesame Oil',
            'steps' => '1. Chop vegetables. 2. Stir-fry in sesame oil. 3. Add soy sauce and cook briefly.',
            'tags' => ['Asian', 'Vegetarian', 'Quick'],
            'image_path' => 'images/veggiestirfry.jpeg',
        ]);

        Recipe::create([
            'user_id' => 1,
            'title' => 'Beef Tacos',
            'ingredients' => 'Ground Beef, Taco Shells, Lettuce, Tomato, Cheese, Sour Cream, Taco Seasoning',
            'steps' => '1. Cook beef with seasoning. 2. Fill taco shells with beef and toppings.',
            'tags' => ['Mexican', 'Beef', 'Fast Food'],
            'image_path' => 'images/beeftacos.jpeg',
        ]);

        Recipe::create([
            'user_id' => 1,
            'title' => 'Classic Pancakes',
            'ingredients' => 'Flour, Eggs, Milk, Baking Powder, Sugar, Butter, Salt',
            'steps' => '1. Mix dry ingredients. 2. Add wet ingredients. 3. Cook on griddle until golden.',
            'tags' => ['Breakfast', 'Sweet', 'Comfort Food'],
            'image_path' => 'images/pancakes.jpeg',
        ]);

        Recipe::create([
            'user_id' => 1,
            'title' => 'Caesar Salad',
            'ingredients' => 'Romaine Lettuce, Croutons, Parmesan, Caesar Dressing, Lemon Juice, Garlic',
            'steps' => '1. Chop lettuce. 2. Toss with dressing and toppings.',
            'tags' => ['Salad', 'Healthy', 'Appetizer'],
            'image_path' => 'images/caesarsalad.jpeg',
        ]);
    }
}
