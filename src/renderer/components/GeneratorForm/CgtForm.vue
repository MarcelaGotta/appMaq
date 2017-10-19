<template>
  <div id="cgtForm">
    <el-form ref="cgt" :model="cgt" :rules="rules" label-width="120px" label-position="top">
        <el-form-item label="Nombre del Cgt" prop="nombreCGT">
            <el-input v-model="cgt.nombreCGT" :disabled="editcgt.nombreCGT !==''"></el-input>
        </el-form-item>
        <el-form-item label="Nombre del Módulo" prop="nombreMod" v-show="!editcgt.nombreCGT">
            <el-input v-model="cgt.nombreMod"></el-input>
        </el-form-item>
        <el-form-item label="Archivos que contiene" prop="mvcd" v-show="!editcgt.nombreCGT">
            <el-checkbox-group v-model="cgt.mvcd">
            <el-checkbox label="view.html" name="v"></el-checkbox>
            <el-checkbox label="controller.ejs" name="c"></el-checkbox>
            <el-checkbox label="model.ejs" name="m"></el-checkbox>
            <el-checkbox label="service.ejs" name="s"></el-checkbox>
            <el-checkbox label="directive.ejs" name="d"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Escribe los servicios" v-show="cgt.mvcd.indexOf('model.ejs') != -1">
            <el-tag
                :key="tag"
                v-for="tag in cgt.services"
                :closable="true"
                :close-transition="false"
                @close="handleClose(tag)"
            >
            {{tag}}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ Nueva Petición</el-button>
        </el-form-item>
        <el-form-item label="Es un estado?" v-show="!editcgt.nombreCGT">
            <el-switch on-text="" off-text="" v-model="cgt.isState"></el-switch>
        </el-form-item>

        <!--<transition name="el-zoom-in-bottom">
            <div v-show="cgt.isState" class="transition-box">
                <el-form-item label="Seleccciona los Módulos que vas a utilizar:">
                    <el-transfer
                        v-model="cgt.modules"
                        :data="dataModules"
                        :titles="['Módulos disponibles', 'Módulos seleccionados']">
                    </el-transfer>
                </el-form-item>
                <el-form-item label="Seleccciona los Componentes que vas a utilizar:">
                    <el-transfer
                        v-model="cgt.components"
                        :data="dataComponents"
                        :titles="['Comp. disponibles', 'Comp. seleccionados']">
                    </el-transfer>
                </el-form-item>
            </div>
        </transition>-->

        <el-form-item>
            <el-button type="primary" @click="addCgt(cgt)" v-if="isdialog && !editcgt.nombreCGT">Añadir</el-button>
            <el-button type="primary" @click="completeCgt(cgt)" v-else-if="editcgt.nombreCGT && editcgt.isTab">Añadir Servicios</el-button>
            <el-button type="primary" @click="updateCgt(cgt)" v-else-if="editcgt.nombreCGT && !editcgt.isTab">Actualizar</el-button>
            <el-button type="primary" @click="onSubmit('cgt')" v-else>Crear</el-button>
        </el-form-item>
        <el-alert
          :title="cgt.nombreCGT + ' se ha creado con éxito'"
          type="success"
          description="¡Perfecto! El Cgt ha sido creado con éxito. Ahora podrás encontrarlo en la carpeta del cnt"
          show-icon
          v-show="cgtCreated">
        </el-alert>
    </el-form>

    <!-- Dialogos -->
    <el-dialog
      title="Etiqueta no encontrada"
      :visible.sync="dialogError"
      size="small">
      <span>No se ha encontrado la etiqueta "/*GENERADOR_TELCO*/" en el app.js. Recuerda que para poder crear un estado es necesario añadir esta etiqueta dentro el app.js y en donde se quiera añadir dicho estado.</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogError = false">Cerrar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import CgtGenerator from '../../../generators/js/cgtGenerator'
  export default {
    name: 'cgt-form',
    props: ['pathparent', 'isdialog', 'editcgt'],
    data () {
      return {
        cgt: {
          nombreCGT: this.editcgt.nombreCGT || 'cgtPrueba',
          isState: this.editcgt.isState || false,
          mvcd: this.editcgt.mvcd || ['view.html', 'controller.ejs', 'service.ejs', 'model.ejs'],
          services: this.editcgt.services || [],
          modules: this.editcgt.modules || [],
          components: this.editcgt.components || [],
          nombreMod: this.editcgt.nombreMod || 'prue',
          mvcdMap: this.editcgt.mvcdMap || []
        },
        rules: {
          nombreCGT: [
            {required: true, message: 'Por favor ingresa el nombre del cgt', trigger: 'blur'}
          ],
          nombreMod: [
            {required: true, message: 'Por favor ingresa el nombre del módulo ej: cana, fact, futr', trigger: 'blur'}
          ],
          mvcd: [
            {type: 'array', required: true, message: 'Debes seleccionar al menos un archivo', trigger: 'blur'}
          ]
        },
        inputVisible: false,
        inputValue: '',
        dataModules: [
          {
            label: 'ngMessages',
            key: 'ngMessages'
          }, {
            label: 'uiDate',
            key: 'uiDate'
          }, {
            label: 'ngFileUpload',
            key: 'ngFileUpload'
          }
        ],
        dataComponents: [
          {
            label: 'Tablas',
            key: 'T3_CCP_UI_Grid.tablas'
          }, {
            label: 'Modales',
            key: 'T3_CCP_UI_Modales'
          }, {
            label: 'inputDate',
            key: 'T3_CCP_UI_datePicker.inputDate'
          }, {
            label: 'inputFile',
            key: 'T3_CCP_UI_InputFile'
          }
        ],
        dialogError: false,
        cgtCreated: false,
        checked: true
      }
    },
    mounted: function () {
      console.log(this.pathparent)
    },
    methods: {
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            CgtGenerator.generate(this, this.cgt, this.pathparent)
          } else {
            return false
          }
        })
      },

      handleClose (tag) {
        this.cgt.services.splice(this.cgt.services.indexOf(tag), 1)
      },

      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          this.cgt.services.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      addCgt (cgt) {
        this.$emit('add-cgt', cgt)
      },
      completeCgt (formName) {
        CgtGenerator.updateCgt(this, this.cgt, this.pathparent)
      },
      updateCgt (cgt) {
        console.log(cgt.nombreCGT)
        this.$emit('update-cgt', cgt, this.editcgt.id)
      }
    }
  }
</script>

<style>

</style>
