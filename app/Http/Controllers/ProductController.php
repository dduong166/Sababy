<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

use App\Models\Product;
use App\Http\Controllers\DealController;
use App\Http\Controllers\CategoryController;
use App\Models\ProductMedia;
use App\Models\Deal;
use App\Models\Category;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProductController extends Controller
{
    protected $DealController;
    protected $CategoryController;

    public function __construct(DealController $DealController, CategoryController $CategoryController)
    {
        // header('Access-Control-Allow-Origin: *'); 
        // dd(123);
        $this->DealController = $DealController;
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

        $products = Product::all();
        $products = $products->load('productMedias');
        if ($auth) {
            $user = JWTAuth::parseToken()->authenticate();
            $products = $products->load(['bookmarks' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }]);
        }
        return response()->json($products);
    }

    public function getProductByID($product_id) //product detail
    {
        //get product
        $product = Product::where('id', $product_id)->first();
        $rate = $this->DealController->getRate($product_id);
        $product->rate = $rate->original;
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
            // dd($distance);
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

    public function getProductDeals($product_id)
    {
        $deals = $this->DealController->getDeal($product_id);
        return $deals;
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
        ]);
        if (!$user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }
        $product = $request->all();
        $product->owner_id = $user->id;
        dd($product);
        $product = Product::create($product);
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
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        //
    }
}
