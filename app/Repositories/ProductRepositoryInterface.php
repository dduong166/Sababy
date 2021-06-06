<?php
namespace App\Repositories;

interface ProductRepositoryInterface
{
    /**
     * Get's a post by it's ID
     *
     * @param int
     */
    public function get($product_id);
    public function adminSellingProducts();
    public function adminSoldProducts();

    /**
     * Get's all posts.
     *
     * @return mixed
     */
    public function all();

    /**
     * Deletes a post.
     *
     * @param int
     */
    public function delete($product_id);

    /**
     * Updates a post.
     *
     * @param int
     * @param array
     */
    public function update($product_id, array $product_data);
}