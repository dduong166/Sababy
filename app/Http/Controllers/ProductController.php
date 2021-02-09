<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Controllers\DealController;
use App\Http\Controllers\CategoryController;
use App\Models\ProductMedia;
use App\Models\Deal;
use App\Models\Category;
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
        $product = Product::where('product_id', $product_id)->get()->first();
        //$product->load('rates'); trường hợp không cần tính toán
        $rate = $this->DealController->getRate($product_id);
        $product->rate = $rate->original;

        return response()->json($product);
    }

    public function getProductByCategoryID($category_id)
    {
        // $categories = Category::where('parent_category_id', $category_id)->pluck('category_id')->toArray();
        // array_push($categories, (integer) $category_id);
        // $products = Product::whereIn('category_id', $categories)->get();
        $products = Product::all();
        $products = $products->load('deals', 'productMedias');
        return response()->json($products);
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
