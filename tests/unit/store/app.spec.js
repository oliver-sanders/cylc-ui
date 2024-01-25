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

import { isReactive } from 'vue'
import { createStore } from 'vuex'
import storeOptions from '@/store/options'

/**
 * Tests for the store/app module.
 */
describe('app', () => {
  let store
  beforeEach(() => {
    store = createStore(storeOptions)
  })
  /**
   * Tests for store.app.drawer.
   */
  describe('drawer', () => {
    it('should start with no drawer', () => {
      expect(store.state.app.drawer).to.equal(null)
    })
    it('should set drawer', () => {
      const drawer = true
      store.commit('app/setDrawer', drawer)
      expect(store.state.app.drawer).to.equal(drawer)
    })
  })
  /**
   * Tests for store.app.title.
   */
  describe('title', () => {
    it('should start with no title', () => {
      expect(store.state.app.title).to.equal(null)
    })
    it('should set title', () => {
      const title = 'Cylc'
      store.commit('app/setTitle', title)
      expect(store.state.app.title).to.equal(title)
    })
  })

  describe('workspaceLayouts', () => {
    it('saves unproxied layout', () => {
      // Test that the Lumino layout saved in the store is not proxied, because
      // proxying the layout breaks some parts of the 3rd party Lumino backend
      const workflowName = 'zane'
      const fakeLayout = { a: { b: 'c' } }
      const fakeViews = new Map([[1, 2], [3, 4]])
      store.commit('app/saveLayout', { workflowName, layout: fakeLayout, views: fakeViews })
      const stored = store.state.app.workspaceLayouts.get(workflowName)
      expect(stored).toEqual({ layout: fakeLayout, views: fakeViews })
      expect(isReactive(stored.layout)).toBe(false)
    })
  })
})
