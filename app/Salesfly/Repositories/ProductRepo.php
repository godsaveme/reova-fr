<?php

namespace Salesfly\Salesfly\Repositories;

use Salesfly\Salesfly\Entities\Product;

class ProductRepo extends BaseRepo{

    public function getModel(){
        return new Product;
    }

    public function search($q){

        //$products = Product::where()

    }

    function prodSort($item1, $item2) {
        if ($item1['id'] == $item2['id']) {return 0;}

        return ($item1['id'] > $item2['id'])?1:-1;
    }
/*
    public function paginate($qantity){
        //$products = $this->getModel()->with('brand','type')->_variant->paginate($qantity);
        //$products = Product::find(1)->variant; trae 1
        //$products = Product::find(1)->variants; trae todos
        //$products = $this->getModel()->with('brand','type','variant')->paginate($qantity);
        $productsNovariants = Product::join('brands','products.brand_id','=','brands.id')
                            ->join('types','products.type_id','=','types.id')
                            ->join('variants','products.id','=','variants.product_id')
                            ->where('products.hasVariants',false)
                            ->select('products.id as proId','products.codigo as proCodigo','products.nombre as proNombre','variants.price as varPrice',
                                'brands.nombre as braNombre','types.nombre as typNombre','products.created_at as proCreado',
                                \DB::raw('"0" as variantes'),\DB::raw('"0" as stoStockActual') )
                            ->paginate($qantity);
                            //->get();

        $productsSivariants =  Product::join('brands','products.brand_id','=','brands.id')
                            ->join('types','products.type_id','=','types.id')
                            ->join('variants','products.id','=','variants.product_id')
                            ->where('products.hasVariants',true)
                            ->select(\DB::raw('DISTINCT(products.id) as proId'),'products.codigo as proCodigo','products.nombre as proNombre','variants.price as varPrice',
                                'brands.nombre as braNombre','types.nombre as typNombre','products.created_at as proCreado',
                            \DB::raw('COUNT(variants.id) as variantes'),\DB::raw('"0" as stoStockActual') )
                            ->groupBy('products.id')
                            ->paginate($qantity);
                            //->get();

        //$products = array_merge($productsNovariants->toArray(),$productsSivariants->toArray());

        $pp = $productsNovariants->toArray();
        $pp2 = $productsSivariants->toArray();
        $products = array_merge($pp['data'],$pp2['data']);
        print_r($products);
        die();

        //return $products;
    }
    */

}