<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Repositories\ProductRepositoryInterface;

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
    protected $product;
    protected $pageSize = 12;

    public function __construct(CategoryController $CategoryController, ProductRepositoryInterface $product)
    {
        // header('Access-Control-Allow-Origin: *'); 
        // dd(123);
        $this->CategoryController = $CategoryController;
        $this->product = $product;
    }

    public function getProductsPagination(){
        $products = $this->product->all();

        return response()->json($products);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::where('sold', 0)->orderBy('created_at', 'DESC')->paginate($this->pageSize);
        $products->load('productMedias');
    
        return response()->json($products);
    }

    public function CountProductByDate(){
        $productByDate = DB::table('products')
                ->select(DB::raw("COUNT(*) `sản phẩm`, DATE_FORMAT(created_at, '%Y-%m-%d') date"))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        $countAll = Product::all()->count();
        return response()->json(['productByDate' => $productByDate, 'countAll' => $countAll]);
    }

    public function adminSellingProducts(){
        $products = $this->product->adminSellingProducts($this->pageSize);

        return response()->json($products->original);
    }

    public function adminSoldProducts(){
        $products = $this->product->adminSoldProducts($this->pageSize);

        return response()->json($products->original);
    }

    public function sellingProducts(){
        if (JWTAuth::getToken()) {
            $auth = JWTAuth::parseToken()->check();
        } else {
            $auth = false;
        }
        if ($auth) {
            $user = JWTAuth::parseToken()->authenticate();
            $products = Product::where('owner_id', $user->id)->where('sold', 0)->orderBy('created_at', 'DESC')->paginate($this->pageSize);
            $products->makeVisible(['location']);
            $products->load('productMedias');
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
            $products = Product::where('owner_id', $user->id)->where('sold', 1)->orderBy('created_at', 'DESC')->paginate($this->pageSize);
            $products->makeVisible(['location']);
            $products->load('productMedias');
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
        } else {
            $products = $products->sortByDesc('created_at')->values();
        }     
        $products = $products->load('productMedias');

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
        $products = Product::whereIn('category_id', $sub_categories_id)->orderBy('created_at', 'DESC')->get();
        $products = $products->load('productMedias');

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
            $product_medias[] = ['product_id' => $product->id, 'media_url' => $image];
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
                $product_medias[] = ['product_id' => $product_id, 'media_url' => $image];
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

    public function destroy($product_id)
    {
        $product = $this->product->delete($product_id);

        return response()->json($product_id);
    }
    
}