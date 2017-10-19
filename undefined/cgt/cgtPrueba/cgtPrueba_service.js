'use strict';
CNT.ngModule.factory('cgtPruebaService', ['$q', 'cgtPruebaModel',
    function( $q ,cgtPruebaModel){

        var cgtPruebaService = {};

        cgtPruebaService.initialData = null;

        var previousData = {
            "view":{},
            "functionality":{},
            "data":{}
        };

        cgtPruebaService.getPreviousView = function(){
            return previousData.view;
        };

        cgtPruebaService.getPreviousFunctionality = function(){
            return previousData.functionality;
        };

        cgtPruebaService.getPreviousData = function(){
            return previousData.data;
        };

        cgtPruebaService.setPreviousData = function(view, functionality,data){
            previousData = {
                "view": view,
                "functionality":functionality,
                "data":data
            };
        };

        
        /*Insertar las funciones que recuperan los datos con t3ServiceFuncion*/

        function crearObjetoError(data, status){
          var errorObj;
          if(status === 500){
            if((data.errorDescription !== undefined) && (data.errorDescription !== null)){
              errorObj = {code:500, mensaje1:data.errorDescription, mensaje2:data.errorId, mensaje3:data.context};
            }else{
              errorObj = {code:status};
            }
          }else{
            errorObj = {code:status};
          }
          return errorObj;
        };

        return cgtPruebaService;
    }]);