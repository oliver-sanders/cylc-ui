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
  <el-card
    class="boc-card"
  >
    <div slot="header">
      <!-- the mutation title -->
      <h3 style="text-transform: capitalize;">
        {{ mutation._title }}
      </h3>

      <!-- the mutation description -->
      <Markdown :markdown="shortDescription"/>
      <el-collapse-transition>
        <div v-show="extendedDescription && showDescription">
          <Markdown :markdown="extendedDescription"/>
        </div>

      </el-collapse-transition>
      <el-button
        v-show="extendedDescription"
        @click="showDescription = !showDescription"
      >
        {{ showDescription ? 'Collapse' : 'Expand' }}
      </el-button>
    </div>

    <div>
      <!-- the form -->
      <EditRuntimeForm
        v-if="mutation.name === 'editRuntime'"
        v-bind="{
          cylcObject,
          types
        }"
        ref="form"
        v-model="isValid"
      />
      <FormGenerator
        v-else
        v-bind="{
          mutation,
          types,
          initialData
        }"
        ref="form"
        v-model="isValid"
      />

      <!-- the actions -->
      <br />
      <div>
        <el-button
          type="info"
          @click="cancel()"
          data-cy="cancel"
        >
          Cancel
        </el-button>
        <el-button
          type="warning"
          @click="$refs.form.reset()"
          data-cy="reset"
        >
          Reset
        </el-button>
        <el-tooltip
          placement="top"
          :disabled="isValid"
        >
          <div slot="content">
            <span>Form contains invalid or missing values!</span>
          </div>
          <!-- TODO
            :loading="submitting"
          -->
          <el-button
            :type="isValid ? 'primary' : 'danger'"
            @click="submit"
            v-bind="attrs"
            data-cy="submit"
          >
            Submit
          </el-button>
        </el-tooltip>
      </div>
      <v-snackbar
        v-model="showSnackbar"
        v-bind="snackbarProps"
        data-cy="response-snackbar"
      >
        {{ response.msg }}
        <template v-slot:action="{ attrs }">
          <v-btn
            @click="showSnackbar = false"
            icon
            v-bind="attrs"
            data-cy="snackbar-close"
          >
            <v-icon>
              {{ $options.icons.close }}
            </v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </el-card>
</template>

<script>
import FormGenerator from '@/components/graphqlFormGenerator/FormGenerator.vue'
import EditRuntimeForm from '@/components/graphqlFormGenerator/EditRuntimeForm.vue'
import Markdown from '@/components/Markdown'
import {
  getMutationShortDesc,
  getMutationExtendedDesc
} from '@/utils/aotf'
import { mdiClose } from '@mdi/js'

export default {
  name: 'mutation',

  components: {
    EditRuntimeForm,
    FormGenerator,
    Markdown
  },

  props: {
    mutation: {
      // graphql mutation object as returned by introspection query
      type: Object,
      required: true
    },
    cylcObject: {
      // { id, isFamily }
      type: Object,
      required: true
    },
    types: {
      // list of all graphql types as returned by introspection query
      // (required for resolving InputType objects
      type: Array
    },
    initialData: {
      type: Object,
      required: false,
      default: () => {}
    },
    cancel: {
      type: Function,
      required: true
    }
  },

  data: () => ({
    isValid: false,
    submitting: false,
    showDescription: false,
    response: {
      msg: null,
      level: 'warn'
    }
  }),

  computed: {
    /* Return the first line of the description. */
    shortDescription () {
      return getMutationShortDesc(this.mutation.description)
    },
    /* Return the subsequent lines of the description */
    extendedDescription () {
      return getMutationExtendedDesc(this.mutation.description)
    },
    showSnackbar: {
      get () {
        return Boolean(this.response.msg)
      },
      set (val) {
        if (!val) this.response.msg = null
      }
    },
    snackbarProps () {
      return this.response.level === 'error'
        ? {
          timeout: -1,
          color: 'red accent-2',
          dark: true
        }
        : {
          timeout: 4e3,
          color: 'amber accent-2',
          light: true
        }
    }
  },

  methods: {
    /* Execute the GraphQL mutation */
    submit () {
      this.submitting = true
      this.$refs.form.submit().then(response => {
        this.submitting = false
        if (response.status.name.includes('failed')) {
          this.response.msg = response.message
          this.response.level = 'error'
        } else if (response.status.name === 'warn') {
          this.response.msg = response.message
          this.response.level = 'warn'
        } else {
          // Close the form on success
          this.cancel()
        }
      })
    }
  },

  // Misc options
  icons: {
    close: mdiClose
  }
}
</script>
