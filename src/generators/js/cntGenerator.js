'use strict'
import CgtGenerator from './cgtGenerator'
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

  writing (mv, cnt, cntPath) {
    return new Promise(function (resolve) {
      let dirCNT = `${cntPath}/${cnt.nombreMod}-${cnt.nombreCNT}`
      if (cnt.cgts.length > 0) {
        for (let cgt of cnt.cgts) {
          for (let type of cgt.mvcd) {
            if (type[0] !== 'v' || (cgt.mvcdMap.indexOf(type[0]) === -1 && type[0] !== 'v')) cgt.mvcdMap.push(type[0])
          }
          CgtGenerator.writing(mv, cgt, dirCNT)
        }
      } else {
        fs.ensureDirSync(`${dirCNT}/cgt/`)
      }
      if (cnt.cntdir.length > 0) {
        for (let dir of cnt.cntdir) {
          if (dir === 'css') fs.outputFileSync(`${dirCNT}/${dir}/${cnt.nombreCNT}.css`, '')
          if (dir === 'images') fs.ensureDirSync(`${dirCNT}/${dir}/`)
        }
      }
      ejs.renderFile('src/generators/templates/cnt/app.ejs', cnt, (err, str) => {
        !err ? fs.outputFileSync(`${dirCNT}/app.js`, str) : console.log(err)
      })
      ejs.renderFile('src/generators/templates/cnt/cnt.ejs', cnt, (err, str) => {
        !err ? fs.outputFileSync(`${dirCNT}/cnt.js`, str) : console.log(err)
      })
      ejs.renderFile('src/generators/templates/cnt/index.html', cnt, (err, str) => {
        !err ? fs.outputFileSync(`${dirCNT}/index.html`, str) : console.log(err)
      })
      ejs.renderFile('src/generators/templates/cnt/main.ejs', cnt, (err, str) => {
        !err ? fs.outputFileSync(`${dirCNT}/main.js`, str) : console.log(err)
        resolve()
      })
    })
  },

  generate (mv, cnt, cntPath) {
    this.writing(mv, cnt, cntPath).then(() => {
      mv.cntCreated = true
    })
  }
}
