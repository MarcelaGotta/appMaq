<template>
  <main>
    <el-form ref="cnt" :model="cnt" :rules="rules" label-width="120px" label-position="top">
      <el-form-item label="Nombre del CNT" prop="nombreCNT">
          <el-input v-model="cnt.nombreCNT"></el-input>
      </el-form-item>
      <el-form-item label="Nombre del Módulo" prop="nombreMod">
          <el-input v-model="cnt.nombreMod"></el-input>
      </el-form-item>
      <el-form-item label="Además de la carpeta cgt. ¿Qué otra carpeta deseas crear?">
          <el-checkbox-group v-model="cnt.cntdir">
          <el-checkbox label="images" name="images"></el-checkbox>
          <el-checkbox label="css" name="css"></el-checkbox>
          </el-checkbox-group>
      </el-form-item>

          <el-checkbox label="responsive" name="Es responsive"  v-model="cnt.responsive"></el-checkbox>

      <el-form-item label="¿Deseas crear un cgt?">
          <el-button type="primary" @click="createCGT" icon="plus">Nuevo CGT</el-button>
      </el-form-item>
      <el-table :data="cnt.cgts" border v-show="cnt.cgts.length > 0">
        <el-table-column label="Estado principal" width="180">
          <template scope="scope">
            <el-radio class="radio" label="disabled" disabled v-if="!scope.row.isState" title="Este cgt no es un estado">No estado</el-radio>
            <el-radio class="radio" v-model="cnt.mainState" :label="scope.row.nombreCGT" v-else>Estado</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="nombreCGT" label="Nombre"></el-table-column>
        <el-table-column label="Operaciones" width="200">
          <template scope="scope">
            <!--<el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">Edit</el-button>-->
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="onSubmit('cnt')">Crear</el-button>
      <el-alert
          :title="cnt.nombreCNT + ' se ha creado con éxito'"
          type="success"
          description="¡Perfecto! El CNT ha sido creado con éxito. Ahora podrás encontrarlo en la carpeta del directorio"
          show-icon
          v-show="cntCreated">
        </el-alert>
    </el-form>
    <el-dialog
      title="Nuevo CGT"
      :visible.sync="dialogCGT"
      v-if="dialogCGT"
      size="small">
      <cgt-form @add-cgt="newCGT" @update-cgt="updateCGT" :editcgt="cgtSelect" :pathparent="`${pathdir}/${cnt.nombreMod}-${cnt.nombreCNT}`" isdialog="true"></cgt-form>
    </el-dialog>
  </main>
</template>

<script>
  import CntGenerator from '../../../generators/js/cntGenerator'
  import CgtForm from './../GeneratorForm/CgtForm.vue'
  export default {
    name: 'cnt-form',
    components: {CgtForm},
    data: function () {
      return {
        dialogCGT: false,
        cgtSelect: {},
        cntCreated: false,
        cnt: {
          nombreCNT: 'CntPrueba',
          nombreMod: 'prue',
          cntdir: [],
          cgts: [],
          mainState: ''
        },
        rules: {
          nombreCNT: [
            {required: true, message: 'Por favor ingresa el nombre del cgt', trigger: 'blur'}
          ],
          nombreMod: [
            {required: true, message: 'Por favor ingresa el nombre del módulo ej: cana, fact, futr', trigger: 'blur'}
          ]
        }
      }
    },
    props: ['pathdir'],
    methods: {
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            CntGenerator.generate(this, this.cnt, this.pathdir)
          } else {
            return false
          }
        })
      },
      createCGT () {
        this.cgtSelect = {}
        this.dialogCGT = true
      },
      newCGT (cgt) {
        this.cnt.cgts.push(cgt)
        if (!this.cnt.mainState && cgt.isState) this.cnt.mainState = cgt.nombreCGT
        this.dialogCGT = false
      },
      handleEdit (index, row) {
        let cgtEdit = row
        cgtEdit.id = index
        this.dialogCGT = true
        this.cgtSelect = cgtEdit
      },
      handleDelete (index, row) {
        let cgts = this.cnt.cgts
        this.cnt.cgts = cgts.filter(cgt => cgts.indexOf(cgt) !== index)
      },
      updateCGT (cgt, index) {
        let cgts = this.cnt.cgts
        this.cnt.cgts = cgts.splice(index, 1, cgt)
        this.dialogCGT = false
      }
    }
  }
</script>

<style>
</style>
