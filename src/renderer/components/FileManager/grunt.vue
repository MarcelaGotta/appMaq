<template>
<div id="cgtForm">
  <el-form ref="igrunt" :model="igrunt" :rules="rules" label-width="120px" label-position="top">
    <el-form-item label="Tarea que queremos lanzar" prop="radio2">
        <el-radio-group v-model="igrunt.radio2">
        <el-radio label="sass">svn</el-radio>
        <el-radio label="svnMaq:update">actualiza maqueta</el-radio>
        <el-radio label="svnArq:update">actualiza arquitectura</el-radio>
        <el-radio label="replace:httpd">replace:httpd</el-radio>
        <el-radio label="checkCSS">chequearCss</el-radio>
        <el-radio label="duplicates">comprobarDuplicados</el-radio>
        <el-radio label="descuadreAris">descuadreAris</el-radio>
        <el-radio label="xlsx_to_json:cg">convertir Json</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-button type="primary" icon="plus" @click="runGrunt">runGrunt</el-button>
  </el-form>
  <ul class="cgt-list">
    <li v-for="lineLog in stdOut">
      {{lineLog}}
    </li>
  </ul>
  </div>
</template>

<script>
//  const path = require('path')
const { spawn } = require('child_process')
const settings = require('electron-settings')

export default {
  name: 'grunt',

  data: function () {
    return {
      stdOut: [],
      igrunt: {radio2: ['sass', 'svnMaq:update', 'svnArq:update', 'replace:httpd', 'checkCSS', 'duplicates', 'descuadreAris', 'xlsx_to_json:cg']},
      rules: {}
    }
  },
  methods: {
    runGrunt () {
      const pathgrunt = settings.get('pathgrunt')
      const ls = spawn('cmd.exe', ['/c', 'grunt ' + this.igrunt.radio2], {cwd: pathgrunt + '\\'})
      ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
        this.stdOut.push(`${data}`)
      })
      ls.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`)
      })
      ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
      })
    }
  }
}
</script>

<style>
  .cgt-list li{
    list-style: none;
    font-size: 14px;
    padding: 10px 0;
  }
</style>
