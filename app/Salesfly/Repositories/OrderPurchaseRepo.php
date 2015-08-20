<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\OrderPurchase;

class OrderPurchaseRepo extends BaseRepo{
    public function getModel()
    {
        return new OrderPurchase;
    }

    public function search($q)
    {   
         $purchases=OrderPurchase::join('suppliers','orderPurchases.suppliers_id','=','suppliers.id')
                       ->join('warehouses','warehouses.id','=','orderPurchases.warehouses_id')
                       ->select('orderPurchases.*','suppliers.empresa as empresa','warehouses.nombre as almacen')->where('suppliers.empresa','like',$q.'%')
                       ->orWhere('warehouses.nombre','like',$q.'%')
                       ->orWhere('orderPurchases.fechaPedido','like','%'.$q.'%')
                       ->paginate(15);
        
        return $purchases;
    }

    function validateDate($date, $format = 'Y-m-d')
    {
        $d = \DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }
    public function paginar(){
    $purchases=OrderPurchase::join('suppliers','orderPurchases.suppliers_id','=','suppliers.id')
                       ->join('warehouses','warehouses.id','=','orderPurchases.warehouses_id')
                       ->select('orderPurchases.*','suppliers.empresa as empresa','warehouses.nombre as almacen')->orderBy('orderPurchases.id','asc')
                       ->paginate(15);
        return $purchases;
   }
   public function searchEstados($estado){
    $purchases=OrderPurchase::join('suppliers','orderPurchases.suppliers_id','=','suppliers.id')
                       ->join('warehouses','warehouses.id','=','orderPurchases.warehouses_id')
                       ->select('orderPurchases.*','suppliers.empresa as empresa','warehouses.nombre as almacen')->where('orderPurchases.Estado','=',$estado)
                       ->orderBy('orderPurchases.id','asc')
                       ->paginate(15);
        return $purchases;
   }
    public function traerSumplier($id){
        $orderPurchases=OrderPurchase::join('suppliers','orderPurchases.suppliers_id','=','suppliers.id')
        ->where('suppliers.id','=',$id)->select('suppliers.empresa as empresa')->first();
        return $orderPurchases;
    }

    
} 