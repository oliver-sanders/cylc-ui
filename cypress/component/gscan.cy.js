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

import GScanComponent from '@/components/cylc/gscan/GScan'
import { WorkflowState } from '@/model/WorkflowState.model'

const WORKFLOWS = [
  {
    id: '~u/a',
    name: 'a',
    type: 'workflow-part',
    tokens: { user: 'u', workflow: 'a' },
    node: {},
    children: [
      {
        id: '~u/a/a1',
        name: 'a1',
        type: 'workflow',
        tokens: { user: 'u', workflow: 'a/a1' },
        node: { state: WorkflowState.RUNNING.name, latestStateTasks: { submitted: [] } },
        children: []
      }
    ]
  }
]

describe('GScan component', () => {
  it('loads', () => {
    cy.vmount(
      GScanComponent,
      { propsData: { workflows: WORKFLOWS, isLoading: false } }
    )
  })
})
