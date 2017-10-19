<template>
  <main>
    <el-tabs v-model="activeName" type="border-card" @tab-remove="removeTab">
      <el-tab-pane key="first" label="Inicio" name="first">
        <welcome-page v-if="paths.length === 0 || !paths"></welcome-page>
        <cgt-list v-else-if="cgtList" :infocgt="cgtList" v-on:new-tab="newTab"></cgt-list>
        <div v-else>
          <p>Selecciona un CNT para empezar a trabajar con el generador</p>
        </div>
      </el-tab-pane>
      <el-tab-pane v-for="(item, index) in tabList" :key="item.name" :label="item.title" :name="item.name" closable>
        <cnt-form :pathdir="item.pathCnt" v-if="item.type === 'cnt'"></cnt-form>
        <cgt-form :pathparent="item.pathCnt" :editcgt="item" v-else-if="item.type === 'cgt'"></cgt-form>
      </el-tab-pane>
      <el-tab-pane key="last" label="grunt" name="last">

        <grunt-temp   v-on:new-tab="newTab"></grunt-temp>

      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<script>
  import CgtList from './FileManager/CgtList.vue'
  import CgtForm from './GeneratorForm/CgtForm.vue'
  import CntForm from './GeneratorForm/CntForm.vue'
  import WelcomePage from './FileManager/WelcomePage.vue'
  import GruntTemp from './FileManager/grunt.vue'
  const fs = require('fs-extra')
  const path = require('path')
  export default {
    name: 'file-manager',
    components: {WelcomePage, CgtList, CgtForm, CntForm, GruntTemp},
    data: function () {
      return {
        openExplorer: false,
        cgtList: null,
        activeName: 'first',
        tabList: [],
        pathCnt: null
      }
    },
    props: ['paths'],
    mounted: function () {
      let mv = this
      this.$bus.$on('send-path-cnt', (path) => {
        mv.cgtList = {
          cntPath: path,
          list: fs.readdirSync(path + '/cgt')
        }
        mv.pathCnt = path
        mv.activeName = 'first'

        fs.watch(path + '/cgt', (curr, prev) => {
          this.cgtList.list = fs.readdirSync(path + '/cgt')
        })
      })

      this.$bus.$on('new-cnt', (pathDir) => {
        let cntTemplate = {
          name: path.basename(pathDir) + 'NewCGT',
          title: `CNT Nuevo - ${path.basename(pathDir)}`,
          pathCnt: pathDir,
          type: 'cnt'
        }
        this.newTab(cntTemplate)
      })
      /* mv.$electron.ipcRenderer.on('selected-directory', function (event, path) {
        localStorage.setItem('path', path)
        mv.$bus.$emit('path-change', path)
        mv.$router.push('/generator')
      }) */
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      openFile () {
        this.$electron.ipcRenderer.send('open-file-dialog')
      },
      removeTab (targetName) {
        let tabs = this.tabList
        let activeName = this.activeName
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1] || {name: 'first'}
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.activeName = activeName
        this.tabList = tabs.filter(tab => tab.name !== targetName)
      },
      newTab (data) {
        if (!this.tabList.find((tab) => tab.name === data.name)) {
          this.tabList.push(data)
        }
        this.activeName = data.name
      }
    }
  }
</script>

<style>
  .el-tabs--border-card {
    min-height: 99%;
  }
</style>
