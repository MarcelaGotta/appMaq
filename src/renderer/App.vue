<template>
  <div id="app">
    <menu-explorer v-if="pathSelected.length !== 0" :path="pathSelected" class="col-izq"></menu-explorer>
    <router-view :paths="pathSelected" class="contenido" :class="pathSelected.length !== 0 ? 'with-sidebar' : ''"></router-view>
  </div>
</template>

<script>
  import MenuExplorer from './components/FileManager/MenuExplorer.vue'
  const settings = require('electron-settings')
  export default {
    name: 'front-telco',
    components: {MenuExplorer},
    data: function () {
      return {
        pathSelected: settings.get('path') || [],
        width: 0,
        height: 0,
        x: 0,
        y: 0
      }
    },
    methods: {
      onResize: function (x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
      }
    },
    mounted: function () {
      let mv = this
      this.$bus.$on('path-change', (event) => {
        mv.pathSelected = event
      })
    }
  }
</script>

<style>
  /* CSS */
  body {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    margin: 0;
  }

  #app {
    display: flex;
  }

  .col-izq {
    width: 300px;
    height: 100vh;
    background-color: #1f2d3d;
    overflow-y: auto 
  }

  .contenido {
    width: 100%;
    height: 100vh;
    overflow-y: auto 
  }

  .contenido.with-sidebar {
    width: calc(100% - 300px);
  }
</style>
