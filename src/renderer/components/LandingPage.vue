<template>
  <main>
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <h1>
          Bienvenido al generador de CNT y CGTs de Telco 3.0
        </h1>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <p>Antes que nada, necesito que selecciones la carpeta donde vas a generar el cnt, y si lo que quieres hacer es crear un cgt, selecciona la carpeta del cnt que tendrá este cgt</p>
        <el-button type="primary" @click="openFile">Seleccionar</el-button>
        <span v-show="pathSelected">Ubicación: {{ pathSelected }}</span>
      </el-col>
    </el-row>
    <router-link v-show="pathSelected" to="/generator">Siguiente</router-link>
  </main>
</template>

<script>
  const fs = require('fs')
  export default {
    name: 'landing-page',
    data: function () {
      return {
        pathSelected: null
      }
    },
    beforeCreate: function () {
    //  let mv = this
      console.log(fs)
      // mv.$electron.ipcRenderer.on('selected-directory', function (event, path) {
      //   const typeUrl = settings.get('typeUrl')
      //   mv.pathSelected = path
      //   localStorage.setItem('path' + typeUrl, path)
      // })
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      openFile () {
        this.$electron.ipcRenderer.send('open-file-dialog')
      }
    }
  }
</script>

<style>
</style>
