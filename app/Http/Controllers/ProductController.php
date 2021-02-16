<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Controllers\DealController;
use App\Http\Controllers\CategoryController;
use App\Models\ProductMedia;
use App\Models\Deal;
use App\Models\Category;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;

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
        $products = Product::all();
        return response()->json($products);
    }

    public function getProductByID($product_id)
    {
        //get product
        $product = Product::where('product_id', $product_id)->get()->first();
        $rate = $this->DealController->getRate($product_id);
        $product->rate = $rate->original;
        //get category
        $product = $product->load('category', 'productMedias', 'questions', 'questions.answers');
        if($product->category->parent_category_id){
            $parent_category = Category::where('category_id', $product->category->parent_category_id)->get();
            $product->parent_category = $parent_category;
        }

        return response()->json($product);
    }

    public function getProductByCategoryID($category_id)
    {
        //get products
        $sub_categories = Category::where('parent_category_id', $category_id)->get();
        $sub_categories_id = [];
        foreach ($sub_categories as $sub_category){
            array_push($sub_categories_id, $sub_category->category_id);
        }
        array_push($sub_categories_id, (integer) $category_id);
        $products = Product::whereIn('category_id', $sub_categories_id)->get();
        $products = $products->load('productMedias', 'bookmarks');
        //get category
        $category = Category::where('category_id', $category_id)->get()->first();
        $category->sub_categories = $sub_categories;
        if($category->parent_category_id){
            $parent_category = Category::where('category_id', $category->parent_category_id)->get();
            $category->parent_category_id = $parent_category;
        }
        //assign into result
        $result = (object)[];
        $result->products = $products;
        $result->category = $category;
        
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
        //
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
