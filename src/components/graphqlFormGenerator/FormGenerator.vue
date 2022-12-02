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
  <el-form
    :value="value"
    label-width="auto"
    @input="$emit('input', $event)"
  >
    <!-- the form inputs -->
    <el-form-item
      v-for="input in inputs"
      v-bind:key="input.label"
      :label="input.label"
    >
      <!-- the label -->
      <template v-slot:label>
        {{ input.title }}

        <!-- the help button/popover -->
        <el-popover
          trigger="click"
          width="350"
          style="padding-left: 0.5em;"
        >
          <el-button
            circle
            size="mini"
            slot="reference"
            icon="el-icon-help"
          />
          <!-- the help text -->
          <template>
            <Markdown :markdown="input.description" />
          </template>
        </el-popover>
      </template>

      <!-- the input -->
      <FormInput
        v-model="model[input.label]"
        :gqlType="input.gqlType"
        :types="types"
        :label="input.label"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { mdiHelpCircleOutline } from '@mdi/js'

import Markdown from '@/components/Markdown'
import FormInput from '@/components/graphqlFormGenerator/FormInput'
import { getNullValue, mutate } from '@/utils/aotf'

export default {
  name: 'form-generator',

  components: {
    Markdown,
    FormInput
  },

  props: {
    value: {
      // validity of form
      type: Boolean,
      required: false,
      default: () => false
    },
    mutation: {
      type: Object,
      required: true
    },
    types: {
      type: Array,
      default: () => []
    },
    initialData: {
      type: Object
    }
  },

  data: () => ({
    model: {},
    icons: {
      help: mdiHelpCircleOutline
    }
  }),

  created () {
    this.reset()
  },

  computed: {
    /* Provide a list of all form inputs for this mutation. */
    inputs () {
      const ret = []
      let type
      for (const arg of this.mutation.args) {
        type = this.types.filter((type) =>
          type.name === arg.type.name && type.kind === arg.type.kind
        )
        let help = arg.description || ''
        if (type.length && type[0].description) {
          // if the type has help add it onto the end of the description
          help = `${help}\n\n${type[0].description}`
        }

        ret.push({
          gqlType: arg.type,
          title: arg._title,
          label: arg.name,
          description: help
        })
      }
      return ret
    }
  },

  methods: {
    /* Set this form to its initial conditions. */
    reset () {
      // begin with the initial data
      const model = cloneDeep(this.initialData || {})

      // then apply default values from the schema
      let defaultValue
      for (const arg of this.mutation.args) {
        if (arg.name in model) {
          // if the argument is defined in the initial data leave it unchanged
          continue
        }
        if (arg.defaultValue) {
          // if a default value is provided in the schema use it
          defaultValue = JSON.parse(
            // default values arrive as JSON strings in the introspection
            // result so need to be converted here
            arg.defaultValue
          )
          if (!defaultValue) {
            defaultValue = getNullValue(arg.type, this.types)
          }
        } else {
          // if no default value is provided choose a sensible null value
          // NOTE: IF we set null as the default type for a list
          //       THEN tried to change it to [] later this would break
          //       THIS would break Vue model
          defaultValue = getNullValue(arg.type, this.types)
        }
        model[arg.name] = defaultValue
      }

      // done
      this.model = model
    },

    async submit () {
      return await mutate(
        this.mutation,
        this.model,
        this.$workflowService.apolloClient
      )
    }
  }
}
</script>
