<template>
  <main>
    <el-row>
      <el-col :span="16">
        <el-row type="flex" justify="center">
          <el-col :span="20">
            <h1>
              Bienvenido al generador de CNT y CGTs de Telco 3.0
            </h1>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="24">
            <p>Abre la carpeta donde están alojados el apache con los que vas a trabajar</p>
            <el-button type="primary" @click="openFile('apache')">Abrir apache</el-button>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="24">
            <p>Abre la carpeta donde están alojados el Grunt con el que vas a trabajar</p>
            <el-button type="primary" @click="openFile('grunt')">Abrir Grunt</el-button>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="24">
            <p>Abre la carpeta donde están alojados todos los CNT y CGT con los que vas a trabajar</p>
            <el-button type="primary" @click="openFile('')">Abrir proyecto</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </main>
</template>

<script>
  const settings = require('electron-settings')
  export default {
    name: 'welcome-page',
    data: function () {
      return {
        openExplorer: false,
        typeUrl: ''
      }
    },
    mounted: function () {
      let mv = this
      mv.$electron.ipcRenderer.on('selected-directory', function (event, path) {
        this.typeUrl = settings.get('typeUrl')
        console.log('path' + this.typeUrl + path)
        settings.set('path' + this.typeUrl, path)
        if (!this.typeUrl) {
          mv.$bus.$emit('path-change', path)
        }
        // mv.$router.push('/generator')
      })
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      openFile (typeUrl) {
        this.typeUrl = settings.get('typeUrl')
        settings.set('typeUrl', typeUrl)
        this.$electron.ipcRenderer.send('open-file-dialog')
      }

    }
  }
</script>

<style>
</style>
