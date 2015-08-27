 <section class="content-header">
          <h1>
            Cajas
            <small>Panel de Control</small>
          </h1>
          <ol class="breadcrumb">
            <li><a href="/"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="/cashHeaders">Cajas</li>
            <li class="active">Crear</li>
          </ol>

          
        </section>

        <section class="content">
        <div class="row">
        <div class="col-md-12">

          <div class="box box-primary">
                <div class="box-header with-border">
                  <h3 class="box-title">Crear Cajas</h3>
                </div><!-- /.box-header -->
                <!-- form start -->
                <form name="cashCreateForm" role="form" novalidate>
                  <div class="box-body">
                  <div class="callout callout-danger" ng-show="errors">
                      <ul>
                     <li ng-repeat="row in errors track by $index"><strong >@{{row}}</strong></li>
                     </ul>
                   </div>


                   <div class="row">
                    <div class="col-md-6">
                        <div class="form-group" ng-class="{true: 'has-error'}[ cashCreateForm.montoInicial.$error.required && cashCreateForm.$submitted || cashCreateForm.montoInicial.$dirty && cashCreateForm.montoInicial.$invalid]">
                          <label for="montoInicial">Monto Caja</label>
                          <input type="text" class="form-control ng-pristine ng-valid ng-touched" name="montoInicial" placeholder="0.00" ng-model="cash.montoBruto" ng-blur="calculateSuppPric()" step="0.1">
                          <label ng-show="cashCreateForm.$submitted || cashCreateForm.montoInicial.$dirty && cashCreateForm.montoInicial.$invalid">
                            <span ng-show="cashCreateForm.montoInicial.$error.required"><i class="fa fa-times-circle-o"></i>Requerido.</span>
                          </label>
                         </div>
                      </div>

                   <div class="col-md-6">
                        <div class="form-group" >
                          <label for="month">Tipo de Movimiento</label>

                          <select name="genero" class="form-control" ng-model="tipo" ng-click="cargarTipo()">
                            <option value="">--Elija Tipo Movimiento-</option>
                            <option value="+">Ingreso</option>
                            <option value="-">Gasto</option>
                          </select>
                        </div>
                      </div>

                  </div>

                   <div class="row">
                    <div class="col-md-4">
                     <div class="form-group" >
                        <label for="year">Movimiento</label>
                        <select class="form-control" name="" ng-model="detCash.cashMotive_id" ng-options="item.id as item.nombre for item in cashMotives">
                          <option value="">--Movimiento-</option>
                        </select>
                      </div>
                   </div>
                   <div class="col-md-4">
                        <div class="form-group" ng-class="{true: 'has-error'}[ cashCreateForm.montoInicial.$error.required && cashCreateForm.$submitted || cashCreateForm.montoInicial.$dirty && cashCreateForm.montoInicial.$invalid]">
                          <label for="montoInicial">Monto Movimiento</label>
                          <input type="number" class="form-control ng-pristine ng-valid ng-touched" name="montoInicial" placeholder="0.00" ng-model="detCash.montoMovimiento" ng-blur="calculate()" step="0.1">
                          <label ng-show="cashCreateForm.$submitted || cashCreateForm.montoInicial.$dirty && cashCreateForm.montoInicial.$invalid">
                            <span ng-show="cashCreateForm.montoInicial.$error.required"><i class="fa fa-times-circle-o"></i>Requerido.</span>
                          </label>
                         </div>
                      </div>

                      <div class="col-md-4">
                        <div class="form-group" ng-class="{true: 'has-error'}[ cashCreateForm.montoInicial.$error.required && cashCreateForm.$submitted || cashCreateForm.montoInicial.$dirty && cashCreateForm.montoInicial.$invalid]">
                          <label for="montoInicial">Monto Caja con Movimiento</label>
                          <input type="text" class="form-control ng-pristine ng-valid ng-touched" name="montoInicial" placeholder="0.00" ng-model="detCash.montoFinal" ng-blur="calculateSuppPric()" step="0.1">
                          <label ng-show="cashCreateForm.$submitted || cashCreateForm.montoInicial.$dirty && cashCreateForm.montoInicial.$invalid">
                            <span ng-show="cashCreateForm.montoInicial.$error.required"><i class="fa fa-times-circle-o"></i>Requerido.</span>
                          </label>
                         </div>
                      </div>
                  </div><!-- /.box -->

                  <div class="row">
                  <div class="col-md-12">
                    <div class="form-group" >
                      <label for="apellidos">Descripcion</label>
                      <textarea type="text" class="form-control" name="descripcion" placeholder="Descripcion"
                      ng-model="detCash.descripcion"/>
                     </div>
                    </div>
                  </div>

                  <div class="row">
                      <div class="col-md-6">
                        <div class="form-group" >
                          <label for="month">Estado</label>

                          <select name="genero" class="form-control" ng-model="detCash.estado">
                            <option value="">--Elija Estado-</option>
                            <option value="1">Emitido</option>
                            <option value="0">No emitido</option>
                          </select>
                        </div>
                      </div>                    
                  </div>
                                  
                  <div class="box-footer">
                    <a ng-click="createcash()" ng-href="@{{rutaCash}}"  target="_self" type="submit" class="btn btn-primary">Crear</a>
                    <a ng-click="salir()"ng-href="@{{rutaCash}}" target="_self" class="btn btn-danger">Cancelar</a>
                  </div>

                </form>
              

              </div>
              </div><!-- /.row -->
              </div>
              </section><!-- /.content -->