'use strict';

CNT.ngModule.controller('cgtPruebaController', ['$scope', '$log', 'PopupService', 'gettextCatalog', 'cgtPruebaService', 'T3_CommunicationService', 'T3_CabeceraPresentacionService', '$state', 'T3_TrazaService', '$stateParams', 'T3_StateService',
function($scope, $log, PopupService, gettextCatalog, cgtPruebaService, T3_CommunicationService, T3_CabeceraPresentacionService, $state, T3_TrazaService, $stateParams, T3_StateService){

        $scope.init = function(){
            /*Objeto que guarda los datos utilizados por el usuario*/
            $scope.cgtPruebaView = cgtPruebaService.getPreviousView() ;
            /*objeto que contiene los datos necesarios para el correcto funcionalmiento del cgt*/
            $scope.cgtPruebaFunctionality = cgtPruebaService.getPreviousFunctionality();
            /*objeto en el que guardamos los datos traidos del back*/
            $scope.cgtPruebaData =cgtPruebaService.getPreviousData();


             $scope.loadMultilanguage();
            /* Subscribe a la función de Multiidioma*/
            T3_CommunicationService.subscribe($scope, "AlertLanguageChanged", $scope.loadMultilanguage);


            T3_StateService.init($scope, cgtPruebaService, {
                CGT_cgtPrueba_IN : $scope.cgtcgtPruebaIn || $stateParams.cgtcgtPruebaIn
            });

            $scope.cgtPruebaFunctionality.datosPrevios = cgtPruebaService.initialData.CGT_cgtPrueba_IN;

        };
        /*función que carga el multidioma*/
        $scope.loadMultilanguage = function(){
            T3_CabeceraPresentacionService.resolveTranslationsCG('cgtPrueba',gettextCatalog.currentLanguage);
        };

        
        /* Insertar, si es preciso, la función o funciones que obtienen los datos desde el service con t3ControllerGetter*/

}]);