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
        $user = tap(User::where('id', $user_id))->update($user_data);
        return response()->json($user);
    }

    public function updatePassword($user_data){
        $user = User::where('phonenumber', $user_data->phonenumber)->get()->first();
        if (!$user){
            return response()->json(["message" => "Số điện thoại chưa được đăng ký tài khoản."]);
        }
        if(\Hash::check($user_data->password, $user->password)) {
            $newPassword = \Hash::make($user_data->newPassword);
            $user->password = $newPassword;
            $user->save();
        } else
            return response()->json(["message" => "Mật khẩu không đúng."]);
        
        return response()->json(["message" => "Đổi mật khẩu thành công.", "data" => $user]);
    }
}