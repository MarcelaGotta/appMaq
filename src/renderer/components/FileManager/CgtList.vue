<template>
  <div>
    <el-button type="primary" icon="plus" @click="addCGT()">Añadir CGT</el-button>
    <ul class="cgt-list">
      <li v-for="cgt in infocgt.list"  @click="addCGT(cgt)">
        <i class="el-icon-document"></i>
        {{cgt}}
      </li>
    </ul>
  </div>
</template>

<script>
  const path = require('path')
  export default {
    name: 'cgt-list',
    props: ['infocgt'],
    data: function () {
      return {
      }
    },
    methods: {
      addCGT (cgt) {
        let cgtTemplate = {}
        if (cgt) {
          cgtTemplate = {
            name: path.basename(this.infocgt.cntPath) + cgt,
            title: `CGT ${cgt} - ${path.basename(this.infocgt.cntPath)}`,
            pathCnt: this.infocgt.cntPath,
            type: 'cgt',
            nombreCGT: cgt,
            nombreMod: path.basename(this.infocgt.cntPath).split('-')[0],
            isTab: true
          }
        } else {
          cgtTemplate = {
            name: path.basename(this.infocgt.cntPath) + 'NewCGT',
            title: `CGT Nuevo - ${path.basename(this.infocgt.cntPath)}`,
            pathCnt: this.infocgt.cntPath,
            type: 'cgt',
            nombreCGT: '',
            nombreMod: path.basename(this.infocgt.cntPath).split('-')[0],
            isTab: true
          }
        }
        this.$emit('new-tab', cgtTemplate)
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
  .cgt-list li:hover {
      cursor:pointer;
  }
</style>
