(function(){
    angular.module('products.controllers',[])
        .controller('ProductController',['$scope', '$routeParams','$location','crudService','socketService' ,'$filter','$route','$log','ngProgressFactory','$rootScope','trouble','$modal',
            function($scope, $routeParams,$location,crudService,socket,$filter,$route,$log,ngProgressFactory,$rootScope,trouble,$modal){
                $scope.progressbar = ngProgressFactory.createInstance();
                /*$rootScope.$on('$routeChangeStart', function(ev,data) {
                    $scope.progressbar.start();
                });
                $rootScope.$on('$routeChangeSuccess', function(ev,data) {
                    $scope.progressbar.complete();
                });*/
               

                $scope.stockVariants = [];

                $scope.stockTemplate = 'stockTemplate.html';

                $scope.products = [];
                $scope.product = {};
                $scope.variant = {};
                $scope.product.track = true;
                $scope.variant.track = true;
                $scope.product.autogenerado = true;
                $scope.variant.autogenerado = false;
                //$scope.variant.detAtr = [];
                $scope.product.presentations = [];
                $scope.variant.presentations = [];
                $scope.generos = [{name:'Masculino'},{name:'Femenino'}];
                $scope.errors;
                $scope.success;
                $scope.query = '';
                $scope.brands = {};
                $scope.materials = {};
                $scope.types = {};
                $scope.stations = {};
                $scope.product.estado = true;
                $scope.product.hasVariants = true;

                $scope.presentation = {};
                $scope.presentations = [];
                $scope.preAdd = {};
                $scope.presentation.id = '1';
                //$scope.product.presentations = [];
                $scope.presentation.suppPri = 0;
                $scope.presentation.markup = 0;
                $scope.presentation.price = 0;
                $scope.presentation.markupCant = 0;
                $scope.presentation.suppPriDol = 0;

                //desctos
                $scope.presentation.dscto = 0;
                $scope.presentation.dsctoCant = 0;
                $scope.presentation.pvp = 0;
                $scope.presentation.fecIniDscto = new Date();
                $scope.presentation.fecFinDscto = new Date();
                $scope.presentation.dsctoRange = 0;
                $scope.presentation.dsctoCantRange = 0;
                $scope.presentation.pvpRange = 0;

                $scope.presentation.cambioDolar = 3.00;
                //
                $scope.presentation.edit = false;
                $scope.presentation.identificador = -1;

                $scope.presentation.activateDsctoRange = false;

                $scope.minNumber = 0;

                $scope.warehouses = [];


                $scope.variants = []; //variantes por product_id;
                $scope.variant.fvenc = new Date();

                //$scope.product.presentation_base = '1';

                $scope.product.presentation_base_object = {};
                $scope.variant.presentation_base_object = {};

                //$scope.product.presentation_base_object = {id:1};
                $scope.enabled_presentation_button = true;
                $scope.enabled_createpresentation_button = false;

                /*
                de variants create
                 */
                $scope.categories=[{id:1,nombre:'Dama'},{id:2,nombre:'Caballero'},{id:3,nombre:'Niño'},{id:4,nombre:'Niña'}];
                $scope.variant.category= 1;
                //$log.log($scope.category);
                $scope.attributes = [];
                /*
                ./ de variants create
                 */

                $scope.calculateCambioDolar = function() {
                    //$scope.presentation.suppPri = presentation.suppPriDol * presentation.cambioDolar
                    /*$scope.calculateSuppPric();*/
                    $scope.calculateSuppPricDol();
                }

                $scope.calculateSuppPricDol = function() {
                    $scope.presentation.suppPri = parseFloat($scope.presentation.suppPriDol) * parseFloat($scope.presentation.cambioDolar);
                    $scope.presentation.suppPri = parseFloat($scope.presentation.suppPri).toFixed(2);
                    $scope.calculateSuppPric();
                    $scope.calculatePrice();
                }

                $scope.calculateMarkupCant = function(){
                    $scope.presentation.price = parseFloat($scope.presentation.suppPri) + parseFloat($scope.presentation.markupCant);
                    $scope.presentation.price = parseFloat($scope.presentation.price).toFixed(2);

                    $scope.presentation.markup = (parseFloat($scope.presentation.price) - parseFloat($scope.presentation.suppPri)) * 100 / parseFloat($scope.presentation.suppPri);
                    $scope.presentation.markup = parseFloat($scope.presentation.markup).toFixed(2);
                    $scope.calculatePrice();
                }

                $scope.calculateSuppPric = function() {//presentation.markup
                    //alert('holi');alert($scope.presentation.suppPri);
                    //alert('hi');
                    //if(angular.isNumber($scope.presentation.suppPri) && angular.isNumber($scope.presentation.markup) && angular.isNumber($scope.presentation.price)){
                        $scope.presentation.price = parseFloat($scope.presentation.suppPri) + parseFloat($scope.presentation.markup) * parseFloat($scope.presentation.suppPri) / 100;
                        $scope.presentation.price = parseFloat($scope.presentation.price).toFixed(2);
                        $scope.presentation.suppPriDol = parseFloat($scope.presentation.suppPri) / parseFloat($scope.presentation.cambioDolar);
                        $scope.presentation.suppPriDol = parseFloat($scope.presentation.suppPriDol).toFixed(2);
                    $scope.calculatePrice();
                    //alert('holi');
                    //}
                };
                $scope.calculateMarkup = function() {
                    //alert('holi');
                    //if(angular.isNumber($scope.presentation.suppPri) && angular.isNumber($scope.presentation.markup) && angular.isNumber($scope.presentation.price)){
                        $scope.presentation.price = parseFloat($scope.presentation.suppPri) + parseFloat($scope.presentation.markup) * parseFloat($scope.presentation.suppPri) / 100;
                        $scope.presentation.price = parseFloat($scope.presentation.price).toFixed(2);

                        $scope.presentation.markupCant = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.suppPri);
                        $scope.presentation.markupCant = parseFloat($scope.presentation.markupCant).toFixed(2);
                        $scope.calculatePrice();
                    //}
                };
                $scope.calculatePrice = function() {
                    //alert('holi');
                    //if(angular.isNumber($scope.presentation.suppPri) && angular.isNumber($scope.presentation.markup) && angular.isNumber($scope.presentation.price)){
                        $scope.presentation.markup = (parseFloat($scope.presentation.price) - parseFloat($scope.presentation.suppPri)) * 100 / parseFloat($scope.presentation.suppPri);
                        $scope.presentation.markup = parseFloat($scope.presentation.markup).toFixed(2);

                    $scope.presentation.pvp = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.dscto) * parseFloat($scope.presentation.price) / 100;
                    $scope.presentation.pvp = parseFloat($scope.presentation.pvp).toFixed(2);

                    $scope.presentation.dsctoCant = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.pvp);
                    $scope.presentation.dsctoCant = parseFloat($scope.presentation.dsctoCant).toFixed(2);

                        $scope.presentation.markupCant = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.suppPri);
                        $scope.presentation.markupCant = parseFloat($scope.presentation.markupCant).toFixed(2);

                    $scope.presentation.pvpRange = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.dsctoRange) * parseFloat($scope.presentation.price) / 100;
                    $scope.presentation.pvpRange = parseFloat($scope.presentation.pvpRange).toFixed(2);

                    $scope.presentation.dsctoCantRange = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.pvpRange);
                    $scope.presentation.dsctoCantRange = parseFloat($scope.presentation.dsctoCantRange).toFixed(2);


                    //}
                };

                //dsctos calcular

                $scope.calculatePVP = function() {
                    $scope.presentation.dscto = (parseFloat($scope.presentation.price) - parseFloat($scope.presentation.pvp)) * 100 / parseFloat($scope.presentation.price);
                    $scope.presentation.dscto = parseFloat($scope.presentation.dscto).toFixed(2);

                    $scope.presentation.dsctoCant = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.pvp);
                    $scope.presentation.dsctoCant = parseFloat($scope.presentation.dsctoCant).toFixed(2);
                    //$scope.presentation.pvp = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.dscto) * parseFloat($scope.presentation.price) / 100;
                    //$scope.presentation.pvp = parseFloat($scope.presentation.pvp).toFixed(2);
                    $scope.calDescuento1();
                }
                 /*$scope.calDescuento10=function(){
                    //alert("hola mundo");
                    $scope.presentation.markup = (parseFloat($scope.presentation.pvp) - parseFloat($scope.presentation.suppPri)) * 100 / parseFloat($scope.presentation.suppPri);
                    $scope.presentation.markup = parseFloat($scope.presentation.markup).toFixed(2)
                    $scope.presentation.markupCant = parseFloat($scope.presentation.pvp) - parseFloat($scope.presentation.suppPri);
                    $scope.presentation.markupCant = parseFloat($scope.presentation.markupCant).toFixed(2);
                 }*/
                 $scope.calDescuento1=function(){
                    //alert("hola mundo");
                    $scope.presentation.markup1 = (parseFloat($scope.presentation.pvp) - parseFloat($scope.presentation.suppPri)) * 100 / parseFloat($scope.presentation.suppPri);
                    $scope.presentation.markup1 = parseFloat($scope.presentation.markup1).toFixed(2)
                    $scope.presentation.markupCant1 = parseFloat($scope.presentation.pvp) - parseFloat($scope.presentation.suppPri);
                    $scope.presentation.markupCant1 = parseFloat($scope.presentation.markupCant1).toFixed(2);
                    //$scope.presentation.price=$scope.presentation.pvp+$scope.presentation.dsctoCant;
                    //$scope.calDescuento10();
                 }
                 $scope.calDescuento2=function(){
                    $scope.presentation.markup2 = (parseFloat($scope.presentation.pvpRange) - parseFloat($scope.presentation.suppPri)) * 100 / parseFloat($scope.presentation.suppPri);
                    $scope.presentation.markup2 = parseFloat($scope.presentation.markup2).toFixed(2)
                    $scope.presentation.markupCant2 = parseFloat($scope.presentation.pvpRange) - parseFloat($scope.presentation.suppPri);
                    $scope.presentation.markupCant2 = parseFloat($scope.presentation.markupCant2).toFixed(2);
                    //$scope.presentation.price=$scope.presentation.pvp+$scope.presentation.dsctoCant;
                    //$scope.calDescuento10();
                 }
                $scope.calculateDscto = function() {
                    //alert('holi');
                    //if(angular.isNumber($scope.presentation.suppPri) && angular.isNumber($scope.presentation.markup) && angular.isNumber($scope.presentation.price)){
                    $scope.presentation.pvp = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.dscto) * parseFloat($scope.presentation.price) / 100;
                    $scope.presentation.pvp = parseFloat($scope.presentation.pvp).toFixed(2);

                    $scope.presentation.dsctoCant = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.pvp);
                    $scope.presentation.dsctoCant = parseFloat($scope.presentation.dsctoCant).toFixed(2);
                    $scope.calDescuento1();
                    //}
                };
                $scope.calculateDsctoCant = function() {
                    //alert('holi');
                    //if(angular.isNumber($scope.presentation.suppPri) && angular.isNumber($scope.presentation.markup) && angular.isNumber($scope.presentation.price)){
                    $scope.presentation.pvp = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.dsctoCant);
                    $scope.presentation.pvp = parseFloat($scope.presentation.pvp).toFixed(2);

                    $scope.presentation.dscto = (parseFloat($scope.presentation.price) - parseFloat($scope.presentation.pvp)) * 100 / parseFloat($scope.presentation.price);
                    $scope.presentation.dscto = parseFloat($scope.presentation.dscto).toFixed(2);
                    $scope.calDescuento1();
                    //}
                };

                $scope.calculateDsctoRange = function() {
                    //alert('holi');
                    //if(angular.isNumber($scope.presentation.suppPri) && angular.isNumber($scope.presentation.markup) && angular.isNumber($scope.presentation.price)){
                    $scope.presentation.pvpRange = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.dsctoRange) * parseFloat($scope.presentation.price) / 100;
                    $scope.presentation.pvpRange = parseFloat($scope.presentation.pvpRange).toFixed(2);

                    $scope.presentation.dsctoCantRange = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.pvpRange);
                    $scope.presentation.dsctoCantRange = parseFloat($scope.presentation.dsctoCantRange).toFixed(2);
                    $scope.calDescuento2();
                    //}
                };

                $scope.calculateDsctoCantRange = function() {
                    //alert('holi');
                    //if(angular.isNumber($scope.presentation.suppPri) && angular.isNumber($scope.presentation.markup) && angular.isNumber($scope.presentation.price)){
                    $scope.presentation.pvpRange = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.dsctoCantRange);
                    $scope.presentation.pvpRange = parseFloat($scope.presentation.pvpRange).toFixed(2);

                    $scope.presentation.dsctoRange = (parseFloat($scope.presentation.price) - parseFloat($scope.presentation.pvpRange)) * 100 / parseFloat($scope.presentation.price);
                    $scope.presentation.dsctoRange = parseFloat($scope.presentation.dsctoRange).toFixed(2);
                    $scope.calDescuento2();
                    //}
                };

                $scope.calculatePVPRange = function() {
                    $scope.presentation.dsctoRange = (parseFloat($scope.presentation.price) - parseFloat($scope.presentation.pvpRange)) * 100 / parseFloat($scope.presentation.price);
                    $scope.presentation.dsctoRange = parseFloat($scope.presentation.dsctoRange).toFixed(2);

                    $scope.presentation.dsctoCantRange = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.pvpRange);
                    $scope.presentation.dsctoCantRange = parseFloat($scope.presentation.dsctoCantRange).toFixed(2);
                    $scope.calDescuento2();
                    //$scope.presentation.pvp = parseFloat($scope.presentation.price) - parseFloat($scope.presentation.dscto) * parseFloat($scope.presentation.price) / 100;
                    //$scope.presentation.pvp = parseFloat($scope.presentation.pvp).toFixed(2);
                }


                //fin dsctos
                $scope.toggle = function () {
                    $scope.show = !$scope.show;
                };

                $scope.pageChanged = function() {
                    if ($scope.query.length > 0) {
                        crudService.search('products',$scope.query,$scope.currentPage).then(function (data){
                        $scope.products = data.data;
                    });
                    }else{
                        crudService.paginate('products',$scope.currentPage).then(function (data) {
                            $scope.products = data.data;
                        });
                    }
                };


                var id = $routeParams.id;

                //$log.log($routeParams);

                if(id)
                {
                    if($location.path() == '/products/edit/'+$routeParams.id) {

                                crudService.paginate('products',1).then(function (data) {
                                    $scope.products = data.data;
                                });
                          //  if(!$scope.product.hasVariants){
                                crudService.byforeingKey('variants','variant',id).then(function(data){
                                    $log.log(data);
                                    $scope.product = data.product;
                                    $scope.product.estado = ( $scope.product.estado == 1 );
                                    $scope.product.hasVariants = ($scope.product.hasVariants == 1 );
                                    $scope.product.track = (data.track == 1 ); //de variants
                                    $scope.product.presentations = data.det_pre;
                                    $scope.product.stock = data.stock;
                                    $scope.product.puntos=Number(data.puntos);
                                    $scope.product.autogenerado=true;
                                    crudService.all('warehouses').then(function (data){
                                        $scope.warehouses = data;
                                    });
                                    $scope.product.sku = data.sku;
                                    //alert(isEmpty(data.stock));
                                    if(isEmpty(data.stock)){
                                        //alert('holi');
                                        $scope.minNumber = null ;
                                    }
                                    $scope.product.autogenerado = false;
                                    crudService.all('presentations_base').then(function(data){
                                        //alert('holi');
                                        $scope.presentations_base = data;
                                        $log.log( $scope.presentations_base);
                                        $scope.obj = $.grep($scope.presentations_base, function(e){ return e.id == $scope.product.presentation_base; });
                                        $scope.product.presentation_base_object = $scope.obj[0];
                                        if(!isEmpty($scope.obj)) {
                                            //$scope.traerPres($scope.product.presentation_base_object.id);
                                            //$scope.changePreBase();
                                            $scope.enabled_presentation_button = false;
                                        }
                                    });

                                });
                            //}



                        crudService.select('products', 'brands').then(function (data) {
                            $scope.brands = data;
                        });
                        crudService.select('products', 'materials').then(function (data) {
                            $scope.materials = data;
                        });
                        crudService.select('products', 'types').then(function (data) {
                            $scope.types = data;
                        });
                        crudService.select('products', 'stations').then(function (data) {
                            $scope.stations = data;
                        });



                    };

                    if($location.path() == '/products/show/'+$routeParams.id) {
                        //alert('ok');
                        crudService.byId(id,'products').then(function (data){
                            $scope.product = data;
                            if($scope.product.hasVariants == 0){
                                crudService.byforeingKey('variants','variant',$scope.product.id).then(function(data){
                                    $scope.variant = data;
                                    $log.log('Variants,Variant:');
                                    $log.log($scope.variant);
                                })

                            }
                        });
                        $scope.variants = [];
                        crudService.byforeingKey('variants','variants',id). then(function(data)
                        {
                            $scope.variants = data;
                        })

                    };

                    if($location.path() == '/variants/edit/'+$routeParams.id) {
                        crudService.byId($routeParams.id,'variants').then(function (data)
                        {
                            //if(typeof($scope.variant.detAtr) == 'undefined')

                            //$scope.variant = data;
                            $scope.variant.category = data.category;
                            $scope.variant.codigo = data.codigo;
                            $scope.variant.created_at = data.created_at;
                            $scope.variant.puntos=Number(data.puntos);
                            //$scope.variant.favorite: data.favorite
                            $scope.variant.id = data.id;
                            $scope.variant.image = data.image;

                            $scope.variant.nota = data.nota;
                            $scope.variant.observado = (data.observado == 1);

                            $scope.variant.product_id = data.product_id;
                            $scope.variant.category = parseInt(data.category);

                            $scope.variant.fvenc = new Date(data.fvenc);
                            $scope.variant.fvenc.setDate($scope.variant.fvenc.getDate()+1);
                            //var tomorrow = new Date();
                            //tomorrow.setDate(tomorrow.getDate() + 1);


                            //crudService.byId($scope.variant.product_id, 'products').then(function (data) {
                                //$log.log(data);
                            $scope.product = data.product;
                            //$scope.product.estado = ( $scope.product.estado == 1 );
                            //$scope.product.hasVariants = ($scope.product.hasVariants == 1 );
                            $scope.variant.track = (data.track == 1 ); //de variants
                            $scope.variant.presentations = data.det_pre;
                            $scope.variant.stock = data.stock;

                            crudService.all('warehouses').then(function (data){
                                $scope.warehouses = data;
                            });

                            $scope.variant.sku = data.sku;
                            $scope.variant.sku2 = data.sku2;
                            //$scope.variant.detAtrT = data.det_atr;
                            //for (i = 0; i < data.det_atr.length; i++) {
                                //$scope.variant.detAtr[data.det_atr[i].atribute_id].descripcion = data.det_atr[i].descripcion;
                            //    $log.log('holi');
                            //}
                            //$scope.variant.
                            //alert(isEmpty(data.stock));
                            if(isEmpty(data.stock)){
                                //alert('holi');
                                $scope.minNumber = null ;
                            }
                            $scope.variant.autogenerado = false;
                                //if ($scope.product.type) $scope.variant.codigo = $scope.product.codigo + $scope.product.type.nombre.charAt(0); else {
                                //    $scope.variant.codigo = $scope.product.codigo;
                                //}
                                //espero q se llene product y de ahi agrego Unidades por defecto
                                crudService.all('presentations_base').then(function (data) {
                                    $log.log(data);
                                    $scope.presentations_base = data;
                                    //$scope.product.presentation_base_object
                                    //$log.log( $scope.presentations);
                                    $scope.variant.presentation_base_object = data[0];
                                    $scope.variant.presentation_base = $scope.variant.presentation_base_object.id;
                                    $scope.enabled_presentation_button = false;

                                    //$scope.presentationSelect =

                                });

                            //});
                        });


                        crudService.all('atributes').then(function (data){
                            $scope.attributes = data.data;
                            $log.log($scope.attributes);
                        })

                    }


                }else{
                    crudService.paginate('products',1).then(function (data) {
                        $scope.products = data.data;
                        //$log.log(data.data);
                        $scope.maxSize = 5;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                        $scope.itemsperPage = 15;

                    });

                    if($location.path() == '/products/create') {
                        crudService.paginate('products',1).then(function (data) {
                        $scope.products = data.data;
                        });
                        crudService.select('products', 'brands').then(function (data) {
                            $scope.brands = data;
                        });
                        crudService.select('products', 'materials').then(function (data) {
                            $scope.materials = data;
                        });
                        crudService.select('products', 'types').then(function (data) {
                            $scope.types = data;
                        });
                        crudService.select('products', 'stations').then(function (data) {
                            $scope.stations = data;
                        });
                        crudService.all('warehouses').then(function (data){
                            $scope.warehouses = data;
                            //alert('h');

                        });
                        crudService.all('presentations_base').then(function(data){
                            //alert('holi');
                            $scope.presentations_base = data;
                            //$scope.product.presentation_base_object
                            //$log.log( $scope.presentations);
                            $scope.product.presentation_base_object = data[0];
                            $scope.product.presentation_base = $scope.product.presentation_base_object.id;
                            $scope.enabled_presentation_button = false;

                            //$scope.presentationSelect =

                        });
                    }
                }

                if($routeParams.product_id){
                    if($location.path() == '/variants/create/'+$routeParams.product_id){
                        crudService.byId($routeParams.product_id,'products').then(function (data) {
                            $log.log(data);
                            $scope.product = data;
                            if($scope.product.type) $scope.variant.codigo = $scope.product.codigo; else{$scope.variant.codigo = $scope.product.codigo;}
                                //espero q se llene product y de ahi agrego Unidades por defecto
                            crudService.byId($routeParams.product_id,"cantvariantes").then(function (data) {
                                if((Number(data.cantidad)+1)<10){
                                    $scope.variant.codigo=$scope.variant.codigo+'-0'+(Number(data.cantidad)+1);
                                }else{
                                    $scope.variant.codigo=$scope.variant.codigo+'-'+(Number(data.cantidad)+1);
                                }
                                
                            });
                            crudService.all('presentations_base').then(function(data){
                                $log.log(data);
                                $scope.presentations_base = data;
                                //$scope.product.presentation_base_object
                                //$log.log( $scope.presentations);
                                $scope.variant.presentation_base_object = data[0];
                                $scope.variant.presentation_base = $scope.variant.presentation_base_object.id;
                                $scope.enabled_presentation_button = false;

                                //$scope.presentationSelect =

                            });

                        });

                        crudService.all('warehouses').then(function (data){
                            $scope.warehouses = data;
                        });
                        crudService.all('atributes').then(function (data){
                            $scope.attributes = data.data;
                            $log.log($scope.attributes);
                        })
                    }


                }

                socket.on('product.update', function (data) {
                    $scope.products=JSON.parse(data);
                });

                $scope.searchProduct = function(){
                if ($scope.query.length > 0) {
                    crudService.search('products',$scope.query,1).then(function (data){
                        $scope.products = data.data;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                    });
                }else{
                    crudService.paginate('products',1).then(function (data) {
                        $scope.products = data.data;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                    });
                }
                    
                };


                $scope.asignarFecha=function(){
                    //alert($scope.variant.fvenc1.substring(0,2));
                    var fechasjkks='';
                    fechasjkks=fechasjkks+$scope.variant.fvenc1.substring(6,10)+'/'+$scope.variant.fvenc1.substring(3,5)+'/'+$scope.variant.fvenc1.substring(0,2);
                     
                     $scope.variant.fvenc = new Date(fechasjkks);
                     $scope.variant.fvenc.setDate($scope.variant.fvenc.getDate());
                     $scope.variant.fvenc.setMonth($scope.variant.fvenc.getMonth());
                     $scope.variant.fvenc.setFullYear($scope.variant.fvenc.getFullYear());
                }
                $scope.createProduct = function(){

                    if ($scope.productCreateForm.$valid) {
                        var $btn = $('#btn_generate').button('loading');
                        var f = document.getElementById('productImage').files[0] ? document.getElementById('productImage').files[0] : null;
                        //alert(f);
                        var r = new FileReader();
                        r.onloadend = function(e) {
                            $scope.product.image = e.target.result;

                            crudService.create($scope.product, 'products').then(function (data) {
                                if (data['estado'] == true) {
                                    //$scope.success = data['nombres'];
                                    alert('Producto creado con Éxito');
                                    $location.path('/products');

                                } else {
                                    $scope.errors = data;
                                    $btn.button('reset');
                                    //alert(data);

                                }
                            });
                        }
                        if(!document.getElementById('productImage').files[0]){
                            var $btn = $('#btn_generate').button('loading');
                            //alert($scope.product.hasVariants);
                            crudService.create($scope.product,'products').then(function (data){
                                if (data['estado'] == true) {
                                    //$scope.success = data['nombres'];
                                    alert('Producto creado con Éxito');
                                    $location.path('/products');

                                } else {
                                    $scope.errors = data;
                                    $btn.button('reset');

                                }
                            });
                        }

                        if(document.getElementById('productImage').files[0]){
                            r.readAsDataURL(f);
                        }

                    }
                }


                $scope.createVariant = function(){

                        //alert('hola');
                    $scope.variant.otros=$scope.ArrayTallas;
                    $scope.variant.cantTallas=$scope.variant1;
                            //alert($scope.variant.otros);

                    if ($scope.variantCreateForm.$valid) {
                        var $btn = $('#btn_generate').button('loading');
                        var fv = document.getElementById('variantImage').files[0] ? document.getElementById('variantImage').files[0] : null;
                        //alert(f);
                        var rv = new FileReader();
                        rv.onloadend = function(e) {
                            //alert('con img');
                            $scope.variant.image = e.target.result;

                            $scope.variant.product_id = $scope.product.id;
                            //$log.log($scope.variant.fvenc.getHours());
                            //$log.log($scope.variant.fvenc.getHours());
                            //modify fvenc menos 1 dia
                            $scope.variant.fvenc.setUTCHours($scope.variant.fvenc.getHours());
                            //
                            //$log.log($scope.variant);
                            
                            crudService.create($scope.variant, 'variants').then(function (data) {
                                if (data['estado'] == true) {
                                    //$scope.success = data['nombres'];
                                    alert('Variante creada con Éxito');
                                    //$location.path('/products/show/'+$scope.product.id);
                                     $btn.button('reset');
                                } else {
                                    $scope.errors = data;
                                    $btn.button('reset');
                                    //alert(data);

                                }
                            });
                        }
                        if(!document.getElementById('variantImage').files[0]){
                            var $btn = $('#btn_generate').button('loading');
                            //alert($scope.product.hasVariants);
                            //alert('sin img');
                            $scope.variant.product_id = $scope.product.id;
                            //$log.log($scope.variant.fvenc.getHours());
                            //$log.log($scope.variant.fvenc.getHours());
                            //modify fvenc menos 1 dia
                            $scope.variant.fvenc.setUTCHours($scope.variant.fvenc.getHours());
                            //

                            crudService.create($scope.variant,'variants').then(function (data){
                                if (data['estado'] == true) {
                                    //$scope.success = data['nombres'];
                                    alert('Variante creada con Éxito');
                                    //$location.path('/products/show/'+$scope.product.id);
                                     $btn.button('reset');
                                } else {
                                    $scope.errors = data;
                                    $btn.button('reset');

                                }
                            });
                        }

                        if(document.getElementById('variantImage').files[0]){
                            rv.readAsDataURL(fv);
                        }

                    }
                }

                $scope.updateVariant = function(){

                    if ($scope.variantCreateForm.$valid) {
                        var $btn = $('#btn_generate').button('loading');
                        var f = document.getElementById('variantImage').files[0] ? document.getElementById('variantImage').files[0] : null;
                        //alert(f);
                        var r = new FileReader();
                        r.onloadend = function(e) {
                            $scope.variant.image = e.target.result;
                            
                            $scope.variant.product_id = $scope.product.id;
                            //modify fvenc menos 1 dia
                            $scope.variant.fvenc.setDate($scope.variant.fvenc.getDate() - 1);
                            //
                            crudService.update($scope.variant, 'variants').then(function (data) {
                                if (data['estado'] == true) {
                                    //$scope.success = data['nombres'];
                                    alert('Variante modificada con Éxito');
                                    $location.path('/products/show/'+$scope.product.id);

                                } else {
                                    $scope.errors = data;
                                    $btn.button('reset');
                                    //alert(data);

                                }
                            });
                        }
                        if(!document.getElementById('variantImage').files[0]){
                            var $btn = $('#btn_generate').button('loading');
                            //alert($scope.product.hasVariants);
                            $scope.variant.product_id = $scope.product.id;
                            //modify fvenc menos 1 dia
                            $scope.variant.fvenc.setDate($scope.variant.fvenc.getDate() - 1);
                            //
                            crudService.update($scope.variant,'variants').then(function (data){
                                if (data['estado'] == true) {
                                    //$scope.success = data['nombres'];
                                    alert('Variante modificada con Éxito');
                                    $location.path('/products/show/'+$scope.product.id);

                                } else {
                                    $scope.errors = data;
                                    $btn.button('reset');

                                }
                            });
                        }

                        if(document.getElementById('variantImage').files[0]){
                            r.readAsDataURL(f);
                        }

                    }
                }

                $scope.editProduct = function(row){
                    $location.path('/products/edit/'+row.proId);
                };

                $scope.editProductShow = function(product){
                    //$log.log(product);
                    $location.path('/products/edit/'+product.id);
                }
                  
                $scope.updateProduct = function(){
                    //alert('ho');
                    if ($scope.productCreateForm.$valid) {
                        var $btn = $('#btn_generate').button('loading');
                        var f = document.getElementById('productImage').files[0] ? document.getElementById('productImage').files[0] : null;
                        //alert(f);
                        var r = new FileReader();
                        r.onloadend = function(e) {
                            $scope.product.image = e.target.result;
                        crudService.update($scope.product,'products').then(function(data)
                        {
                            if(data['estado'] == true){
                                $scope.success = data['nombres'];
                                alert('editado correctamente');
                                $location.path('/products');
                            }else{
                                $scope.errors =data;
                                $btn.button('reset');
                            }
                        });
                        }
                        if(!document.getElementById('productImage').files[0]){
                            var $btn = $('#btn_generate').button('loading');
                            //alert('ho');
                        crudService.update($scope.product,'products').then(function(data)
                        {
                            if(data['estado'] == true){
                                $scope.success = data['nombres'];
                                alert('editado correctamente');
                                $location.path('/products');
                            }else{
                                $scope.errors =data;
                                $btn.button('reset');
                            }
                        });}

                        if(document.getElementById('productImage').files[0]){
                            r.readAsDataURL(f);
                        }
                    }
                };

                $scope.deleteProduct = function(row){
                    $scope.product = row;
                    //$log.log($scope.product);
                }

                $scope.cancelProduct = function(){
                    $scope.product = {};
                }

                $scope.destroyProduct = function(){
                    crudService.destroy($scope.product,'products').then(function(data)
                    {
                        if(data['estado'] == true){
                            $scope.success = data['nombre'];
                            $scope.product = {};
                            //alert('hola');
                            $route.reload();

                        }else{
                            $scope.errors = data;
                        }
                    });
                }

                $scope.deleteVariant = function(row){
                    $scope.variant = row;
                    //$log.log($scope.product);
                }
                $scope.cancelVariant = function(){
                    $scope.variant = {};
                }
                $scope.destroyVariant = function(){
                    crudService.destroy($scope.variant,'variants').then(function(data)
                    {
                        if(data['estado'] == true){
                            $scope.success = data['nombre'];
                            $scope.variant = {};
                            //alert('hola');
                            $route.reload();

                        }else{
                            $scope.errors = data;
                        }
                    });
                }

                $scope.disableProduct = function(row){
                    //$log.log(row);
                    crudService.byforeingKey('products','disableprod',row.proId).then(function(data)
                    {
                        if(data['estado'] == true){
                            $route.reload();
                        }else{
                            alert('No se pudo cambiar el estado');
                        }
                    });
                }

                $scope.disableVariant = function(row){
                    crudService.byforeingKey('variants','disablevar',row.id).then(function(data)
                    {
                        if(data['estado'] == true){
                            $route.reload();
                        }else{
                            alert('No se pudo cambiar el estado');
                        }
                    });
                }
                /*
                fx de variants
                 */

                $scope.addVariant = function(product_id){
                    $location.path('/variants/create/'+product_id);
                    //$scope.product = {nombre:'holi'};
                }

                $scope.showVariants = function(row){
                    $scope.variants = [];
                    crudService.byforeingKey('variants','variants',row.proId).then(function(data)
                    {
                            $scope.variants = data;
                    })
                    //crudService.
                }
                $scope.agregarenGrupo=function(){
                     if($scope.variant.checkTallas==true){
                        $scope.variant.track=false;
                        $scope.variant.autogenerado=true;
                        $scope.variant.detAtr[1].descripcion='';
                     }else{
                         $scope.variant.track=true;
                         $scope.ArrayTalla={};
                         $scope.ArrayTallas=[];
                         $scope.variant.talla=[];
                         $scope.LlenarRangoTallas();
                     }
                }
                
                $scope.editVariant = function(row){
                    $location.path('/variants/edit/'+row.id);
                };
                $scope.material='';
                /*$scope.capAttr1 = function(attr_id){
                    //alert(attr_id);
                    $scope.material='';
                    //alert($scope.variant.detAtr[3].descripcion);
                    var separador = " ";
                    var aregloSubcadena=new Array();
                   if(attr_id == 1 || attr_id == 4) {
                    if($scope.product.type){} else{$scope.product.type = { nombre : ''}}
                         
                          $scope.variant.codigo = $scope.product.codigo + $scope.product.type.nombre.charAt(0);
                     if(attr_id == 4){
                      var aregloSubcadena=$scope.variant.detAtr[3].descripcion.split(separador);
                      $scope.material= aregloSubcadena[0].substring(0,1);
                      
                      if(parseInt(aregloSubcadena.length)>1){
                        
                        $scope.material= aregloSubcadena[0].substring(0,1)+aregloSubcadena[1].substring(0,1);
                      }else{
                        $scope.material= aregloSubcadena[0].substring(0,2);
                      }
                     }
                         /*$scope.material= $scope.material+$scope.variant.detAtr[3].descripcion.substring(0, 1);
                         for(var n=0;n<$scope.variant.detAtr[3].descripcion.length;n++){
                            alert(n);
                            alert($scope.variant.detAtr[3].descripcion.substring(n,1));
                             if($scope.variant.detAtr[3].descripcion.substring(n,1)==' '){
                                //alert(aqui);
                                $scope.material=$scope.material+$scope.variant.detAtr[3].descripcion.substring(n+1,1);
                             }
                         }
                         alert($scope.material);
                         if(attr_id == 4 && $scope.variant.detAtr[0].descripcion!=undefined){
                            $scope.variant.codigo=$scope.variant.codigo+$scope.variant.detAtr[0].descripcion.substring(0, 2)+ $scope.material.toLowerCase();
                         }else{

                               if(attr_id == 1 && $scope.variant.detAtr[3].descripcion!=undefined){
                               $scope.variant.codigo=$scope.variant.codigo+$scope.variant.detAtr[0].descripcion.substring(0, 2)+ $scope.material.toLowerCase();
                               }else{
                                   if(attr_id == 1 ){
                                      $scope.variant.codigo=$scope.variant.codigo+$scope.variant.detAtr[0].descripcion.substring(0, 2);
                                   }else{
                                      $scope.variant.codigo=$scope.variant.codigo+ $scope.material.toLowerCase();
                                   }
                               }*
                         }
                    }
                 }*/
               /* $scope.capAttr = function(attr_id){
                    //alert(attr_id);
                    //alert($scope.variant.detAtr[3].descripcion);
                    var separador = " ";
                    var aregloSubcadena=new Array();
                   if(attr_id == 1 || attr_id == 4) {
                    if($scope.product.type){} else{$scope.product.type = { nombre : ''}}
                         
                          $scope.variant.codigo = $scope.product.codigo + $scope.product.type.nombre.charAt(0);
                     if(attr_id == 4){
                      var aregloSubcadena=$scope.variant.detAtr[3].descripcion.split(separador);
                      $scope.material= aregloSubcadena[0].substring(0,1);
                      
                      if(parseInt(aregloSubcadena.length)>1){
                        
                        $scope.material= aregloSubcadena[0].substring(0,1)+aregloSubcadena[1].substring(0,1);
                      }else{
                        $scope.material= aregloSubcadena[0].substring(0,2);
                      }
                     }
                         /*$scope.material= $scope.material+$scope.variant.detAtr[3].descripcion.substring(0, 1);
                         for(var n=0;n<$scope.variant.detAtr[3].descripcion.length;n++){
                            alert(n);
                            alert($scope.variant.detAtr[3].descripcion.substring(n,1));
                             if($scope.variant.detAtr[3].descripcion.substring(n,1)==' '){
                                //alert(aqui);
                                $scope.material=$scope.material+$scope.variant.detAtr[3].descripcion.substring(n+1,1);
                             }
                         }
                         alert($scope.material);
                         if(attr_id == 4 && $scope.variant.detAtr[0].descripcion!=undefined){
                            $scope.variant.codigo=$scope.variant.codigo+$scope.variant.detAtr[0].descripcion.substring(0, 2)+ $scope.material.toLowerCase();
                         }else{

                               if(attr_id == 1 && $scope.variant.detAtr[3].descripcion!=undefined){
                               $scope.variant.codigo=$scope.variant.codigo+$scope.variant.detAtr[0].descripcion.substring(0, 2)+ $scope.material.toLowerCase();
                               }else{
                                   if(attr_id == 1 ){
                                      $scope.variant.codigo=$scope.variant.codigo+$scope.variant.detAtr[0].descripcion.substring(0, 2);
                                   }else{
                                      $scope.variant.codigo=$scope.variant.codigo+ $scope.material.toLowerCase();
                                   }
                               }
                         }
                    }
                 }*/

                //var trouble;
                $scope.asignarDescr = function(index){
                    //$log.log($scope.trouble);

                    if(isEmpty(trouble)){
                        //alert('arriba');
                        crudService.byforeingKey('variants','getAttr',$routeParams.id).then(function(data){
                            trouble = data.det_atr;
                            $log.log(trouble);

                            var isCool = $.grep(trouble, function (e) {
                                return e.atribute_id == $scope.variant.detAtr[index].atribute_id;
                            });
                            //$log.log(isCool[0].descripcion);
                            if (isCool.length != 0) {
                                $scope.variant.detAtr[index].descripcion = isCool[0].descripcion;
                            }
                        })
                    }else{
                            //alert('abajo');
                            var isCool = $.grep(trouble, function (e) {
                                return e.atribute_id == $scope.variant.detAtr[index].atribute_id;
                            });
                            //$log.log(isCool[0].descripcion);
                            if (isCool.length != 0) {
                                $scope.variant.detAtr[index].descripcion = isCool[0].descripcion;
                            }
                    }
                }

                $scope.traerPres = function(preBase){
                    //$log.log(preBase);
                    if($location.path() != '/variants/create/'+$routeParams.product_id && $location.path() != '/variants/edit/'+$routeParams.id) {
                        crudService.byforeingKey('presentations', 'all_by_base', preBase).then(function (data) {
                            $scope.presentations = data;
                            //$log.log( $scope.presentations);
                            //$scope.presentations.push({id:$scope.product.presentation_base.id,nombre:'holi'});
                            $scope.presentations.unshift({
                                id: $scope.product.presentation_base_object.id,
                                nombre: $scope.product.presentation_base_object.nombre,
                                shortname: $scope.product.presentation_base_object.shortname,
                                cant: 'Pre. base'
                            });
                            $scope.presentationSelect = $scope.presentations[0];
                        });
                    }
                    if($location.path() == '/variants/create/'+$routeParams.product_id || $location.path() == '/variants/edit/'+$routeParams.id){
                        crudService.byforeingKey('presentations','all_by_base',preBase).then(function(data){
                            //$scope.selectPres();
                            $scope.selectPres();
                            $scope.presentations = data;
                            //$log.log( $scope.presentations);
                            //$scope.presentations.push({id:$scope.product.presentation_base.id,nombre:'holi'});
                            $scope.presentations.unshift({
                                id:$scope.variant.presentation_base_object.id,
                                nombre:$scope.variant.presentation_base_object.nombre,
                                shortname:$scope.variant.presentation_base_object.shortname,
                                cant:'Pre. base'
                            });
                            $scope.presentationSelect = $scope.presentations[0];
                        });
                    }

                }

                $scope.traerPresX = function(preBase){
                    if($location.path() != '/variants/create/'+$routeParams.product_id && $location.path() != '/variants/edit/'+$routeParams.id) {
                        crudService.byforeingKey('presentations', 'all_by_base', preBase).then(function (data) {
                            $scope.presentations = data;
                            //$log.log( $scope.presentations);
                            //$scope.presentations.push({id:$scope.product.presentation_base.id,nombre:'holi'});
                            $scope.presentations.unshift({
                                id: $scope.product.presentation_base_object.id,
                                nombre: $scope.product.presentation_base_object.nombre,
                                shortname: $scope.product.presentation_base_object.shortname,
                                cant: 'Pre. base'
                            });
                            $scope.presentationSelect = $scope.presentations[0];
                        });
                    }
                    if($location.path() == '/variants/create/'+$routeParams.product_id || $location.path() == '/variants/edit/'+$routeParams.id){
                        crudService.byforeingKey('presentations','all_by_base',preBase).then(function(data){
                            //$scope.selectPres();
                            if(!$scope.presentation.edit) $scope.selectPres();
                            $scope.presentations = data;
                            //$log.log( $scope.presentations);
                            //$scope.presentations.push({id:$scope.product.presentation_base.id,nombre:'holi'});
                            $scope.presentations.unshift({
                                id:$scope.variant.presentation_base_object.id,
                                nombre:$scope.variant.presentation_base_object.nombre,
                                shortname:$scope.variant.presentation_base_object.shortname,
                                cant:'Pre. base'
                            });
                            $scope.presentationSelect = $scope.presentations[0];
                        });
                    }
                }

                $scope.AddPres = function(){
                    if($location.path() != '/variants/create/'+$routeParams.product_id && $location.path() != '/variants/edit/'+$routeParams.id) {

                        if (typeof ($scope.presentationSelect.preFin_id) !== 'undefined') {
                            $scope.presentationSelect.id = $scope.presentationSelect.preFin_id;
                        }

                        var isYa = $.grep($scope.product.presentations, function (e) {
                            return e.id == $scope.presentationSelect.id;
                        });
                        //$log.log($scope.presentationSelect);
                        //$log.log($scope.product.presentations);
                        //alert("hola")
                        //$log.log("isYa");
                        //$log.log(isYa.length);
                        //if(isYa.length == 0 && $scope.presentationSelect!==null && $scope.presentationSelect.length!== 0) {
                        if (isYa.length == 0 && !isEmpty($scope.presentationSelect)) {
                            //alert(typeof($scope.presentationSelect.preFin_id));

                            $scope.presentationSelect.suppPri = $scope.presentation.suppPri;
                            $scope.presentationSelect.markup = $scope.presentation.markup;
                            $scope.presentationSelect.price = $scope.presentation.price;
                            $scope.product.presentations.push($scope.presentationSelect);
                            //$log.log($scope.product.presentations);
                            $scope.presentation = {};
                            $scope.presentationSelect = {};
                            $scope.presentation.suppPri = 0;
                            $scope.presentation.markup = 0;
                            $scope.presentation.price = 0;
                        } else {
                            alert('Item duplicado o vacío');
                        }
                    }
                    if($location.path() == '/variants/create/'+$routeParams.product_id || $location.path() == '/variants/edit/'+$routeParams.id){

                        //alert('hola');

                        if (typeof ($scope.presentationSelect.preFin_id) !== 'undefined') {
                            $scope.presentationSelect.id = $scope.presentationSelect.preFin_id;
                        }

                        var isYa2 = $.grep($scope.variant.presentations, function (e) {
                            return e.id == $scope.presentationSelect.id;
                        });
                        //$log.log($scope.presentationSelect);
                        //$log.log($scope.product.presentations);
                        //$log.log(isYa);
                        //if(isYa.length == 0 && $scope.presentationSelect!==null && $scope.presentationSelect.length!== 0) {
                        if (isYa2.length == 0 && !isEmpty($scope.presentationSelect)) {
                            //alert(typeof($scope.presentationSelect.preFin_id));

                            $scope.presentationSelect.suppPri = $scope.presentation.suppPri;
                            $scope.presentationSelect.markup = $scope.presentation.markup;
                            $scope.presentationSelect.price = $scope.presentation.price;

                            //new data
                            $scope.presentationSelect.suppPriDol = $scope.presentation.suppPriDol;
                            $scope.presentationSelect.markupCant = $scope.presentation.markupCant;
                            $scope.presentationSelect.cambioDolar = $scope.presentation.cambioDolar;
                            //descto normal
                            $scope.presentationSelect.dscto = $scope.presentation.dscto;
                            $scope.presentationSelect.dsctoCant = $scope.presentation.dsctoCant;
                            $scope.presentationSelect.pvp = $scope.presentation.pvp;
                            //dsctos por rango de fechas
                            var monthFecIni = parseInt($scope.presentation.fecIniDscto.getMonth())+1;
                            var monthFecFin = parseInt($scope.presentation.fecFinDscto.getMonth())+1;
                            $scope.presentationSelect.fecIniDscto = $scope.presentation.fecIniDscto.getFullYear()+'-'+ monthFecIni+'-'+$scope.presentation.fecIniDscto.getDate();
                            $scope.presentationSelect.fecFinDscto = $scope.presentation.fecFinDscto.getFullYear()+'-'+ monthFecFin+'-'+$scope.presentation.fecFinDscto.getDate();
                            $scope.presentationSelect.dsctoRange = $scope.presentation.dsctoRange;
                            $scope.presentationSelect.dsctoCantRange = $scope.presentation.dsctoCantRange;
                            $scope.presentationSelect.pvpRange = $scope.presentation.pvpRange;
                            $scope.presentationSelect.activateDsctoRange = $scope.presentation.activateDsctoRange;
                            //
                            $scope.variant.presentations.push($scope.presentationSelect);

                            $log.log($scope.variant.presentations);
                            $scope.presentation = {};
                            $scope.presentationSelect = {};
                            $scope.presentation.suppPri = 0;
                            $scope.presentation.markup = 0;
                            $scope.presentation.price = 0;
                            //alert('hola');
                            //$scope.presentation.activateDsctoRange= false;
                        } else {
                            alert('Item duplicado o vacío');
                        }
                    }
                }

                $scope.editPres = function(row,$index){
                    //alert('hola');
                    $scope.presentation.edit = true;
                    $scope.traerPresX($scope.variant.presentation_base);
                    $log.log(row);
                    //$scope.presentationSelect = {};
                    $scope.presentation.suppPri = row.suppPri;
                    $scope.presentation.markup = row.markup;
                    $scope.presentation.price = row.price;

                    //new data
                    $scope.presentation.suppPriDol = row.suppPriDol;
                    $scope.presentation.markupCant = row.markupCant;
                    $scope.presentation.cambioDolar = row.cambioDolar;
                    //descto normal
                    $scope.presentation.dscto = row.dscto;
                    $scope.presentation.dsctoCant = row.dsctoCant;
                    $scope.presentation.pvp = row.pvp;
                    //dsctos por rango de fechas
                    //if(row.fecIniDscto instanceof Date) {
                        //alert('holaxx');
                    var fecIniDscto = new Date(row.fecIniDscto);
                    fecIniDscto.setDate(fecIniDscto.getDate()+1);

                        //var monthFecIni = parseInt(row.fecIniDscto.getMonth()) + 1;
                    $scope.presentation.fecIniDscto = fecIniDscto;
                        //$scope.presentation.fecIniDscto = row.fecIniDscto.getFullYear() + '-' + monthFecIni + '-' + row.fecIniDscto.getDate();
                    //}
                    var fecFinDscto = new Date(row.fecFinDscto);
                    fecFinDscto.setDate(fecFinDscto.getDate()+1);
                    $scope.presentation.fecFinDscto = fecFinDscto;
                    //if(row.fecFinDscto instanceof Date) {
                        //var monthFecFin = parseInt(row.fecFinDscto.getMonth()) + 1;
                        //$scope.presentation.fecFinDscto = row.fecFinDscto.getFullYear() + '-' + monthFecFin + '-' + row.fecFinDscto.getDate();
                    //}
                    $scope.presentation.dsctoRange = row.dsctoRange;
                    $scope.presentation.dsctoCantRange = row.dsctoCantRange;
                    $scope.presentation.pvpRange = row.pvpRange;

                    $scope.presentation.identificador = $index;

                    //alert(row.activateDsctoRange);

                    row.activateDsctoRange == '1' ? row.activateDsctoRange = true : row.activateDsctoRange = false;

                    $scope.presentation.activateDsctoRange = row.activateDsctoRange;
                    $scope.calDescuento1();
                    $scope.calDescuento2();
                    $('#presentation').modal('show');
                }

                $scope.UpdatePres = function(){
                    if($location.path() == '/variants/create/'+$routeParams.product_id || $location.path() == '/variants/edit/'+$routeParams.id){
                        $scope.variant.presentations[$scope.presentation.identificador].suppPri = $scope.presentation.suppPri;
                        $scope.variant.presentations[$scope.presentation.identificador].markup = $scope.presentation.markup;
                        $scope.variant.presentations[$scope.presentation.identificador].price = $scope.presentation.price;

                        //new data
                        $scope.variant.presentations[$scope.presentation.identificador].suppPriDol = $scope.presentation.suppPriDol;
                        $scope.variant.presentations[$scope.presentation.identificador].markupCant = $scope.presentation.markupCant;
                        $scope.variant.presentations[$scope.presentation.identificador].cambioDolar = $scope.presentation.cambioDolar;
                        //descto normal
                        $scope.variant.presentations[$scope.presentation.identificador].dscto = $scope.presentation.dscto;
                        $scope.variant.presentations[$scope.presentation.identificador].dsctoCant = $scope.presentation.dsctoCant;
                        $scope.variant.presentations[$scope.presentation.identificador].pvp = $scope.presentation.pvp;
                        //dsctos por rango de fechas
                        var monthFecIni = parseInt($scope.presentation.fecIniDscto.getMonth())+1;
                        var monthFecFin = parseInt($scope.presentation.fecFinDscto.getMonth())+1;
                        $scope.variant.presentations[$scope.presentation.identificador].fecIniDscto = $scope.presentation.fecIniDscto.getFullYear()+'-'+ monthFecIni+'-'+$scope.presentation.fecIniDscto.getDate();
                        $scope.variant.presentations[$scope.presentation.identificador].fecFinDscto = $scope.presentation.fecFinDscto.getFullYear()+'-'+ monthFecFin+'-'+$scope.presentation.fecFinDscto.getDate();
                        $scope.variant.presentations[$scope.presentation.identificador].dsctoRange = $scope.presentation.dsctoRange;
                        $scope.variant.presentations[$scope.presentation.identificador].dsctoCantRange = $scope.presentation.dsctoCantRange;
                        $scope.variant.presentations[$scope.presentation.identificador].pvpRange = $scope.presentation.pvpRange;
                        $scope.variant.presentations[$scope.presentation.identificador].activateDsctoRange =$scope.presentation.activateDsctoRange;
                    }
                }

                $scope.deletePres = function($index){
                    if($location.path() != '/variants/create/'+$routeParams.product_id && $location.path() != '/variants/edit/'+$routeParams.id) {
                        $scope.product.presentations.splice($index, 1);
                    }
                    if($location.path() == '/variants/create/'+$routeParams.product_id || $location.path() == '/variants/edit/'+$routeParams.id) {
                        $scope.variant.presentations.splice($index, 1);
                    }
                }

                $scope.selectPres = function(){
                    $scope.presentation.suppPri = 0;
                    $scope.presentation.markup = 0;
                    $scope.presentation.price = 0;
                    $scope.presentation.markupCant = 0;
                    $scope.presentation.suppPriDol = 0;

                    //desctos
                    $scope.presentation.dscto = 0;
                    $scope.presentation.dsctoCant = 0;
                    $scope.presentation.pvp = 0;
                    $scope.presentation.fecIniDscto = new Date();
                    $scope.presentation.fecFinDscto = new Date();
                    $scope.presentation.dsctoRange = 0;
                    $scope.presentation.dsctoCantRange = 0;
                    $scope.presentation.pvpRange = 0;

                    $scope.presentation.cambioDolar = 3.00;
                    //
                    $scope.presentation.edit = false;
                    $scope.presentation.identificador = -1;
                    $scope.presentation.activateDsctoRange = false;
                }

                $scope.changePreBase = function(){
                    //$log.log($scope.product.presentation_base_object);cartItems.length > 0
                    if($location.path() != '/variants/create/'+$routeParams.product_id && $location.path() != '/variants/edit/'+$routeParams.id) {
                        if ($scope.product.presentation_base_object !== null && !isEmpty($scope.product.presentation_base_object)) {
                            $scope.product.presentation_base = $scope.product.presentation_base_object.id;
                            $scope.product.presentations = [];
                            //alert('borra if');
                            $scope.enabled_presentation_button = false;
                            $scope.enabled_createpresentation_button = false;
                        } else {
                            $scope.enabled_presentation_button = true;
                            $scope.enabled_createpresentation_button = true;
                            $scope.product.presentation_base = null;
                            $scope.product.presentations = [];
                            //alert('borra else');
                        }
                    }
                    if($location.path() == '/variants/create/'+$routeParams.product_id || $location.path() == '/variants/edit/'+$routeParams.id) {
                        if ($scope.variant.presentation_base_object !== null && !isEmpty($scope.variant.presentation_base_object)) {
                            $scope.variant.presentation_base = $scope.variant.presentation_base_object.id;
                            $scope.variant.presentations = [];
                            //alert('borra if');
                            $scope.enabled_presentation_button = false;
                            $scope.enabled_createpresentation_button = false;
                        } else {
                            $scope.enabled_presentation_button = true;
                            $scope.enabled_createpresentation_button = true;
                            $scope.variant.presentation_base = null;
                            $scope.variant.presentations = [];
                            //alert('borra else');
                        }
                    }

                }

                $scope.createPres = function(unidad_base){
                    $scope.preAdd.preBase_id = unidad_base;
                    //$log.log($scope.preAdd);
                    crudService.create($scope.preAdd, 'presentations').then(function (data) {
                        if (data['estado'] == true) {
                            $scope.presentations.push({
                                id:data['presentation'].id,
                                nombre:data['presentation'].nombre,
                                shortname:data['presentation'].shortname,
                                cant:data['equiv'].cant
                            })
                            $scope.preAdd = {};
                            alert('Presentacion creada con éxito');
                        } else {
                            $scope.errors = data;
                        }
                    });

                }

                $scope.showStock = function(product_id){
                    crudService.byforeingKey('stocks','traerstock',product_id).then(function (data){
                        $scope.stockVariants = data;
                    })
                }

                /*

                Agregar Marca, Linea, Station, MAterial, Atributo

                 */
                $scope.addBrand = function (size) {

                    var modalInstance = $modal.open({
                        animation: false,
                        templateUrl: 'myModalContent.html',
                        controller: 'ModalInstanceCtrl',
                        size: 'sm',
                        /*resolve: {
                            items: function () {
                                return $scope.items;
                            }
                        }*/
                    });

                    modalInstance.result.then(function (selectedItem) {
                        //$scope.selected = selectedItem;
                    }, function () {
                        //$log.info('Modal dismissed at: ' + new Date());
                        crudService.select('products', 'brands').then(function (data) {
                            $scope.brands = data;
                        });

                    });
                };
                $scope.addLine = function (size) {

                    var modalInstance = $modal.open({
                        animation: false,
                        templateUrl: 'myModalContent2.html',
                        controller: 'ModalInstanceCtrl2',
                        size: 'sm',
                        /*resolve: {
                         items: function () {
                         return $scope.items;
                         }
                         }*/
                    });

                    modalInstance.result.then(function (selectedItem) {
                        //$scope.selected = selectedItem;
                    }, function () {
                        //$log.info('Modal dismissed at: ' + new Date());
                        crudService.select('products', 'types').then(function (data) {
                            $scope.types = data;
                        });

                    });
                };
                $scope.addMaterial = function (size) {

                    var modalInstance = $modal.open({
                        animation: false,
                        templateUrl: 'myModalContent3.html',
                        controller: 'ModalInstanceCtrl3',
                        size: 'sm',
                        /*resolve: {
                         items: function () {
                         return $scope.items;
                         }
                         }*/
                    });

                    modalInstance.result.then(function (selectedItem) {
                        //$scope.selected = selectedItem;
                    }, function () {
                        //$log.info('Modal dismissed at: ' + new Date());
                        crudService.select('products', 'materials').then(function (data) {
                            $scope.materials = data;
                        });

                    });
                };
                $scope.partCod1="";
                $scope.partCod2="";
                $scope.generarCodigoProduct=function(){
                    var separador = " ";
                    var aregloSubcadena=new Array();
                   // var aregloSubcadena=$scope.variant.detAtr[3].descripcion.split(separador);
                    //$log.log($scope.product.brand_id);
                    crudService.byId($scope.product.brand_id,'brands').then(function (data) {
                        //alert(data.nombre);
                        var aregloSubcadena=data.nombre.split(separador);

                        var nombreCorti=data.shortname;
                          crudService.all('encontrarUltimo').then(function (data) {
                          if(aregloSubcadena.length>1){
                            $scope.partCod1=(nombreCorti).toUpperCase()+"/";
                          }else{                            

                            $scope.partCod1=(nombreCorti).toUpperCase()+"/";
                          }
                          if($scope.partCod2==undefined ||  $scope.partCod2==''){
                               $scope.product.codigo=$scope.partCod1+data.id;
                          }else{
                               $scope.product.codigo=$scope.partCod2+$scope.partCod1+data.id;
                          }
                      //});

                           
                         // alert($location.path()+" "+id);
                          if($location.path() == '/products/edit/'+id){
                            
                                 if($scope.partCod2==undefined ||  $scope.partCod2==''){
                                      $scope.product.codigo=$scope.partCod1+$scope.agregaCeros(Number(id));
                                 }else{
                                      $scope.product.codigo=$scope.partCod2+$scope.partCod1+$scope.agregaCeros(Number(id));
                                 }
                         }else{
                                 if($scope.partCod2==undefined ||  $scope.partCod2==''){
                                      $scope.product.codigo=$scope.partCod1+$scope.agregaCeros(Number(data.id)+1);
                                 }else{
                                      $scope.product.codigo=$scope.partCod2+$scope.partCod1+$scope.agregaCeros(Number(data.id)+1);
                                 }
                         }
                      }); 
                    });
                }
                $scope.generarCodigoProduct2=function(){
                    var separador = " ";
                    var aregloSubcadena=new Array();
                   // var aregloSubcadena=$scope.variant.detAtr[3].descripcion.split(separador);
                    //$log.log($scope.product.brand_id);
                    crudService.byId($scope.product.type_id,'types').then(function (data) {
                        var aregloSubcadena=data.nombre.split(separador);
                        var nombreCorti=data.shortname;
                        crudService.all('encontrarUltimo').then(function (data) {
                       // alert(data.nombre);
                        
                        if(aregloSubcadena.length>1){
                            $scope.partCod2=(nombreCorti).toUpperCase()+"/";
                          }else{   
                            $scope.partCod2=(nombreCorti).toUpperCase()+"/";
                          }
                          if($scope.partCod1==undefined ||  $scope.partCod1==''){
                               $scope.product.codigo=$scope.partCod2+data.id;
                          }else{
                               $scope.product.codigo=$scope.partCod2+$scope.partCod1+data.id;
                          }

                           
                          if($location.path() == '/products/edit/'+id){
                                         if($scope.partCod1==undefined ||  $scope.partCod1==''){
                                              $scope.product.codigo=$scope.partCod2+$scope.agregaCeros(Number(id));
                                         }else{
                                              $scope.product.codigo=$scope.partCod2+$scope.partCod1+$scope.agregaCeros(Number(id));
                                         }
                         }else{
                                       if($scope.partCod1==undefined ||  $scope.partCod1==''){
                                              $scope.product.codigo=$scope.partCod2+$scope.agregaCeros(Number(data.id)+1);
                                         }else{
                                              $scope.product.codigo=$scope.partCod2+$scope.partCod1+$scope.agregaCeros(Number(data.id)+1);
                                         }
                         }
                      });
                        
                    });
                }
                $scope.agregaCeros=function(num){
                       if(num<10){
                          return '000'+num;
                       }
                       if(num>9 && num<100){
                          return '00'+num;
                       }
                       if(num>99 && num<1000){
                          return '0'+num;
                       }
                       if(num>999 && num<10000){
                          return num;
                       }
                }
                $scope.addStation = function (size) {

                    var modalInstance = $modal.open({
                        animation: false,
                        templateUrl: 'myModalContent4.html',
                        controller: 'ModalInstanceCtrl4',
                        size: 'sm',
                        /*resolve: {
                         items: function () {
                         return $scope.items;
                         }
                         }*/
                    });

                    modalInstance.result.then(function (selectedItem) {
                        //$scope.selected = selectedItem;
                    }, function () {
                        //$log.info('Modal dismissed at: ' + new Date());
                        crudService.select('products', 'stations').then(function (data) {
                            $scope.stations = data;
                        });

                    });
                };
                $scope.ArrayTallas =[];
                $scope.ArrayTalla ={};
                $scope.variants1=[];
                $scope.variant1={};
                $scope.variant.checkTallas=false;
                $scope.obcional=0;
                $scope.h=0;
                $scope.LlenarRangoTallas=function(fin,ini){
                   // alert(fin);
                    $scope.ArrayTalla={};
                    $scope.ArrayTallas=[];
                    $scope.variant.talla=[];
                    $scope.obcional=0;
                    ///alert("hola que tal"+$scope.can);
                   // if($scope.obcional==0){
                      //  alert("estoy en cero");
                        $scope.can=parseInt(fin)-parseInt(ini);
                          for(var n=0;n<=$scope.can;n++)
                        {   
                            $scope.obcional=ini+n;
                            $scope.ArrayTalla[n]=$scope.obcional; 
                            $scope.ArrayTallas.push($scope.ArrayTalla);
                            $scope.h++;
                       // alert(n);
                        }

                   /* }else{
                        alert("no estoy en cero"+$scope.obcional+"/"+$scope.h);
                        $scope.can=parseInt(fin)-$scope.obcional;
                         for(var t=0;t<$scope.can;t++)
                        {   
                            
                            $scope.obcional++;
                            $scope.ArrayTalla[$scope.obcional]=$scope.obcional; 
                            $scope.ArrayTallas.push($scope.ArrayTalla);
                            $scope.h++;
                        }
                   }*/
                }
               $scope.generarVariantes=function(cant,index){
                ///alert("hola estoy llenando variantes"+index);
                   $scope.variant1[index]=cant;
                   $scope.variants1.push($scope.variant1);
               }
               $scope.validarNombre=function(){
                   alert("Usted no puede crear dos productos con el mismo nombre");
                   $scope.product.nombre='';
                   crudService.paginate('products',1).then(function (data) {
                        $scope.products = data.data;
                   });
               }
               $scope.validaNombre2=function(texto){
                 if(texto!=undefined){
                    //alert(texto);
                  crudService.validar('products',texto).then(function (data){
                        //$scope.products = data;
                        //alert(data.nombre);
                        if(data.nombre!=undefined){
                           alert("Usted no puede crear dos productos con el mismo nombre");
                           $scope.product.nombre=''; 
                        }
                    });
                 }
               }
               $scope.validanomMarca=function(texto){
                //alert('hola');
                    if(texto!=undefined){
                        crudService.search('brands',texto,1).then(function (data){
                        $scope.materials = data.data;
                        if($scope.materials!=null){
                           alert("Usted no puede crear dos Marcas con el mismo nombre");
                           $scope.product.nombre=''; 
                        }
                    });
                    }
               }
                $scope.addAttribute = function (size) {

                    var modalInstance = $modal.open({
                        animation: false,
                        templateUrl: 'myModalContent5.html',
                        controller: 'ModalInstanceCtrl5',
                        size: 'sm',
                        /*resolve: {
                         items: function () {
                         return $scope.items;
                         }
                         }*/
                    });

                    modalInstance.result.then(function (selectedItem) {
                        //$scope.selected = selectedItem;
                    }, function () {
                        //$log.info('Modal dismissed at: ' + new Date());
                        crudService.all('atributes').then(function (data){
                            $scope.attributes = data.data;
                            //$log.log($scope.attributes);
                        })

                    });
                };

                $scope.opcAtr = [];
                $scope.opcAtr[1] = ['NEGRO','BLANCO','ROJO','AZUL','MARRÓN','VINO','NUDE','BEIGE','TURQUESA'];
                $scope.opcAtr[2] = ['18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45'];
                $scope.opcAtr[3] = ['3','5','7','9','10','11','12','13','15','18','20','21'];
                $scope.opcAtr[4] = ['CUERO LISO','CUERO GAMUZA','CUERO CHAROL','SINTÉTICO LISO','SINTÉTICO GAMUZA','SINTÉTICO CHAROL','TELA'];

                

                /*
                Fin de add
                 */

                function isEmpty(obj) {
                    return Object.keys(obj).length === 0;
                }


            }]);
})();
