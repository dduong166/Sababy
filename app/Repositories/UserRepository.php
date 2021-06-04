<?php
namespace App\Repositories;

use App\Models\Product;
use App\Models\User;
use App\Models\ProductMedia;
use App\Models\Category;
use App\Models\Question;
use App\Models\Answer;

class UserRepository implements UserRepositoryInterface
{
    /**
     * Get's a User by it's ID
     *
     * @param int
     * @return collection
     */
    public function get($user_id)
    {
        return User::find($user_id);
    }

    /**
     * Get's all Users.
     *
     * @return mixed
     */
    public function all()
    {
        return User::all();
    }

    /**
     * Deletes a User.
     *
     * @param int
     */
    public function delete($user_id)
    {
        $user = User::destroy($user_id);

        return response()->json($user_id);
    }

    /**
     * Updates a User.
     *
     * @param int
     * @param array
     */
    public function update($user_id, array $user_data)
    {
        User::find($user_id)->update($user_data);
    }
}