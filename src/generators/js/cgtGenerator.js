'use strict'
// const rename = require('gulp-rename')
const fs = require('fs-extra')
const ejs = require('ejs')

export default {
  /* constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument('appname', { type: String});

    // And you can then access it later; e.g.
    this.log(this.options.appname);
  } */

  writing (mv, cgt, cntPath) {
    return new Promise(function (resolve) {
      let dirCGT = cntPath + '/cgt/' + cgt.nombreCGT
      let dirType = dirCGT + '/' + cgt.nombreCGT

      for (let type of cgt.mvcd) {
        ejs.renderFile('src/generators/templates/cgt/' + type, cgt, (err, str) => {
          !err ? fs.outputFileSync(dirType + '_' + type.replace('ejs', 'js'), str) : console.log(err)
        })
      }

      ejs.renderFile('src/generators/templates/cgt/lang/es_ES.json', cgt, (err, str) => {
        !err ? fs.outputFileSync(dirCGT + '/lang/' + cgt.nombreCGT + '_es_ES.json', str) : console.log(err)
        resolve()
      })
    })
  },
  readFile (mv, myfile, hookTelco, replace1, services) {
    fs.readFile(myfile, 'utf8', (err, data) => {
      if (!err) {
        if (data.indexOf(hookTelco) !== -1) {
          for (let j in services) {
            let serviceData = replace1.replace(new RegExp('__service__', 'g'), services[j])
            data = data.replace(hookTelco, `${serviceData}
              ${hookTelco}`)
          }
          fs.writeFile(myfile, data)
          mv.cgtCreated = true
        } else {
        //  mv.dialogError = true
        }
      }
    })
  },
  generate (mv, cgt, cntPath) {
    for (let type of cgt.mvcd) {
      if (type[0] !== 'v' || (cgt.mvcdMap.indexOf(type[0]) === -1 && type[0] !== 'v')) cgt.mvcdMap.push(type[0])
    }
    console.log(cgt)
    let THIS = this
    let hookTelco = '/*GENERADOR_TELCO*/'
    let appState = `.state('${cgt.nombreCGT}', {
                url: '/${cgt.nombreCGT}',
                templateUrl:  T3_UrlServiceProvider.loadUrlTemplate('${cgt.nombreCGT}'),
                resolve: {
                  loadMyCtrl: ['$ocLazyLoad','T3_UrlService', function($ocLazyLoad,T3_UrlService) {
                    return $ocLazyLoad.load(
                      [
                        /*  Inserta módulos */
                        T3_UrlService.loadModule("ngMessages"),
                        T3_UrlService.loadModule("uiDate"),
                        /* Inserta componentes del CGT */
                        T3_UrlService.loadCG([{name:"${cgt.nombreCGT}",tipos:"${cgt.mvcdMap}"}]),
                        /* Inserta las directivas comunes necesarias para la carga de componentes comunes */
                        T3_UrlService.loadCommonComponent(["T3_CCP_UI_Grid.tablas","T3_CCP_UI_Modales","T3_CCP_UI_datePicker.inputDate"],null)

                    ]);
                  }]
                }
              })`
    if (cgt.isState) {
      fs.readFile(cntPath + '/app.js', 'utf8', (err, data) => {
        if (!err) {
          if (data.indexOf(hookTelco) !== -1) {
            THIS.writing(mv, cgt, cntPath).then(() => {
              fs.writeFile(cntPath + '/app.js', data.replace(hookTelco,
                `${appState}
                ${hookTelco}`))
              mv.cgtCreated = true
            })
          } else {
            mv.dialogError = true
          }
        }
      })
    } else {
      THIS.writing(mv, cgt, cntPath).then(() => {
        mv.cgtCreated = true
      })
    }
  },
  updateCgt (mv, cgt, cntPath) {
    let pathCgt = cntPath + '\\cgt\\' + cgt.nombreCGT
    // let THIS = this
    let hookTelco = '/*GENERADOR_TELCO*/'
    let serviceOp = `      /*<Nota sobre la función>*/
          ${cgt.nombreCGT}Service.__service__ = function(__service___IN) {
              var deferred = $q.defer();
            ${cgt.nombreCGT}Model.__service__(__service___IN).success(function(data) {
                  deferred.resolve(data);
              }).error(function(data, status) {
                  deferred.reject(crearObjetoError(data, status));
              });
              return deferred.promise;
          };`
    let modelOp = `/* <Explicación sobre el comportamiento de la función> */
            ${cgt.nombreCGT}Model.__service__ = function(__service___IN){
                return T3_HTTPService.get(URL_RELATIVE + '__service__.json');
            };`
    let controllerOp = `  $scope.__service__ = function() {
          var __service___IN  = {};
          ${cgt.nombreCGT}Service.__service__(__service___IN ).then(function(data) {
              $scope.${cgt.nombreCGT}>Data.__service__ = data;
          }, function(error) {
              $log.debug('Failed: ' + error.code);
              /* Si necesitas mostrar error de carga descomenta la llamada a la función y carga la función con t3ErrorGetterController*/
              /* $scope.mostrarErrorGetter(error); */
          });`
    let files = fs.readdirSync(pathCgt)
    let replaceString = ''
    for (let file in files) {
      if (fs.lstatSync(pathCgt + '/' + files[file]).isDirectory()) {
        // let files1 = fs.readdirSync(pathCgt + '/' + files[file])
        // for (let file1 in files1) {
        //   this.readFile(mv, pathCgt + '/' + files1[file1], hookTelco, replaceString, '')
        // }
      } else {
        if (files[file].lastIndexOf('_controller') !== -1) {
          replaceString = controllerOp
        } else if (files[file].lastIndexOf('_service') !== -1) {
          replaceString = serviceOp
        } else if (files[file].lastIndexOf('_model') !== -1) {
          replaceString = modelOp
        }
        this.readFile(mv, pathCgt + '/' + files[file], hookTelco, replaceString, cgt.services)
      }
    }
  }
}
