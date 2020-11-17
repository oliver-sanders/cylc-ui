/**
 * Copyright (C) NIWA & British Crown (Met Office) & Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
  filterAssociations,
  getType,
  tokenise
} from '@/utils/aotf'

/**
 * Cylc Objects plug-in.
 */
export default {
  /**
   * Called when the Vue application is created, and this plug-in is loaded.
   * @param Vue {object} - Vue application
   * @param options {*} - options passed to the plug-in (if any)
   */
  install (Vue, options) {
    // add a global directive
    Vue.directive('cylc-object', {
      bind (el, binding, vnode) {
        const cylcId = binding.value
        const tokens = tokenise(cylcId)
        const type = getType(tokens)
        const mutations = vnode.context.$workflowService.mutations
        el.addEventListener('click', function () {
          const componentMutations = filterAssociations(
            type,
            tokens,
            mutations
          )[0]
          vnode.context.$emit('show-mutations-menu', componentMutations)
        })
      }
    })
  }
}
