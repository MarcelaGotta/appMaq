<template>
  <div class="left-col">
    <span class="add-dir">
      <el-button type="primary" class="dark" icon="plus" @click="openFile">Directorio</el-button>
    </span>
    <span class="apache">
      Apache:
      <el-switch v-model="apache" on-color="#13ce66" @change="runApache()" off-color="#ff4949"></el-switch>
    </span>
    <el-menu :default-openeds="[namePaths]" class="menu-explorer" theme="dark">
      <el-submenu v-for="(cnt, key) in cntDirs" :index="key">
          <template slot="title" style="font-size:13px"><el-button class="close-boton" @click.stop="deleteDir(cnt.path)" type="primary" icon="close" size="mini"></el-button> {{key}}</template>
          <el-menu-item index="addCNT" class="nuevo-cnt" @click="newCNT(cnt.path)"><i class="el-icon-plus"></i>Nuevo CNT</el-menu-item>
          <el-menu-item :index="value" v-for="value in cnt.cgt" @click="selectCNT(value, cnt.path)">{{value}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  const fs = require('fs-extra')
  const path = require('path')
  const settings = require('electron-settings')
  const childProcess = require('child_process')
  export default {
    data () {
      return {
        dir: {},
        namePaths: '',
        cntDirs: {},
        apache: false,
        apacheOn: false,
        urlApache: 'F:\\programas\\programas\\portable-apache-2.2.17-win32-x86'
      }
    },
    props: ['path'],
    mounted: function () {
      this.urlApache = settings.get('pathapache')
      let mv = this
      mv.generateDirectories()
      mv.$electron.ipcRenderer.on('selected-directory', function (event, path) {
        let typeUrl = settings.get('typeUrl')
        let pathAux = settings.get('path')
        if (!typeUrl && path && pathAux.indexOf(path) === -1) {
          pathAux.push(path[0])
          settings.set('path', pathAux)
          mv.$bus.$emit('path-change', pathAux)
        }
        // mv.$router.push('/generator')
      })
    },
    methods: {
      selectCNT (file, path) {
        this.$bus.$emit('send-path-cnt', `${path}/${file}`)
      },
      newCNT (path) {
        this.$bus.$emit('new-cnt', path)
      },
      runApache () {
        if (this.apache && !this.apacheOn) {
          this.apacheOn = true
          const ls = childProcess.spawn('cmd.exe', ['/c', 'cscript mh.js && httpd'], {cwd: this.urlApache + '\\bin\\'})
          ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`)
            this.apache = true
          })
          ls.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`)
            this.apache = false
            this.apacheOn = false
            this.killApache()
          })
        } else {
          this.killApache()
        }
      },
      killApache () {
        const text = fs.readFileSync(this.urlApache + '\\logs\\httpd.pid', 'utf8')
        const ls = childProcess.exec('taskkill /F /T /pid ' + text, {cwd: this.urlApache + '\\bin\\'})
        ls.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`)
          this.apache = false
          this.apacheOn = false
        })
        ls.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`)
          this.apache = true
          this.apacheOn = true
        })
      },
      openFile () {
        this.$electron.ipcRenderer.send('open-file-dialog')
      },
      deleteDir (path) {
        let pathAux = settings.get('path')
        pathAux = pathAux.filter(pathCNT => pathCNT !== path)
        settings.set('path', pathAux)
        this.$bus.$emit('path-change', pathAux)
      },
      generateDirectories () {
        let mv = this
        mv.cntDirs = {}
        for (let baseDir of mv.path) {
          let dirBase = path.basename(baseDir)
          mv.cntDirs[dirBase] = {
            path: baseDir,
            cgt: []
          }
          fs.readdir(baseDir, (err, files) => {
            for (let file of files) {
              let pathCGT = `${baseDir}/${file}/cgt`
              if (fs.existsSync(pathCGT)) {
                mv.cntDirs[dirBase].cgt.push(file)
              }
            }
            console.log('No falla pero devuelve:' + err)
            mv.$forceUpdate()
          })
        }
      }
    },
    watch: {
      path () {
        this.generateDirectories()
      }
    }
  }
</script>

<style>
  .menu-explorer {
    overflow: hidden;
  }

  .title {
    color: #888;
    font-size: 15px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }

  .items { margin-top: 8px; }

  .item {
    display: flex;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }

  .el-menu--dark .el-submenu__title {
    font-size: 13px !important
  }

  .el-submenu .el-menu-item {
    padding: 0 25px !important;
    font-size: 13px
  }

  .nuevo-cnt {
    background-color: #161f28;
  }

  .apache {
    color: #fff
  }

  button.dark {
    background-color: #161f28;
    border: none
  }
  button.dark:hover, button.dark:active, button.dark:focus, .close-boton:hover, .close-boton:active, .close-boton:focus {
    background-color: #293541;
    border: none
  }

  .close-boton {
    background-color: transparent;
    border: none
  }

  .close-boton i {
    margin: 0 !important;
    color: #bfcbd9;
  }
</style>
