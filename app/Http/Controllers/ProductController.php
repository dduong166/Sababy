<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

use App\Models\Product;
use App\Http\Controllers\CategoryController;
use App\Models\ProductMedia;
use App\Models\Category;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProductController extends Controller
{
    protected $CategoryController;

    public function __construct(CategoryController $CategoryController)
    {
        // header('Access-Control-Allow-Origin: *'); 
        // dd(123);
        $this->CategoryController = $CategoryController;
    }



    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (JWTAuth::getToken()) {
            $auth = JWTAuth::parseToken()->check();
        } else {
            $auth = false;
        }

        $products = Product::where('sold', 0)->get();
        $products = $products->load('productMedias');
        if ($auth) {
            $user = JWTAuth::parseToken()->authenticate();
            $products = $products->load(['bookmarks' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }]);
        }
        return response()->json($products);
    }

    public function sellingProducts(){
        if (JWTAuth::getToken()) {
            $auth = JWTAuth::parseToken()->check();
        } else {
            $auth = false;
        }
        if ($auth) {
            $user = JWTAuth::parseToken()->authenticate();
            $products = Product::where('owner_id', $user->id)->where('sold', 0)->get();
            $products->makeVisible(['location']);
            $products = $products->load('productMedias');            
            $products = $products->load(['bookmarks' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }]);
        }else{
            return response()->json([
                'message' => "Not authenticated"
            ]);
        }
        return response()->json($products);
    }

    public function soldProducts(){
        if (JWTAuth::getToken()) {
            $auth = JWTAuth::parseToken()->check();
        } else {
            $auth = false;
        }
        if ($auth) {
            $user = JWTAuth::parseToken()->authenticate();
            $products = Product::where('owner_id', $user->id)->where('sold', 1)->get();
            $products->makeVisible(['location']);
            $products = $products->load('productMedias');
            $products = $products->load(['bookmarks' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }]);
        }else{
            return response()->json([
                'message' => "Not authenticated"
            ]);
        }
        return response()->json($products);
    }

    public function getProductCity() {
        $cities = Product::groupBy('city')->pluck('city')->sortBy('city');
        return response()->json($cities);
    }

    public function getProductByID($product_id) //product detail
    {
        //get product
        $product = Product::where('id', $product_id)->first();
        //get category
        $product = $product->load(['owner', 'category', 'productMedias', 'questions.asker:id,name', 'questions.answers.answerer:id,name', 'questions' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }, 'questions.answers' => function ($query) {
            $query->orderBy('created_at', 'asc');
        }]);
        if ($product->category->parent_category_id) {
            $parent_category = Category::where('id', $product->category->parent_category_id)->get();
            $product->parent_category = $parent_category;
        }
        // dd(gettype($product->questions->answers));
        return response()->json($product);
    }

    public function filter(Request $request)
    {
        //filter
        $products = Product::query();
        if ($request->has('product_name')) {
            $products->where('product_name', 'LIKE', '%' . $request->product_name . '%');
        }
        if ($request->has('city')) {
            $products->where('city', 'LIKE', '%' . $request->city . '%');
        }
        if ($request->has('price')) {
            $products->whereBetween('price', $request->price);
        }
        $products = $products->get();
        if ($request->has('location') && $products->count()) {
            $locations = [];
            foreach ($products as $product) {
                array_push($locations, $product->location);
            }
            $locations = join("|", $locations);
            // $origin = strval($request->lat) . ',' . strval($request->lng);
            $distance = \GoogleMaps::load('distancematrix')
                ->setEndpoint('json')
                ->setParamByKey('origins', $request->location)
                ->setParamByKey('destinations', $locations)
                ->getResponseByKey('rows.elements');
            // return response()->json($distance);         
            $distance = $distance["rows"][0]["elements"];
            foreach ($products as $key => $product) {
                $product->distance = $distance[$key]["distance"]["value"];
            }
            $products = $products->sortBy('distance')->values();
        }
        //get media and bookmark
        if (JWTAuth::getToken()) {
            $auth = JWTAuth::parseToken()->check();
        } else {
            $auth = false;
        }
        $products = $products->load('productMedias');
        if ($auth) {
            $user = JWTAuth::parseToken()->authenticate();
            $products = $products->load(['bookmarks' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }]);
        }
        return response()->json($products);
    }

    public function getProductByCategoryID($category_id) //category detail
    {
        //get products
        $sub_categories = Category::where('parent_category_id', $category_id)->get();
        $sub_categories_id = [];
        foreach ($sub_categories as $sub_category) {
            array_push($sub_categories_id, $sub_category->id);
        }
        array_push($sub_categories_id, (int) $category_id);
        $products = Product::whereIn('category_id', $sub_categories_id)->get();
        $products = $products->load('productMedias');
        if (JWTAuth::getToken()) {
            $auth = JWTAuth::parseToken()->check();
        } else {
            $auth = false;
        }
        if ($auth) {
            if ($user = JWTAuth::parseToken()->authenticate()) {
                $products = $products->load(['bookmarks' => function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                }]);
            }
        }

        //get category
        $category = Category::where('id', $category_id)->get()->first();
        $category->sub_categories = $sub_categories;
        if ($category->parent_category_id) {
            $parent_category = Category::where('id', $category->parent_category_id)->get();
            $category->parent_category_id = $parent_category;
        }
        //assign into result
        $result = (object)[];
        $result->products = $products;
        $result->category_detail = $category;

        return response()->json($result);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required',
            'product_name' => 'required',
            'description' => 'required',
            'price' => 'required',
            'quantity' => 'required|min:1',
            'outside_status' => 'required',
            'function_status' => 'required',
            'location' => 'required',
            'city' => 'required',
            'images' => 'required'
        ]);
        if (!$user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }
        $product = new Product;
        $product->owner_id = $user->id;
        $product->category_id = $request->category_id;
        $product->product_name = $request->product_name;
        $product->description = $request->description;
        $product->price = $request->price;
        $product->quantity = $request->quantity;
        $product->outside_status = $request->outside_status;
        $product->function_status = $request->function_status;
        $product->location = $request->location;
        $product->city = $request->city;
        $product->save();

        $images = $request->images;
        $product_medias = [];

        foreach($request->images as $image) {
            $product_medias[] = ['product_id' => $product->id, 'media_url' => $image, 'media_type' => 0];
        }

        ProductMedia::insert($product_medias);
        $product = $product->load('productMedias');

        return response()->json($product);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update($product_id, Request $request)
    {
        if($request->images){   //Nếu cần đổi medias thì xóa medias cũ -> thêm medias mới, update all except images
            $input = $request->all();
            unset($input['images']);

            $product = Product::where('id', $product_id)->update($input);

            $product_medias = ProductMedia::where('product_id', $product_id);
            $product_medias->delete();

            $images = $request->images;
            $product_medias = [];
            foreach($request->images as $image) {
                $product_medias[] = ['product_id' => $product_id, 'media_url' => $image, 'media_type' => 0];
            }
            ProductMedia::insert($product_medias);
        }else{  //Nếu k cần đổi medias -> update all thông tin input
            $input = $request->all();
            $product = Product::where('id', $product_id)->update($input);
        }
        $product = Product::where('id', $product_id)->first();
        $product = $product->load('productMedias');
        return response()->json($product);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $products
     * @return \Illuminate\Http\Response
     */
    public function destroy($product_id)
    {

        $questions = Question::where('product_id', $product_id);
        $question_ids = $questions->pluck('id');

        Answer::whereIn('question_id', $question_ids)->delete();
        ProductMedia::where('product_id', $product_id)->delete();

        $questions->delete();
        $product = Product::destroy($product_id);

        return response()->json($product_id);
    }
}