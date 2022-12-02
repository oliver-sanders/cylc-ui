<!--
Copyright (C) NIWA & British Crown (Met Office) & Contributors.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<template>
  <div class="g-list">
    <el-row
      v-for="(item, index) in value"
      :key="index"
    >
      <el-col :span="21">
        <!-- The input -->
        <component
          v-model="value[index]"
          :propOverrides="{dense: true}"
          :gqlType="gqlType.ofType"
          :types="types"
          :is="FormInput"
          ref="inputs"
        />
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button
          circle
          @click="remove(index)"
          v-bind="slotProps"
          class="remove-btn"
          icon="el-icon-close"
          type="info"
        />
      </el-col>
    </el-row>

    <el-button
      @click="add()"
      data-cy="add"
      icon="el-icon-circle-plus"
      type="info"
    >
      <span>Add Item</span>
    </el-button>
  </div>
</template>

<script>
import { formElement } from '@/components/graphqlFormGenerator/mixins'
import { getNullValue } from '@/utils/aotf'
import { mdiPlusCircle, mdiCloseCircle } from '@mdi/js'
import Vue from 'vue'

export default {
  name: 'g-list',

  mixins: [
    formElement
  ],

  props: {
    addAtStart: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      svgPaths: {
        open: mdiPlusCircle,
        close: mdiCloseCircle
      }
    }
  },

  methods: {
    /** Add an item to the list. */
    add () {
      const newInput = getNullValue(this.gqlType.ofType, this.types)
      let index = 0
      if (this.addAtStart) {
        this.value.unshift(newInput)
      } else {
        index = this.value.length
        this.value.push(newInput)
      }
      // this is not ideal, but I believe whats happening is the new (wrapper) component is created over the first tick from the new array item
      // the component content is created over the next tick (including the input)
      Vue.nextTick(() => {
        Vue.nextTick(() => {
          // get the latest input ref (which is a tooltip for some reason), get its parent, then the input itself and focus() it (if it exists)
          this.$refs.inputs[index].$el?.parentNode?.querySelector('input')?.focus()
        })
      })
    },

    /** Remove the item at `index` from the list. */
    remove (index) {
      this.value.splice(index, 1)
    }
  }
}
</script>

<style style="scss">
.g-list > .el-row {
  margin-bottom: 2em;
}
</style>
