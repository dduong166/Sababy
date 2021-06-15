<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
// Route::get('/user', function (Request $request) {
//     return $request->user();
// });
Route::prefix('user')->group(function () {
    Route::post('/login', 'UserController@login')->name('login');
    Route::post('/register', 'UserController@register');
    Route::put('/password', 'UserController@updatePassword');
    Route::get('/isLoggedIn', 'UserController@getAuthenticatedUser');
    Route::middleware('auth:api')->put('/{user_id}', 'UserController@update');
});

Route::group(['prefix'=> 'admin', 'middleware' => ['auth:api', 'is-admin']], function () {
    Route::get('/users', 'UserController@index');
    Route::get('/count_user', 'UserController@CountUserByDate');
    Route::get('/count_product', 'ProductController@CountProductByDate');
    Route::get('/selling', 'ProductController@adminSellingProducts');
    Route::get('/sold', 'ProductController@adminSoldProducts');
    Route::delete('/user/{user_id}', 'UserController@delete');
});

Route::prefix('category')->group(function () {
    Route::get('/', 'CategoryController@index');
});
Route::prefix('product')->group(function () {
    Route::get('/', 'ProductController@index');
    Route::get('/cities', 'ProductController@getProductCity');  
    Route::get('/pagination', 'ProductController@getProductsPagination');   
    Route::middleware('auth:api')->get('/selling', 'ProductController@sellingProducts');
    Route::middleware('auth:api')->get('/sold', 'ProductController@soldProducts');
    Route::get('/category/{category_id}', 'ProductController@getProductByCategoryID');
    Route::post('/filter', 'ProductController@filter');
    Route::middleware('auth:api')->post('/', 'ProductController@store');
    Route::get('/{product_id}', 'ProductController@getProductByID');
    Route::middleware('auth:api')->put('/{product_id}', 'ProductController@update');
    Route::middleware('auth:api')->delete('/{product_id}', 'ProductController@destroy');
});

Route::prefix('question')->group(function () {
    Route::middleware('auth:api')->post('/', 'QuestionController@store');
});
Route::prefix('answer')->group(function () {
    Route::middleware('auth:api')->post('/', 'AnswerController@store');
});
