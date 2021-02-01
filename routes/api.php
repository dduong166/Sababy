<?php

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

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('user')->group(function () {
    Route::post('/login', 'UserController@login')->name('login');
    Route::post('/register', 'UserController@register');
    Route::get('/isLoggedIn', 'UserController@getAuthenticatedUser');
    // Route::get('/test', function () {
    //     return 'Hello World';
    // });
});

Route::prefix('category')->group(function () {
    Route::get('/', 'CategoryController@index');
});

Route::prefix('product')->group(function () {
    Route::get('/', 'ProductController@index');
    Route::get('/{product_id}', 'ProductController@getProductByID');
    Route::get('/category/{category_id}', 'ProductController@getProductByCategoryID');
    Route::get('/comment/{product_id}', 'ProductController@getProductComment');

});

