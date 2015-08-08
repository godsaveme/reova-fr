<?php

namespace Salesfly\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use Salesfly\Salesfly\Repositories\CashMonthlyRepo;
use Salesfly\Salesfly\Managers\CashMonthlyManager;

class CashMonthlyController extends Controller {

    protected $CashMonthlyRepo;

    public function __construct(CashMonthlyRepo $CashMonthlyRepo)
    {
        $this->CashMonthlyRepo = $CashMonthlyRepo;
    }


    public function index()
    {
        return View('cashMonthlys.index');
        //return 'hola';
    }

    public function all()
    {
        $cashMonthlys = $this->CashMonthlyRepo->paginate(15);
        return response()->json($cashMonthlys);
        //var_dump($materials);
    }

    public function paginatep(){
        $cashMonthlys = $this->CashMonthlyRepo->paginate(15);
        return response()->json($cashMonthlys);
    }


    public function form_create()
    {
        return View('cashMonthlys.form_create');
    }

    public function form_edit()
    {
        return View('cashMonthlys.form_edit');
    }

    public function create(Request $request)
    {

        $cashMonthlys = $this->CashMonthlyRepo->getModel();

        $manager = new CashMonthlyManager($cashMonthlys,$request->all());
        $manager->save();

        return response()->json(['estado'=>true, 'descripcion'=>$cashMonthlys->descripcion]);
    }

    public function find($id)
    {
        $material = $this->CashMonthlyRepo->find($id);
        return response()->json($material);
    }

    public function edit(Request $request)
    {
        $material = $this->CashMonthlyRepo->find($request->id);
        //var_dump($material);
        //die(); 
        $manager = new CashMonthlyManager($material,$request->all());
        $manager->save();

        //Event::fire('update.material',$material->all());
        return response()->json(['estado'=>true, 'nombre'=>$material->nombre]);
    }

    public function destroy(Request $request)
    {
        $material= $this->CashMonthlyRepo->find($request->id);
        $material->delete();
        //Event::fire('update.material',$material->all());
        return response()->json(['estado'=>true, 'nombre'=>$material->nombre]);
    }

    public function search($m,$a,$c)
    {
        //return substr($q, 0,1);
        //return substr($q, -1);

        $cashMonthlys = $this->CashMonthlyRepo->search($m,$a,$c);

        return response()->json($cashMonthlys);
        //return $m+$a+$c;
    }
}