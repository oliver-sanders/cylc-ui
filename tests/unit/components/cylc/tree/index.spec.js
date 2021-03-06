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
  createJobNode,
  getCyclePointId
} from '@/components/cylc/tree/tree-nodes'
import {
  populateTreeFromGraphQLData
} from '@/components/cylc/tree/index'
import { expect } from 'chai'
import { sampleWorkflow1 } from './tree.data'
import CylcTree from '@/components/cylc/tree/cylc-tree'

const CYCLEPOINT_TYPE = 'cyclepoint'
const FAMILY_TYPE = 'family-proxy'
const TASK_TYPE = 'task-proxy'

describe('Tree component functions', () => {
  const cylcTree = new CylcTree()
  let workflowTree
  before(() => {
    cylcTree.clear()
    populateTreeFromGraphQLData(cylcTree, sampleWorkflow1)
    workflowTree = cylcTree.root.children
  })
  it('should add cycle points as direct children of the workflow', () => {
    expect(workflowTree.length).to.equal(2)
    expect(workflowTree[0].type).to.equal(CYCLEPOINT_TYPE)
    expect(workflowTree[1].type).to.equal(CYCLEPOINT_TYPE)
  })
  it('should add families and tasks as children to cycle points correctly', () => {
    // the first cycle point in the example data contains two families, and two tasks
    const firstCyclePoint = workflowTree[0]
    const children = firstCyclePoint.children
    expect(children[0].type).to.equal(FAMILY_TYPE)
    expect(children[1].type).to.equal(FAMILY_TYPE)
    expect(children[2].type).to.equal(TASK_TYPE)
    expect(children[2].type).to.equal(TASK_TYPE)
  })
  it('should add families as children to families correctly', () => {
    const workflowTree = cylcTree.root.children
    const firstCyclePoint = workflowTree[0]
    const children = firstCyclePoint.children
    expect(children[1].type).to.equal(FAMILY_TYPE)
    expect(children[1].node.name).to.equal('GOOD')
    expect(children[1].children[0].type).to.equal(FAMILY_TYPE)
    expect(children[1].children[0].node.name).to.equal('SUCCEEDED')
  })
  it('should not throw an error when the workflow to be populated is invalid', () => {
    const tree = {}
    const workflow = {}
    expect(populateTreeFromGraphQLData, null, workflow).to.not.throw(Error)
    expect(populateTreeFromGraphQLData, tree, null).to.not.throw(Error)
    expect(populateTreeFromGraphQLData, tree, workflow).to.not.throw(Error)
  })
  it('should extract the cycle point ID', () => {
    const tests = [
      {
        node: {
          id: ''
        },
        expected: Error
      },
      {
        node: {
          id: null
        },
        expected: Error
      },
      {
        node: {
          id: 'a'
        },
        expected: Error
      },
      {
        node: {
          id: 'a|b'
        },
        expected: Error
      },
      {
        noNode: {
          id: 'a|b'
        },
        expected: Error
      },
      {
        node: {
          id: 'a|b|c'
        },
        expected: 'a|b|c'
      },
      {
        node: {
          id: 'a|b|c|d'
        },
        expected: 'a|b|c'
      },
      {
        node: {
          id: 'a|b|c|d|e'
        },
        expected: 'a|b|c'
      },
      {
        node: {
          id: '|||'
        },
        expected: '||'
      }
    ]
    tests.forEach(test => {
      if (test.expected === Error) {
        expect(() => getCyclePointId(test.node)).to.throw(Error)
      } else {
        expect(getCyclePointId(test.node)).to.equal(test.expected)
      }
    })
  })
  it('should create custom outputs', () => {
    const job = sampleWorkflow1.taskProxies[0].jobs[0]
    const jobNode = createJobNode(job)
    // The outputs in the GraphQL returned data (and in our test data) contains
    // 4 outputs, submitted, started, succeeded, and the out1 custom output.
    // Here we are verifying that `createJobNode` did its work well, removing
    // the standard outputs, leaving only 1 custom output as below (eql = deep equal).
    expect(jobNode.node.customOutputs).to.eql([{
      id: 'cylc|one|20000101T0000Z|eventually_succeeded|4-output-out1',
      label: 'out1',
      message: 'Aliquam a lectus euismod, vehicula leo vel, ultricies odio.'
    }])
  })
})
