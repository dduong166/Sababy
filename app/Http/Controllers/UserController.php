<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Repositories\ProductRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use App\Models\Product;
use App\Models\User;
use App\Models\ProductMedia;
use App\Models\Category;
use App\Models\Question;
use App\Models\Answer;

use Illuminate\Http\Request;
use JWTAuth;
use JWTAuthException;
use Validator;
use Carbon\Carbon;   

class UserController extends Controller
{
    protected $user;
    protected $product;

    public function __construct(UserRepositoryInterface $user, ProductRepositoryInterface $product)
    {
        $this->user = $user;
        $this->product = $product;
    }

    public function index()
    {
        $users = User::all();
        $users = $users->each(function($item, $key){
            $item->key = $item->id;
            $item->created_at_date = Carbon::parse($item->created_at)->toDateString();
        });
        $users = $users->sortByDesc('created_at')->values();
        return response()->json($users);
    }

    //Check if user is logged in? 
    public function getAuthenticatedUser()
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            // return response()->json(['token_expired'], $e->getStatusCode());
            JWTAuth::setToken(JWTAuth::refresh());
            $user = JWTAuth::authenticate();
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }
        // dd(Auth::user()->id);

        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }

    private function getToken($email, $password)
    {
        $token = null;
        try {
            if (!$token = JWTAuth::attempt(['email' => $email, 'password' => $password])) {
                return response()->json([
                    'response' => 'error',
                    'message' => 'Password or email is invalid',
                    'token' => $token
                ]);
            }
        } catch (JWTAuthException $e) {
            return response()->json([
                'response' => 'error',
                'message' => 'Cannot create token',
            ]);
        }
        return $token;
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|unique:users',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $payload = [
            'password' => \Hash::make($request->password),
            'email' => $request->email,
            'name' => $request->name,
            'auth_token' => ''
        ];

        $user = new User($payload);
        if ($user->save()) {

            $token = self::getToken($request->email, $request->password);
            if (!is_string($token))  return response()->json(['success' => false, 'data' => 'Token generation failed'], 201);

            $user = User::where('email', $request->email)->get()->first();

            $user->auth_token = $token;
            $user->save();
            $response = ['success' => true, 'auth_token' => $token, 'username' => $user->name];
        } else
            $response = ['success' => false, 'data' => 'Register Failed'];

        return response()->json($response, 201);
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->get()->first();
        if ($user && \Hash::check($request->password, $user->password)) {
            $token = self::getToken($request->email, $request->password);
            $user->auth_token = $token;
            $user->save();
            $response = ['success' => true, 'user' => $user];
        } else
            $response = ['success' => false, 'data' => 'Login fail'];

        return response()->json($response, 201);
    }

    public function CountUserByDate(){
        $userByDate = DB::table('users')
                ->select(DB::raw("COUNT(*) `người dùng`, DATE_FORMAT(created_at, '%Y-%m-%d') date"))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        $countAll = User::all()->count();
        return response()->json(['userByDate' => $userByDate, 'countAll' => $countAll]);
    }

    public function delete($user_id){
        $user = $this->user->delete($user_id);
        $products = Product::where('owner_id', $user_id)->pluck('id');
        foreach ($products as $key => $product) {
            $this->product->delete($product);
        }

        return response()->json($user_id);
    }

    public function update($user_id, Request $request){
        $input = $request->all();
        $user = $this->user->update($user_id, $input);
        
        return response()->json($user->original->first());
    }


}
